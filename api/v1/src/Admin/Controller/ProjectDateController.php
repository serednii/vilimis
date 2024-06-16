<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\ProjectDate;
use API\Repository\ProjectDateRepository;
use API\Repository\ProjectRepository;
use API\Repository\TaskRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/projectDate
 */
class ProjectDateController
{
    /**
     * @var ProjectDateRepository
     */
    private $projectDate_repository;

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
        ProjectDateRepository $projectDate_repository
    )
    {
        $this->project_id_repository = $project_id_repository;
        $this->task_id_repository = $task_id_repository;
        $this->projectDate_repository = $projectDate_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_projectDate"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $projectDate = new ProjectDate();
            $this->mapEntityFromArray($projectDate, $postData, $filesData);

            EntityManager::save($projectDate);

            Router::redirectTo("admin_projectDate");
        }

        $project_ids = $this->project_id_repository->findBy([],["ORDER BY" => "id"]);
        $task_ids = $this->task_id_repository->findBy([],["ORDER BY" => "id"]);
        $projectDates = $this->projectDate_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/projectDate/index.html.twig", [
            "project_ids" => $project_ids,
            "task_ids" => $task_ids,
            "projectDates" => $projectDates
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_projectDate_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $projectDate = $this->projectDate_repository->find($id);
            $this->mapEntityFromArray($projectDate, $postData, $filesData);

            EntityManager::save($projectDate);

            Router::redirectTo("admin_projectDate_edit", ["id"=>$projectDate->getId()]);
        }

        $project_ids = $this->project_id_repository->findBy([],["ORDER BY" => "id"]);
        $task_ids = $this->task_id_repository->findBy([],["ORDER BY" => "id"]);
        $projectDate = $this->projectDate_repository->find($id);

        return AdminResponse::createResponse("admin/projectDate/edit.html.twig", [
            "project_ids" => $project_ids,
            "task_ids" => $task_ids,
            "projectDate" => $projectDate
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_projectDate_delete"
     * }
     */
    public function delete($id)
    {
        $projectDate = $this->projectDate_repository->find($id);
        EntityManager::remove($projectDate);

        Router::redirectTo("admin_projectDate");
    }

    private function mapEntityFromArray(ProjectDate $projectDate, array $data, array $files) {
        $projectDate->setName($data["name"]);
        $projectDate->setDate(new \DateTime($data["date"]));
        $projectDate->setColor($data["color"]);
        $projectDate->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
        $projectDate->setDone((bool) isset($data["done"]) ? $data["done"] : false);
        $projectDate->setProjectId(!empty($data["project_id"]) ? (int) $data["project_id"] : null);
        $projectDate->setTaskId(!empty($data["task_id"]) ? (int) $data["task_id"] : null);
    }

}