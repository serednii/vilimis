<?php

namespace API\Controller;

use API\Entity\Cost;
use API\Repository\CostRepository;
use API\Repository\CostCategoryRepository;
use API\Repository\CostRepeatableRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /cost
 * @Security ROLE_USER
 */
class CostController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";
    const EVENT_BEFORE_SAVE = __CLASS__ . "::EVENT_BEFORE_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var CostRepository
     */
    private $cost_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        CostRepository $cost_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->cost_repository = $cost_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "cost_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $costs = $this->cost_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $costs
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "cost_single"
     * }
     */
    public function single($id)
    {
        $cost = $this->cost_repository->find($id);

        if (!$cost) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $cost
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "cost_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $cost = $this->cost_repository->find($postData["id"]);


                if (!$cost) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $cost = new Cost();
            }
            $this->mapEntityFromArray($cost, $postData, $filesData);

            try {
                $cost = $this->triggerBeforeSave($cost);

                EntityManager::save($cost);

                $cost = $this->triggerSave($cost);
            } catch (\Exception $exception) {
                return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                    "message" => $exception->getMessage(),
                    "code" => 500
                ]));
            }

            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "cost" => $cost,
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
     *  "name": "cost_delete"
     * }
     */
    public function delete($id)
    {
        $cost = $this->cost_repository->find($id);
        EntityManager::remove($cost);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "cost_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $costs = $this->cost_repository->findBy($filter);

        if (is_array($costs) && count($costs) > 0) {
            foreach ($costs as $cost) {
                EntityManager::remove($cost);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(Cost $cost, array $data, array $files) {
        $cost->setName($data["name"]);
        $cost->setDescription($data["description"]);
        $cost->setCostCategoryId(!empty($data["cost_category_id"]) ? (int) $data["cost_category_id"] : null);
        $cost->setAmount(isset($data["amount"]) ? (float) $data["amount"] : 0);
        $cost->setDayOfAccounting(!empty($data["day_of_accounting"]) ? new \DateTime($data["day_of_accounting"]) : null);
        $cost->setCostRepeatableId(!empty($data["cost_repeatable_id"]) ? (int) $data["cost_repeatable_id"] : null);
    }


    private function triggerSave(Cost $cost): Cost
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "cost" => $cost
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("cost");
    }

    private function triggerBeforeSave(Cost $cost): Cost
    {
        $event = new Event();
        $event->setName(self::EVENT_BEFORE_SAVE);
        $event->setParams([
            "cost" => $cost
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("cost");
    }
}