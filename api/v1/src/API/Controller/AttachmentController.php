<?php

namespace API\Controller;

use API\Entity\Attachment;
use API\Repository\AttachmentRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /attachment
 * @Security ROLE_USER
 */
class AttachmentController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";
    const EVENT_BEFORE_SAVE = __CLASS__ . "::EVENT_BEFORE_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var AttachmentRepository
     */
    private $attachment_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        AttachmentRepository $attachment_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->attachment_repository = $attachment_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "attachment_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $attachments = $this->attachment_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $attachments
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "attachment_single"
     * }
     */
    public function single($id)
    {
        $attachment = $this->attachment_repository->find($id);

        if (!$attachment) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $attachment
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "attachment_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $attachment = $this->attachment_repository->find($postData["id"]);


                if (!$attachment) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $attachment = new Attachment();
            }
            $this->mapEntityFromArray($attachment, $postData, $filesData);

            try {
                $attachment = $this->triggerBeforeSave($attachment);

                EntityManager::save($attachment);

                $attachment = $this->triggerSave($attachment);
            } catch (\Exception $exception) {
                return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                    "message" => $exception->getMessage(),
                    "code" => 500
                ]));
            }

            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "attachment" => $attachment,
                "message" => "Uloženo",
                "code" => 200
            ]));
        }


        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Chybí data",
            "code" => 500
        ]));
    }


    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "attachment_delete"
     * }
     */
    public function delete($id)
    {
        $attachment = $this->attachment_repository->find($id);
        EntityManager::remove($attachment);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "attachment_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $attachments = $this->attachment_repository->findBy($filter);

        if (is_array($attachments) && count($attachments) > 0) {
            foreach ($attachments as $attachment) {
                EntityManager::remove($attachment);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(Attachment $attachment, array $data, array $files) {
        $attachment->setName($data["name"]);
        $attachment->setEntity($data["entity"]);
        $attachment->setEntityId(isset($data["entity_id"]) ? (int) $data["entity_id"] : 0);
        $attachment->setCreated(!empty($data["created"]) ? new \DateTime($data["created"]) : null);
        if (!empty($files["file"]) && $files["file"] instanceof UploadedFileInterface) {
            $attachment->setFile($this->uploadFile($files["file"]));
        }
        if (isset($data["file_delete"])) {
            $attachment->setFile("");
        }
    }

    private function uploadFile(UploadedFileInterface $file): string
    {
        $client_filename = $file->getClientFilename();
        $filename = md5($client_filename.time()) . "." . substr($client_filename, -4);
        $dir1 = substr($filename, 0, 2);
        $dir2 = substr($filename, 2, 2);
        $upload_dir = __DIR__ . "/../../../web/upload";
        $target = $upload_dir . "/" . $dir1 . "/" . $dir2 . "/" . $filename;

        if (!is_dir($upload_dir . "/" . $dir1)) {
            @mkdir($upload_dir . "/" . $dir1);
            @chmod($upload_dir . "/" . $dir1, 0777);
        }

        if (!is_dir($upload_dir . "/" . $dir1 . "/" . $dir2)) {
            @mkdir($upload_dir . "/" . $dir1 . "/" . $dir2);
            @chmod($upload_dir . "/" . $dir1 . "/" . $dir2, 0777);
        }

        if ($file->moveTo($target)) {
            @chmod($target, 0777);
            return $dir1 . "/" . $dir2 . "/" . $filename;
        }

        return "";
    }


    private function triggerSave(Attachment $attachment): Attachment
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "attachment" => $attachment
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("attachment");
    }

    private function triggerBeforeSave(Attachment $attachment): Attachment
    {
        $event = new Event();
        $event->setName(self::EVENT_BEFORE_SAVE);
        $event->setParams([
            "attachment" => $attachment
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("attachment");
    }
}