<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\TaskTimetrack;
use API\Repository\TaskTimetrackRepository;
use API\Repository\TaskRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/taskTimetrack
 */
class TaskTimetrackController
{
    /**
     * @var TaskTimetrackRepository
     */
    private $taskTimetrack_repository;

    /**
     * @var TaskRepository
     */
    private $task_id_repository;


    public function __construct(
        TaskRepository $task_id_repository,
        TaskTimetrackRepository $taskTimetrack_repository
    )
    {
        $this->task_id_repository = $task_id_repository;
        $this->taskTimetrack_repository = $taskTimetrack_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_taskTimetrack"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["task_id"])) {
            $taskTimetrack = new TaskTimetrack();
            $this->mapEntityFromArray($taskTimetrack, $postData, $filesData);

            EntityManager::save($taskTimetrack);

            Router::redirectTo("admin_taskTimetrack");
        }

        $task_ids = $this->task_id_repository->findBy([],["ORDER BY" => "id"]);
        $taskTimetracks = $this->taskTimetrack_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/taskTimetrack/index.html.twig", [
            "task_ids" => $task_ids,
            "taskTimetracks" => $taskTimetracks
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_taskTimetrack_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["task_id"])) {
            $taskTimetrack = $this->taskTimetrack_repository->find($id);
            $this->mapEntityFromArray($taskTimetrack, $postData, $filesData);

            EntityManager::save($taskTimetrack);

            Router::redirectTo("admin_taskTimetrack_edit", ["id"=>$taskTimetrack->getId()]);
        }

        $task_ids = $this->task_id_repository->findBy([],["ORDER BY" => "id"]);
        $taskTimetrack = $this->taskTimetrack_repository->find($id);

        return AdminResponse::createResponse("admin/taskTimetrack/edit.html.twig", [
            "task_ids" => $task_ids,
            "taskTimetrack" => $taskTimetrack
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_taskTimetrack_delete"
     * }
     */
    public function delete($id)
    {
        $taskTimetrack = $this->taskTimetrack_repository->find($id);
        EntityManager::remove($taskTimetrack);

        Router::redirectTo("admin_taskTimetrack");
    }

    private function mapEntityFromArray(TaskTimetrack $taskTimetrack, array $data, array $files) {
        $taskTimetrack->setTaskId(!empty($data["task_id"]) ? (int) $data["task_id"] : null);
        $taskTimetrack->setDatetimeStart(new \DateTime($data["datetime_start"]));
        $taskTimetrack->setDatetimeStop(new \DateTime($data["datetime_stop"]));
    }

}