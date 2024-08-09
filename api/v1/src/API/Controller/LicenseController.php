<?php

namespace API\Controller;

use API\Entity\License;
use API\Repository\LicenseRepository;
use API\Repository\ProjectRepository;
use API\Repository\ClientRepository;
use API\Repository\EndCustomerRepository;
use API\Repository\CostRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /license
 * @Security ROLE_USER
 */
class LicenseController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";
    const EVENT_BEFORE_SAVE = __CLASS__ . "::EVENT_BEFORE_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var LicenseRepository
     */
    private $license_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        LicenseRepository $license_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->license_repository = $license_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "license_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $licenses = $this->license_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $licenses
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "license_single"
     * }
     */
    public function single($id)
    {
        $license = $this->license_repository->find($id);

        if (!$license) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $license
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "license_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $license = $this->license_repository->find($postData["id"]);


                if (!$license) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $license = new License();
            }
            $this->mapEntityFromArray($license, $postData, $filesData);

            try {
                $license = $this->triggerBeforeSave($license);

                EntityManager::save($license);

                $license = $this->triggerSave($license);
            } catch (\Exception $exception) {
                return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                    "message" => $exception->getMessage(),
                    "code" => 500
                ]));
            }

            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "license" => $license,
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
     *  "name": "license_delete"
     * }
     */
    public function delete($id)
    {
        $license = $this->license_repository->find($id);
        EntityManager::remove($license);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "license_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $licenses = $this->license_repository->findBy($filter);

        if (is_array($licenses) && count($licenses) > 0) {
            foreach ($licenses as $license) {
                EntityManager::remove($license);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(License $license, array $data, array $files) {
        $license->setName($data["name"]);
        $license->setDescription($data["description"]);
        $license->setDateFrom(!empty($data["date_from"]) ? new \DateTime($data["date_from"]) : null);
        $license->setDateTo(!empty($data["date_to"]) ? new \DateTime($data["date_to"]) : null);
        $license->setAmount(isset($data["amount"]) ? (float) $data["amount"] : 0);
        $license->setProjectId(!empty($data["project_id"]) ? (int) $data["project_id"] : null);
        $license->setClientId(!empty($data["client_id"]) ? (int) $data["client_id"] : null);
        $license->setEndCustomerId(!empty($data["end_customer_id"]) ? (int) $data["end_customer_id"] : null);
        $license->setBeforeLicenseId(!empty($data["before_license_id"]) ? (int) $data["before_license_id"] : null);
        $license->setAfterLicenseId(!empty($data["after_license_id"]) ? (int) $data["after_license_id"] : null);
        $license->setCostId(!empty($data["cost_id"]) ? (int) $data["cost_id"] : null);
    }


    private function triggerSave(License $license): License
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "license" => $license
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("license");
    }

    private function triggerBeforeSave(License $license): License
    {
        $event = new Event();
        $event->setName(self::EVENT_BEFORE_SAVE);
        $event->setParams([
            "license" => $license
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("license");
    }
}