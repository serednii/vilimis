<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\SessionType;
use API\Repository\SessionTypeRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/sessionType
 */
class SessionTypeController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var SessionTypeRepository
     */
    private $sessionType_repository;


    public function __construct(
        EventManager $eventManager,
        SessionTypeRepository $sessionType_repository
    )
    {
        $this->eventManager = $eventManager;
        $this->sessionType_repository = $sessionType_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_sessionType"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $sessionType = new SessionType();
            $this->mapEntityFromArray($sessionType, $postData, $filesData);

            EntityManager::save($sessionType);

            Router::redirectTo("admin_sessionType");
        }

        $sessionTypes = $this->sessionType_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/sessionType/index.html.twig", [
            "sessionTypes" => $sessionTypes
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_sessionType_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $sessionType = $this->sessionType_repository->find($id);
            $this->mapEntityFromArray($sessionType, $postData, $filesData);

            EntityManager::save($sessionType);
            $sessionType = $this->triggerSave($sessionType);

            Router::redirectTo("admin_sessionType_edit", ["id"=>$sessionType->getId()]);
        }

        $sessionType = $this->sessionType_repository->find($id);

        return AdminResponse::createResponse("admin/sessionType/edit.html.twig", [
            "sessionType" => $sessionType
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_sessionType_delete"
     * }
     */
    public function delete($id)
    {
        $sessionType = $this->sessionType_repository->find($id);
        EntityManager::remove($sessionType);

        Router::redirectTo("admin_sessionType");
    }

    private function mapEntityFromArray(SessionType $sessionType, array $data, array $files) {
        $sessionType->setName($data["name"]);
        $sessionType->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
        $sessionType->setColor($data["color"]);
        if (!empty($files["ico"]) && $files["ico"] instanceof UploadedFileInterface) {
            $sessionType->setIco($this->uploadFile($files["ico"]));
        }
        if (isset($data["ico_delete"])) {
            $sessionType->setIco("");
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


    private function triggerSave(SessionType $sessionType): SessionType
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "sessionType" => $sessionType
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("sessionType");
    }
}