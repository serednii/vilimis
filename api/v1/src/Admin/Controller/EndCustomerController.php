<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\EndCustomer;
use API\Repository\EndCustomerRepository;
use API\Repository\ClientRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/endCustomer
 */
class EndCustomerController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var EndCustomerRepository
     */
    private $endCustomer_repository;

    /**
     * @var ClientRepository
     */
    private $client_id_repository;


    public function __construct(
        ClientRepository $client_id_repository,
        EventManager $eventManager,
        EndCustomerRepository $endCustomer_repository
    )
    {
        $this->client_id_repository = $client_id_repository;
        $this->eventManager = $eventManager;
        $this->endCustomer_repository = $endCustomer_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_endCustomer"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $endCustomer = new EndCustomer();
            $this->mapEntityFromArray($endCustomer, $postData, $filesData);

            EntityManager::save($endCustomer);

            Router::redirectTo("admin_endCustomer");
        }

        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $endCustomers = $this->endCustomer_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/endCustomer/index.html.twig", [
            "client_ids" => $client_ids,
            "endCustomers" => $endCustomers
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_endCustomer_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $endCustomer = $this->endCustomer_repository->find($id);
            $this->mapEntityFromArray($endCustomer, $postData, $filesData);

            EntityManager::save($endCustomer);
            $endCustomer = $this->triggerSave($endCustomer);

            Router::redirectTo("admin_endCustomer_edit", ["id"=>$endCustomer->getId()]);
        }

        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $endCustomer = $this->endCustomer_repository->find($id);

        return AdminResponse::createResponse("admin/endCustomer/edit.html.twig", [
            "client_ids" => $client_ids,
            "endCustomer" => $endCustomer
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_endCustomer_delete"
     * }
     */
    public function delete($id)
    {
        $endCustomer = $this->endCustomer_repository->find($id);
        EntityManager::remove($endCustomer);

        Router::redirectTo("admin_endCustomer");
    }

    private function mapEntityFromArray(EndCustomer $endCustomer, array $data, array $files) {
        $endCustomer->setName($data["name"]);
        $endCustomer->setWeb($data["web"]);
        $endCustomer->setClientId(!empty($data["client_id"]) ? (int) $data["client_id"] : null);
        if (!empty($files["logo"]) && $files["logo"] instanceof UploadedFileInterface) {
            $endCustomer->setLogo($this->uploadFile($files["logo"]));
        }
        if (isset($data["logo_delete"])) {
            $endCustomer->setLogo("");
        }
        $endCustomer->setIc($data["ic"]);
        $endCustomer->setAddress($data["address"]);
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


    private function triggerSave(EndCustomer $endCustomer): EndCustomer
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "endCustomer" => $endCustomer
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("endCustomer");
    }
}