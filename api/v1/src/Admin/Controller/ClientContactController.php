<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\ClientContact;
use API\Repository\ClientContactRepository;
use API\Repository\ClientRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/clientContact
 */
class ClientContactController
{
    /**
     * @var ClientContactRepository
     */
    private $clientContact_repository;

    /**
     * @var ClientRepository
     */
    private $client_id_repository;


    public function __construct(
        ClientRepository $client_id_repository,
        ClientContactRepository $clientContact_repository
    )
    {
        $this->client_id_repository = $client_id_repository;
        $this->clientContact_repository = $clientContact_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_clientContact"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $clientContact = new ClientContact();
            $this->mapEntityFromArray($clientContact, $postData, $filesData);

            EntityManager::save($clientContact);

            Router::redirectTo("admin_clientContact");
        }

        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $clientContacts = $this->clientContact_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/clientContact/index.html.twig", [
            "client_ids" => $client_ids,
            "clientContacts" => $clientContacts
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_clientContact_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $clientContact = $this->clientContact_repository->find($id);
            $this->mapEntityFromArray($clientContact, $postData, $filesData);

            EntityManager::save($clientContact);

            Router::redirectTo("admin_clientContact_edit", ["id"=>$clientContact->getId()]);
        }

        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $clientContact = $this->clientContact_repository->find($id);

        return AdminResponse::createResponse("admin/clientContact/edit.html.twig", [
            "client_ids" => $client_ids,
            "clientContact" => $clientContact
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_clientContact_delete"
     * }
     */
    public function delete($id)
    {
        $clientContact = $this->clientContact_repository->find($id);
        EntityManager::remove($clientContact);

        Router::redirectTo("admin_clientContact");
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