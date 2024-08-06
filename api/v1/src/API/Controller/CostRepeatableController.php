<?php

namespace API\Controller;

use API\Entity\CostRepeatable;
use API\Repository\CostRepeatableRepository;
use API\Repository\CostCategoryRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /costRepeatable
 * @Security ROLE_USER
 */
class CostRepeatableController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";
    const EVENT_BEFORE_SAVE = __CLASS__ . "::EVENT_BEFORE_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var CostRepeatableRepository
     */
    private $costRepeatable_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        CostRepeatableRepository $costRepeatable_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->costRepeatable_repository = $costRepeatable_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "costRepeatable_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $costRepeatables = $this->costRepeatable_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $costRepeatables
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "costRepeatable_single"
     * }
     */
    public function single($id)
    {
        $costRepeatable = $this->costRepeatable_repository->find($id);

        if (!$costRepeatable) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $costRepeatable
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "costRepeatable_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $costRepeatable = $this->costRepeatable_repository->find($postData["id"]);


                if (!$costRepeatable) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $costRepeatable = new CostRepeatable();
            }
            $this->mapEntityFromArray($costRepeatable, $postData, $filesData);

            try {
                $costRepeatable = $this->triggerBeforeSave($costRepeatable);

                EntityManager::save($costRepeatable);

                $costRepeatable = $this->triggerSave($costRepeatable);
            } catch (\Exception $exception) {
                return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                    "message" => $exception->getMessage(),
                    "code" => 500
                ]));
            }

            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "costRepeatable" => $costRepeatable,
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
     *  "name": "costRepeatable_delete"
     * }
     */
    public function delete($id)
    {
        $costRepeatable = $this->costRepeatable_repository->find($id);
        EntityManager::remove($costRepeatable);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "costRepeatable_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $costRepeatables = $this->costRepeatable_repository->findBy($filter);

        if (is_array($costRepeatables) && count($costRepeatables) > 0) {
            foreach ($costRepeatables as $costRepeatable) {
                EntityManager::remove($costRepeatable);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(CostRepeatable $costRepeatable, array $data, array $files) {
        $costRepeatable->setName($data["name"]);
        $costRepeatable->setDescription($data["description"]);
        $costRepeatable->setCostCategoryId(!empty($data["cost_category_id"]) ? (int) $data["cost_category_id"] : null);
        $costRepeatable->setFrequency($data["frequency"]);
        $costRepeatable->setAmount(isset($data["amount"]) ? (float) $data["amount"] : 0);
        $costRepeatable->setDayOfAccounting(isset($data["day_of_accounting"]) ? (int) $data["day_of_accounting"] : 0);
        $costRepeatable->setFirstDayOfAccounting(!empty($data["first_day_of_accounting"]) ? new \DateTime($data["first_day_of_accounting"]) : null);
    }


    private function triggerSave(CostRepeatable $costRepeatable): CostRepeatable
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "costRepeatable" => $costRepeatable
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("costRepeatable");
    }

    private function triggerBeforeSave(CostRepeatable $costRepeatable): CostRepeatable
    {
        $event = new Event();
        $event->setName(self::EVENT_BEFORE_SAVE);
        $event->setParams([
            "costRepeatable" => $costRepeatable
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("costRepeatable");
    }
}