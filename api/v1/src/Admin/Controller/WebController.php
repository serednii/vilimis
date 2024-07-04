<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Web;
use API\Repository\WebRepository;
use API\Repository\ClientRepository;
use API\Repository\EndCustomerRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/web
 */
class WebController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var WebRepository
     */
    private $web_repository;

    /**
     * @var WebRepository
     */
    private $parent_web_id_repository;

    /**
     * @var ClientRepository
     */
    private $client_id_repository;

    /**
     * @var EndCustomerRepository
     */
    private $end_customer_id_repository;


    public function __construct(
        WebRepository $parent_web_id_repository,
        ClientRepository $client_id_repository,
        EndCustomerRepository $end_customer_id_repository,
        EventManager $eventManager,
        WebRepository $web_repository
    )
    {
        $this->parent_web_id_repository = $parent_web_id_repository;
        $this->client_id_repository = $client_id_repository;
        $this->end_customer_id_repository = $end_customer_id_repository;
        $this->eventManager = $eventManager;
        $this->web_repository = $web_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_web"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $web = new Web();
            $this->mapEntityFromArray($web, $postData, $filesData);

            EntityManager::save($web);

            Router::redirectTo("admin_web");
        }

        $parent_web_ids = $this->parent_web_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $webs = $this->web_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/web/index.html.twig", [
            "parent_web_ids" => $parent_web_ids,
            "client_ids" => $client_ids,
            "end_customer_ids" => $end_customer_ids,
            "webs" => $webs
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_web_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $web = $this->web_repository->find($id);
            $this->mapEntityFromArray($web, $postData, $filesData);

            EntityManager::save($web);
            $web = $this->triggerSave($web);

            Router::redirectTo("admin_web_edit", ["id"=>$web->getId()]);
        }

        $parent_web_ids = $this->parent_web_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $web = $this->web_repository->find($id);

        return AdminResponse::createResponse("admin/web/edit.html.twig", [
            "parent_web_ids" => $parent_web_ids,
            "client_ids" => $client_ids,
            "end_customer_ids" => $end_customer_ids,
            "web" => $web
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_web_delete"
     * }
     */
    public function delete($id)
    {
        $web = $this->web_repository->find($id);
        EntityManager::remove($web);

        Router::redirectTo("admin_web");
    }

    private function mapEntityFromArray(Web $web, array $data, array $files) {
        $web->setName($data["name"]);
        $web->setUrl($data["url"]);
        $web->setParentWebId(!empty($data["parent_web_id"]) ? (int) $data["parent_web_id"] : null);
        $web->setAccesses($data["accesses"]);
        $web->setAccessesCrypted((bool) isset($data["accesses_crypted"]) ? $data["accesses_crypted"] : false);
        $web->setClientId(!empty($data["client_id"]) ? (int) $data["client_id"] : null);
        $web->setEndCustomerId(!empty($data["end_customer_id"]) ? (int) $data["end_customer_id"] : null);
        if (!empty($files["logo"]) && $files["logo"] instanceof UploadedFileInterface) {
            $web->setLogo($this->uploadFile($files["logo"]));
        }
        if (isset($data["logo_delete"])) {
            $web->setLogo("");
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


    private function triggerSave(Web $web): Web
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "web" => $web
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("web");
    }
}