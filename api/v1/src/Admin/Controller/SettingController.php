<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Setting;
use API\Repository\SettingRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/setting
 */
class SettingController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var SettingRepository
     */
    private $setting_repository;


    public function __construct(
        EventManager $eventManager,
        SettingRepository $setting_repository
    )
    {
        $this->eventManager = $eventManager;
        $this->setting_repository = $setting_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_setting"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["key"])) {
            $setting = new Setting();
            $this->mapEntityFromArray($setting, $postData, $filesData);

            EntityManager::save($setting);

            Router::redirectTo("admin_setting");
        }

        $settings = $this->setting_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/setting/index.html.twig", [
            "settings" => $settings
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_setting_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["key"])) {
            $setting = $this->setting_repository->find($id);
            $this->mapEntityFromArray($setting, $postData, $filesData);

            EntityManager::save($setting);
            $setting = $this->triggerSave($setting);

            Router::redirectTo("admin_setting_edit", ["id"=>$setting->getId()]);
        }

        $setting = $this->setting_repository->find($id);

        return AdminResponse::createResponse("admin/setting/edit.html.twig", [
            "setting" => $setting
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_setting_delete"
     * }
     */
    public function delete($id)
    {
        $setting = $this->setting_repository->find($id);
        EntityManager::remove($setting);

        Router::redirectTo("admin_setting");
    }

    private function mapEntityFromArray(Setting $setting, array $data, array $files) {
        $setting->setKey($data["key"]);
        $setting->setValue($data["value"]);
    }


    private function triggerSave(Setting $setting): Setting
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "setting" => $setting
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("setting");
    }
}