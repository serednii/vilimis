<?php

namespace API\Controller;

use API\Entity\EndCustomerContact;
use API\Repository\EndCustomerContactRepository;
use API\Repository\EndCustomerRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /endCustomerContact
 */
class EndCustomerContactController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var EndCustomerContactRepository
     */
    private $endCustomerContact_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        EndCustomerContactRepository $endCustomerContact_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->endCustomerContact_repository = $endCustomerContact_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "endCustomerContact_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $endCustomerContacts = $this->endCustomerContact_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $endCustomerContacts
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "endCustomerContact_single"
     * }
     */
    public function single($id)
    {
        $endCustomerContact = $this->endCustomerContact_repository->find($id);

        if (!$endCustomerContact) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $endCustomerContact
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "endCustomerContact_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $endCustomerContact = $this->endCustomerContact_repository->find($postData["id"]);


                if (!$endCustomerContact) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $endCustomerContact = new EndCustomerContact();
            }
            $this->mapEntityFromArray($endCustomerContact, $postData, $filesData);

            EntityManager::save($endCustomerContact);

            $endCustomerContact = $this->triggerSave($endCustomerContact);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "endCustomerContact" => $endCustomerContact,
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
     *  "name": "endCustomerContact_delete"
     * }
     */
    public function delete($id)
    {
        $endCustomerContact = $this->endCustomerContact_repository->find($id);
        EntityManager::remove($endCustomerContact);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "endCustomerContact_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $endCustomerContacts = $this->endCustomerContact_repository->findBy($filter);

        if (is_array($endCustomerContacts) && count($endCustomerContacts) > 0) {
            foreach ($endCustomerContacts as $endCustomerContact) {
                EntityManager::remove($endCustomerContact);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(EndCustomerContact $endCustomerContact, array $data, array $files) {
        $endCustomerContact->setName($data["name"]);
        $endCustomerContact->setSurname($data["surname"]);
        $endCustomerContact->setPosition($data["position"]);
        $endCustomerContact->setEndCustomerId(!empty($data["end_customer_id"]) ? (int) $data["end_customer_id"] : null);
        $endCustomerContact->setPhone($data["phone"]);
        $endCustomerContact->setEmail($data["email"]);
        if (!empty($files["photo"]) && $files["photo"] instanceof UploadedFileInterface) {
            $endCustomerContact->setPhoto($this->uploadFile($files["photo"]));
        }
        if (isset($data["photo_delete"])) {
            $endCustomerContact->setPhoto("");
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


    private function triggerSave(EndCustomerContact $endCustomerContact): EndCustomerContact
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "endCustomerContact" => $endCustomerContact
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("endCustomerContact");
    }
}