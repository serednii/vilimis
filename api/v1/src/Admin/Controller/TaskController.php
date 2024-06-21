<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Task;
use API\Repository\TaskRepository;
use API\Repository\ProjectRepository;
use API\Repository\TaskStatusRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/task
 */
class TaskController
{
    /**
     * @var TaskRepository
     */
    private $task_repository;

    /**
     * @var ProjectRepository
     */
    private $project_id_repository;

    /**
     * @var TaskStatusRepository
     */
    private $task_status_id_repository;


    public function __construct(
        ProjectRepository $project_id_repository,
        TaskStatusRepository $task_status_id_repository,
        TaskRepository $task_repository
    )
    {
        $this->project_id_repository = $project_id_repository;
        $this->task_status_id_repository = $task_status_id_repository;
        $this->task_repository = $task_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_task"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $task = new Task();
            $this->mapEntityFromArray($task, $postData, $filesData);

            EntityManager::save($task);

            Router::redirectTo("admin_task");
        }

        $project_ids = $this->project_id_repository->findBy([],["ORDER BY" => "id"]);
        $task_status_ids = $this->task_status_id_repository->findBy([],["ORDER BY" => "id"]);
        $tasks = $this->task_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/task/index.html.twig", [
            "project_ids" => $project_ids,
            "task_status_ids" => $task_status_ids,
            "tasks" => $tasks
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_task_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $task = $this->task_repository->find($id);
            $this->mapEntityFromArray($task, $postData, $filesData);

            EntityManager::save($task);

            Router::redirectTo("admin_task_edit", ["id"=>$task->getId()]);
        }

        $project_ids = $this->project_id_repository->findBy([],["ORDER BY" => "id"]);
        $task_status_ids = $this->task_status_id_repository->findBy([],["ORDER BY" => "id"]);
        $task = $this->task_repository->find($id);

        return AdminResponse::createResponse("admin/task/edit.html.twig", [
            "project_ids" => $project_ids,
            "task_status_ids" => $task_status_ids,
            "task" => $task
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_task_delete"
     * }
     */
    public function delete($id)
    {
        $task = $this->task_repository->find($id);
        EntityManager::remove($task);

        Router::redirectTo("admin_task");
    }

    private function mapEntityFromArray(Task $task, array $data, array $files) {
        $task->setName($data["name"]);
        $task->setHourBudget(isset($data["hour_budget"]) ? (int) $data["hour_budget"] : 0);
        $task->setProjectId(!empty($data["project_id"]) ? (int) $data["project_id"] : null);
        $task->setTaskStatusId(!empty($data["task_status_id"]) ? (int) $data["task_status_id"] : null);
        $task->setDescription($data["description"]);
        $task->setDeadLineDate(!empty($data["dead_line_date"]) ? new \DateTime($data["dead_line_date"]) : null);
        $task->setClosed((bool) isset($data["closed"]) ? $data["closed"] : false);
        $task->setArchived((bool) isset($data["archived"]) ? $data["archived"] : false);
        $task->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
    }

}