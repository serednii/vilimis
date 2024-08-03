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
 * @RoutePrefix /checklistItemDone
 * @Security ROLE_USER
 */
class ChecklistItemDoneController extends AbstractApiController
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
     *  "rule": "/save",
     *  "name": "checklistItem_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();

        if (!empty($postData["id"])) {
            /** @var ChecklistItem $checklistItem */
            $checklistItem = $this->checklistItem_repository->find($postData["id"]);


            if (!$checklistItem) {
                return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                    "message" => "Nenalezeno: $postData[id]",
                    "code" => 404
                ]));
            }
            $checklistItem->setDone((bool) (isset($postData["done"]) ? $postData["done"] : false));

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


    private function triggerSave(ChecklistItem $checklistItem): ChecklistItem
    {
        $event = new Event();
        $event->setName(ChecklistItemController::EVENT_SAVE);
        $event->setParams([
            "checklistItem" => $checklistItem
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("checklistItem");
    }
}