<?php

namespace API\Controller;

use API\Entity\InvoiceItem;
use API\Entity\InvoiceItemStatus;
use API\Entity\Setting;
use API\Repository\InvoiceItemRepository;
use API\Repository\SettingRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /settings
 */
class SettingsController extends AbstractApiController
{

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;
    private SettingRepository $settingRepository;

    public function __construct(
        SettingRepository $settingRepository,
        JsonResponseFactory   $jsonResponseFactory,
        JsonSerializator      $jsonSerializator
    )
    {
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->settingRepository = $settingRepository;
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "settings_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();

        if (!empty($postData["settings"]) && is_array($postData["settings"])) {
            foreach ($postData["settings"] as $settingKey => $settingValue) {
                $settings = $this->settingRepository->findBy(["`key` = %1", $settingKey]);
                $setting = null;
                if (count($settings) > 0) {
                    $setting = $settings[0];
                }

                if (empty($setting)) {
                    $setting = new Setting();
                    $setting->setKey($settingKey);
                }

                if ($setting->getValue() != $settingValue) {
                    $setting->setValue($settingValue);
                    EntityManager::save($setting);
                }
            }


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Uloženo",
                "code" => 200
            ]));
        }


        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Chybí data",
            "code" => 500
        ]));
    }


    private function mapEntityFromArray(InvoiceItemStatus $invoiceItemStatus, array $data, array $files)
    {
        $invoiceItemStatus->setName($data["name"]);
        $invoiceItemStatus->setColor($data["color"]);
        $invoiceItemStatus->setPriority(isset($data["priority"]) ? (int)$data["priority"] : 0);
    }

}