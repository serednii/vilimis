<?php

namespace API\Controller;

use API\Entity\Checklist;
use API\Entity\ChecklistGroup;
use API\Entity\ChecklistItem;
use API\Repository\ChecklistGroupRepository;
use API\Repository\ChecklistItemRepository;
use API\Repository\ChecklistRepository;
use API\Repository\ProjectRepository;
use API\Repository\TaskRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /checklistClone
 * @Security ROLE_USER
 */
class ChecklistCloneController extends AbstractApiController
{
    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var ChecklistRepository
     */
    private $checklist_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;
    private ChecklistGroupRepository $checklistGroupRepository;
    private ChecklistItemRepository $checklistItemRepository;


    public function __construct(
        ChecklistRepository $checklist_repository,
        ChecklistGroupRepository $checklistGroupRepository,
        ChecklistItemRepository $checklistItemRepository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator    $jsonSerializator,
        EventManager        $eventManager
    )
    {
        $this->checklist_repository = $checklist_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
        $this->checklistGroupRepository = $checklistGroupRepository;
        $this->checklistItemRepository = $checklistItemRepository;
    }

    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "checklist_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["original_id"])) {

            $checklistOriginal = $this->checklist_repository->find($postData["original_id"]);


            if (!$checklistOriginal) {
                return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                    "message" => "Nenalezeno: $postData[original_id]",
                    "code" => 404
                ]));
            }
            
            $checklist = new Checklist();
            $checklist->setDescription($checklistOriginal->getDescription());
            $checklist->setName($checklistOriginal->getName());

            if (!empty($postData["project_id"])) {
                $checklist->setProjectId((int) $postData["project_id"]);
            }
            
            if (!empty($postData["task_id"])) {
                $checklist->setTaskId((int) $postData["task_id"]);
            }
            EntityManager::save($checklist);
            
            /** @var ChecklistGroup[] $checklistGroupsOriginal */
            $checklistGroupsOriginal = $this->checklistGroupRepository->findBy(["checklist_id = %1", $checklistOriginal->getId()]);

            if ($checklistGroupsOriginal) {
                foreach ($checklistGroupsOriginal as $checklistGroupOriginal) {
                    $checklistGroup = new ChecklistGroup();
                    $checklistGroup->setChecklistId($checklist->getId());
                    $checklistGroup->setName($checklistGroupOriginal->getName());
                    $checklistGroup->setDescription($checklistGroupOriginal->getDescription());
                    $checklistGroup->setPriority($checklistGroupOriginal->getPriority());

                    EntityManager::save($checklistGroup);


                    /** @var ChecklistItem[] $checklistItemsOriginal */
                    $checklistItemsOriginal = $this->checklistItemRepository->findBy(["checklist_group_id = %1", $checklistGroupOriginal->getId()]);

                    if ($checklistItemsOriginal) {
                        foreach ($checklistItemsOriginal as $checklistItemOriginal) {
                            $checklistItem = new ChecklistItem();
                            $checklistItem->setChecklistId($checklist->getId());
                            $checklistItem->setChecklistGroupId($checklistGroup->getId());
                            $checklistItem->setName($checklistItemOriginal->getName());
                            $checklistItem->setDescription($checklistItemOriginal->getDescription());
                            $checklistItem->setPriority($checklistItemOriginal->getPriority());

                            EntityManager::save($checklistItem);
                        }
                    }
                }
            }

            $checklist = $this->triggerSave($checklist);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "checklist" => $checklist,
                "message" => "Uloženo",
                "code" => 200
            ]));
        }


        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Chybí data",
            "code" => 500
        ]));
    }


    private function triggerSave(Checklist $checklist): Checklist
    {
        $event = new Event();
        $event->setName(ChecklistController::EVENT_SAVE);
        $event->setParams([
            "checklist" => $checklist
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("checklist");
    }
}