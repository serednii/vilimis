<?php

namespace API\Controller;

use API\Entity\ClientContact;
use API\Repository\ClientContactRepository;
use API\Repository\ClientRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /clientContact
 */
class ClientContactController extends AbstractApiController
{
    /**
     * @var ClientContactRepository
     */
    private $clientContact_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    public function __construct(
        ClientContactRepository $clientContact_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->clientContact_repository = $clientContact_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "clientContact_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $clientContacts = $this->clientContact_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $clientContacts
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "clientContact_single"
     * }
     */
    public function single($id)
    {
        $clientContact = $this->clientContact_repository->find($id);

        if (!$clientContact) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $clientContact
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "clientContact_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $clientContact = $this->clientContact_repository->find($postData["id"]);


                if (!$clientContact) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $clientContact = new ClientContact();
            }
            $this->mapEntityFromArray($clientContact, $postData, $filesData);

            EntityManager::save($clientContact);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "clientContact" => $clientContact,
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
     *  "name": "clientContact_delete"
     * }
     */
    public function delete($id)
    {
        $clientContact = $this->clientContact_repository->find($id);
        EntityManager::remove($clientContact);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(ClientContact $clientContact, array $data, array $files) {
        $clientContact->setName($data["name"]);
        $clientContact->setSurname($data["surname"]);
        $clientContact->setPosition($data["position"]);
        $clientContact->setClientId(!empty($data["client_id"]) ? (int) $data["client_id"] : null);
        $clientContact->setPhone($data["phone"]);
        $clientContact->setEmail($data["email"]);
        if (!empty($files["photo"]) && $files["photo"] instanceof UploadedFileInterface) {
            $clientContact->setPhoto($this->uploadFile($files["photo"]));
        }
        if (isset($data["photo_delete"])) {
            $clientContact->setPhoto("");
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

}