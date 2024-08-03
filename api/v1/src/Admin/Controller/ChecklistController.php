<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Checklist;
use API\Repository\ChecklistRepository;
use API\Repository\ProjectRepository;
use API\Repository\TaskRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/checklist
 */
class ChecklistController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var ChecklistRepository
     */
    private $checklist_repository;

    /**
     * @var ProjectRepository
     */
    private $project_id_repository;

    /**
     * @var TaskRepository
     */
    private $task_id_repository;


    public function __construct(
        ProjectRepository $project_id_repository,
        TaskRepository $task_id_repository,
        EventManager $eventManager,
        ChecklistRepository $checklist_repository
    )
    {
        $this->project_id_repository = $project_id_repository;
        $this->task_id_repository = $task_id_repository;
        $this->eventManager = $eventManager;
        $this->checklist_repository = $checklist_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_checklist"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $checklist = new Checklist();
            $this->mapEntityFromArray($checklist, $postData, $filesData);

            EntityManager::save($checklist);

            Router::redirectTo("admin_checklist");
        }

        $project_ids = $this->project_id_repository->findBy([],["ORDER BY" => "id"]);
        $task_ids = $this->task_id_repository->findBy([],["ORDER BY" => "id"]);
        $checklists = $this->checklist_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/checklist/index.html.twig", [
            "project_ids" => $project_ids,
            "task_ids" => $task_ids,
            "checklists" => $checklists
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_checklist_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $checklist = $this->checklist_repository->find($id);
            $this->mapEntityFromArray($checklist, $postData, $filesData);

            EntityManager::save($checklist);
            $checklist = $this->triggerSave($checklist);

            Router::redirectTo("admin_checklist_edit", ["id"=>$checklist->getId()]);
        }

        $project_ids = $this->project_id_repository->findBy([],["ORDER BY" => "id"]);
        $task_ids = $this->task_id_repository->findBy([],["ORDER BY" => "id"]);
        $checklist = $this->checklist_repository->find($id);

        return AdminResponse::createResponse("admin/checklist/edit.html.twig", [
            "project_ids" => $project_ids,
            "task_ids" => $task_ids,
            "checklist" => $checklist
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_checklist_delete"
     * }
     */
    public function delete($id)
    {
        $checklist = $this->checklist_repository->find($id);
        EntityManager::remove($checklist);

        Router::redirectTo("admin_checklist");
    }

    private function mapEntityFromArray(Checklist $checklist, array $data, array $files) {
        $checklist->setName($data["name"]);
        $checklist->setDescription($data["description"]);
        $checklist->setProjectId(!empty($data["project_id"]) ? (int) $data["project_id"] : null);
        $checklist->setTaskId(!empty($data["task_id"]) ? (int) $data["task_id"] : null);
    }


    private function triggerSave(Checklist $checklist): Checklist
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "checklist" => $checklist
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("checklist");
    }
}