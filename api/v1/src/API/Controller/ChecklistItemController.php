<?php

namespace API\Controller;

use API\Entity\ChecklistItem;
use API\Repository\ChecklistItemRepository;
use API\Repository\ChecklistGroupRepository;
use API\Repository\ChecklistRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /checklistItem
 * @Security ROLE_USER
 */
class ChecklistItemController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var ChecklistItemRepository
     */
    private $checklistItem_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        ChecklistItemRepository $checklistItem_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->checklistItem_repository = $checklistItem_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "checklistItem_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $checklistItems = $this->checklistItem_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $checklistItems
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "checklistItem_single"
     * }
     */
    public function single($id)
    {
        $checklistItem = $this->checklistItem_repository->find($id);

        if (!$checklistItem) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $checklistItem
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "checklistItem_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $checklistItem = $this->checklistItem_repository->find($postData["id"]);


                if (!$checklistItem) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $checklistItem = new ChecklistItem();
            }
            $this->mapEntityFromArray($checklistItem, $postData, $filesData);

            EntityManager::save($checklistItem);

            $checklistItem = $this->triggerSave($checklistItem);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "checklistItem" => $checklistItem,
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
     *  "name": "checklistItem_delete"
     * }
     */
    public function delete($id)
    {
        $checklistItem = $this->checklistItem_repository->find($id);
        EntityManager::remove($checklistItem);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "checklistItem_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $checklistItems = $this->checklistItem_repository->findBy($filter);

        if (is_array($checklistItems) && count($checklistItems) > 0) {
            foreach ($checklistItems as $checklistItem) {
                EntityManager::remove($checklistItem);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(ChecklistItem $checklistItem, array $data, array $files) {
        $checklistItem->setName($data["name"]);
        $checklistItem->setDescription($data["description"]);
        $checklistItem->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
        $checklistItem->setDone((bool) isset($data["done"]) ? $data["done"] : false);
        $checklistItem->setChecklistGroupId(!empty($data["checklist_group_id"]) ? (int) $data["checklist_group_id"] : null);
        $checklistItem->setChecklistId(!empty($data["checklist_id"]) ? (int) $data["checklist_id"] : null);
    }


    private function triggerSave(ChecklistItem $checklistItem): ChecklistItem
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "checklistItem" => $checklistItem
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("checklistItem");
    }
}