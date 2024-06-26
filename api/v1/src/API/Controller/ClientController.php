<?php

namespace API\Controller;

use API\Entity\Client;
use API\Repository\ClientRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /client
 */
class ClientController extends AbstractApiController
{
    /**
     * @var ClientRepository
     */
    private $client_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        ClientRepository $client_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->client_repository = $client_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "client_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $clients = $this->client_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $clients
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "client_single"
     * }
     */
    public function single($id)
    {
        $client = $this->client_repository->find($id);

        if (!$client) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $client
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "client_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $client = $this->client_repository->find($postData["id"]);


                if (!$client) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $client = new Client();
            }
            $this->mapEntityFromArray($client, $postData, $filesData);

            EntityManager::save($client);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "client" => $client,
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
     *  "name": "client_delete"
     * }
     */
    public function delete($id)
    {
        $client = $this->client_repository->find($id);
        EntityManager::remove($client);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "client_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $clients = $this->client_repository->findBy($filter);

        if (is_array($clients) && count($clients) > 0) {
            foreach ($clients as $client) {
                EntityManager::remove($client);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(Client $client, array $data, array $files) {
        $client->setName($data["name"]);
        $client->setAddress($data["address"]);
        $client->setIc($data["ic"]);
        $client->setDic($data["dic"]);
        $client->setHourRate(isset($data["hour_rate"]) ? (int) $data["hour_rate"] : 0);
        $client->setEmail($data["email"]);
        $client->setPhone($data["phone"]);
        $client->setWeb($data["web"]);
        if (!empty($files["logo"]) && $files["logo"] instanceof UploadedFileInterface) {
            $client->setLogo($this->uploadFile($files["logo"]));
        }
        if (isset($data["logo_delete"])) {
            $client->setLogo("");
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