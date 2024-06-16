<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\TaskStatus;
use API\Repository\TaskStatusRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/taskStatus
 */
class TaskStatusController
{
    /**
     * @var TaskStatusRepository
     */
    private $taskStatus_repository;


    public function __construct(
        TaskStatusRepository $taskStatus_repository
    )
    {
        $this->taskStatus_repository = $taskStatus_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_taskStatus"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $taskStatus = new TaskStatus();
            $this->mapEntityFromArray($taskStatus, $postData, $filesData);

            EntityManager::save($taskStatus);

            Router::redirectTo("admin_taskStatus");
        }

        $taskStatuses = $this->taskStatus_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/taskStatus/index.html.twig", [
            "taskStatuses" => $taskStatuses
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_taskStatus_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $taskStatus = $this->taskStatus_repository->find($id);
            $this->mapEntityFromArray($taskStatus, $postData, $filesData);

            EntityManager::save($taskStatus);

            Router::redirectTo("admin_taskStatus_edit", ["id"=>$taskStatus->getId()]);
        }

        $taskStatus = $this->taskStatus_repository->find($id);

        return AdminResponse::createResponse("admin/taskStatus/edit.html.twig", [
            "taskStatus" => $taskStatus
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_taskStatus_delete"
     * }
     */
    public function delete($id)
    {
        $taskStatus = $this->taskStatus_repository->find($id);
        EntityManager::remove($taskStatus);

        Router::redirectTo("admin_taskStatus");
    }

    private function mapEntityFromArray(TaskStatus $taskStatus, array $data, array $files) {
        $taskStatus->setName($data["name"]);
        $taskStatus->setColor($data["color"]);
        $taskStatus->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
    }

}