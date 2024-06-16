<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Client;
use API\Repository\ClientRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/client
 */
class ClientController
{
    /**
     * @var ClientRepository
     */
    private $client_repository;


    public function __construct(
        ClientRepository $client_repository
    )
    {
        $this->client_repository = $client_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_client"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $client = new Client();
            $this->mapEntityFromArray($client, $postData, $filesData);

            EntityManager::save($client);

            Router::redirectTo("admin_client");
        }

        $clients = $this->client_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/client/index.html.twig", [
            "clients" => $clients
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_client_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $client = $this->client_repository->find($id);
            $this->mapEntityFromArray($client, $postData, $filesData);

            EntityManager::save($client);

            Router::redirectTo("admin_client_edit", ["id"=>$client->getId()]);
        }

        $client = $this->client_repository->find($id);

        return AdminResponse::createResponse("admin/client/edit.html.twig", [
            "client" => $client
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_client_delete"
     * }
     */
    public function delete($id)
    {
        $client = $this->client_repository->find($id);
        EntityManager::remove($client);

        Router::redirectTo("admin_client");
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