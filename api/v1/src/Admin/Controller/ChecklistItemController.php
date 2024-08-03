<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
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

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/checklistItem
 */
class ChecklistItemController
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
     * @var ChecklistGroupRepository
     */
    private $checklist_group_id_repository;

    /**
     * @var ChecklistRepository
     */
    private $checklist_id_repository;


    public function __construct(
        ChecklistGroupRepository $checklist_group_id_repository,
        ChecklistRepository $checklist_id_repository,
        EventManager $eventManager,
        ChecklistItemRepository $checklistItem_repository
    )
    {
        $this->checklist_group_id_repository = $checklist_group_id_repository;
        $this->checklist_id_repository = $checklist_id_repository;
        $this->eventManager = $eventManager;
        $this->checklistItem_repository = $checklistItem_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_checklistItem"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $checklistItem = new ChecklistItem();
            $this->mapEntityFromArray($checklistItem, $postData, $filesData);

            EntityManager::save($checklistItem);

            Router::redirectTo("admin_checklistItem");
        }

        $checklist_group_ids = $this->checklist_group_id_repository->findBy([],["ORDER BY" => "id"]);
        $checklist_ids = $this->checklist_id_repository->findBy([],["ORDER BY" => "id"]);
        $checklistItems = $this->checklistItem_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/checklistItem/index.html.twig", [
            "checklist_group_ids" => $checklist_group_ids,
            "checklist_ids" => $checklist_ids,
            "checklistItems" => $checklistItems
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_checklistItem_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $checklistItem = $this->checklistItem_repository->find($id);
            $this->mapEntityFromArray($checklistItem, $postData, $filesData);

            EntityManager::save($checklistItem);
            $checklistItem = $this->triggerSave($checklistItem);

            Router::redirectTo("admin_checklistItem_edit", ["id"=>$checklistItem->getId()]);
        }

        $checklist_group_ids = $this->checklist_group_id_repository->findBy([],["ORDER BY" => "id"]);
        $checklist_ids = $this->checklist_id_repository->findBy([],["ORDER BY" => "id"]);
        $checklistItem = $this->checklistItem_repository->find($id);

        return AdminResponse::createResponse("admin/checklistItem/edit.html.twig", [
            "checklist_group_ids" => $checklist_group_ids,
            "checklist_ids" => $checklist_ids,
            "checklistItem" => $checklistItem
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_checklistItem_delete"
     * }
     */
    public function delete($id)
    {
        $checklistItem = $this->checklistItem_repository->find($id);
        EntityManager::remove($checklistItem);

        Router::redirectTo("admin_checklistItem");
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