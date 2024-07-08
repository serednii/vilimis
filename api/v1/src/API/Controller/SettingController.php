<?php

namespace API\Controller;

use API\Entity\Setting;
use API\Repository\SettingRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /setting
 */
class SettingController extends AbstractApiController
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

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        SettingRepository $setting_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->setting_repository = $setting_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "setting_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $settings = $this->setting_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $settings
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "setting_single"
     * }
     */
    public function single($id)
    {
        $setting = $this->setting_repository->find($id);

        if (!$setting) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $setting
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "setting_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["key"])) {

            if (!empty($postData["id"])) {
                $setting = $this->setting_repository->find($postData["id"]);


                if (!$setting) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $setting = new Setting();
            }
            $this->mapEntityFromArray($setting, $postData, $filesData);

            EntityManager::save($setting);

            $setting = $this->triggerSave($setting);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "setting" => $setting,
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
     *  "name": "setting_delete"
     * }
     */
    public function delete($id)
    {
        $setting = $this->setting_repository->find($id);
        EntityManager::remove($setting);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "setting_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $settings = $this->setting_repository->findBy($filter);

        if (is_array($settings) && count($settings) > 0) {
            foreach ($settings as $setting) {
                EntityManager::remove($setting);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
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