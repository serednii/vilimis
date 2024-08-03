<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\ChecklistGroup;
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
 * @RoutePrefix /admin/checklistGroup
 */
class ChecklistGroupController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var ChecklistGroupRepository
     */
    private $checklistGroup_repository;

    /**
     * @var ChecklistRepository
     */
    private $checklist_id_repository;


    public function __construct(
        ChecklistRepository $checklist_id_repository,
        EventManager $eventManager,
        ChecklistGroupRepository $checklistGroup_repository
    )
    {
        $this->checklist_id_repository = $checklist_id_repository;
        $this->eventManager = $eventManager;
        $this->checklistGroup_repository = $checklistGroup_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_checklistGroup"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $checklistGroup = new ChecklistGroup();
            $this->mapEntityFromArray($checklistGroup, $postData, $filesData);

            EntityManager::save($checklistGroup);

            Router::redirectTo("admin_checklistGroup");
        }

        $checklist_ids = $this->checklist_id_repository->findBy([],["ORDER BY" => "id"]);
        $checklistGroups = $this->checklistGroup_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/checklistGroup/index.html.twig", [
            "checklist_ids" => $checklist_ids,
            "checklistGroups" => $checklistGroups
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_checklistGroup_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $checklistGroup = $this->checklistGroup_repository->find($id);
            $this->mapEntityFromArray($checklistGroup, $postData, $filesData);

            EntityManager::save($checklistGroup);
            $checklistGroup = $this->triggerSave($checklistGroup);

            Router::redirectTo("admin_checklistGroup_edit", ["id"=>$checklistGroup->getId()]);
        }

        $checklist_ids = $this->checklist_id_repository->findBy([],["ORDER BY" => "id"]);
        $checklistGroup = $this->checklistGroup_repository->find($id);

        return AdminResponse::createResponse("admin/checklistGroup/edit.html.twig", [
            "checklist_ids" => $checklist_ids,
            "checklistGroup" => $checklistGroup
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_checklistGroup_delete"
     * }
     */
    public function delete($id)
    {
        $checklistGroup = $this->checklistGroup_repository->find($id);
        EntityManager::remove($checklistGroup);

        Router::redirectTo("admin_checklistGroup");
    }

    private function mapEntityFromArray(ChecklistGroup $checklistGroup, array $data, array $files) {
        $checklistGroup->setName($data["name"]);
        $checklistGroup->setDescription($data["description"]);
        $checklistGroup->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
        $checklistGroup->setDone((bool) isset($data["done"]) ? $data["done"] : false);
        $checklistGroup->setChecklistId(!empty($data["checklist_id"]) ? (int) $data["checklist_id"] : null);
    }


    private function triggerSave(ChecklistGroup $checklistGroup): ChecklistGroup
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "checklistGroup" => $checklistGroup
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("checklistGroup");
    }
}