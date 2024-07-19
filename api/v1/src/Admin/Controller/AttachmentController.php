<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Attachment;
use API\Repository\AttachmentRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/attachment
 */
class AttachmentController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var AttachmentRepository
     */
    private $attachment_repository;


    public function __construct(
        EventManager $eventManager,
        AttachmentRepository $attachment_repository
    )
    {
        $this->eventManager = $eventManager;
        $this->attachment_repository = $attachment_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_attachment"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $attachment = new Attachment();
            $this->mapEntityFromArray($attachment, $postData, $filesData);

            EntityManager::save($attachment);

            Router::redirectTo("admin_attachment");
        }

        $attachments = $this->attachment_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/attachment/index.html.twig", [
            "attachments" => $attachments
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_attachment_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $attachment = $this->attachment_repository->find($id);
            $this->mapEntityFromArray($attachment, $postData, $filesData);

            EntityManager::save($attachment);
            $attachment = $this->triggerSave($attachment);

            Router::redirectTo("admin_attachment_edit", ["id"=>$attachment->getId()]);
        }

        $attachment = $this->attachment_repository->find($id);

        return AdminResponse::createResponse("admin/attachment/edit.html.twig", [
            "attachment" => $attachment
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_attachment_delete"
     * }
     */
    public function delete($id)
    {
        $attachment = $this->attachment_repository->find($id);
        EntityManager::remove($attachment);

        Router::redirectTo("admin_attachment");
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
}