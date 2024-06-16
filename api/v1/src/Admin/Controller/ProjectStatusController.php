<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\ProjectStatus;
use API\Repository\ProjectStatusRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/projectStatus
 */
class ProjectStatusController
{
    /**
     * @var ProjectStatusRepository
     */
    private $projectStatus_repository;


    public function __construct(
        ProjectStatusRepository $projectStatus_repository
    )
    {
        $this->projectStatus_repository = $projectStatus_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_projectStatus"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $projectStatus = new ProjectStatus();
            $this->mapEntityFromArray($projectStatus, $postData, $filesData);

            EntityManager::save($projectStatus);

            Router::redirectTo("admin_projectStatus");
        }

        $projectStatuses = $this->projectStatus_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/projectStatus/index.html.twig", [
            "projectStatuses" => $projectStatuses
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_projectStatus_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $projectStatus = $this->projectStatus_repository->find($id);
            $this->mapEntityFromArray($projectStatus, $postData, $filesData);

            EntityManager::save($projectStatus);

            Router::redirectTo("admin_projectStatus_edit", ["id"=>$projectStatus->getId()]);
        }

        $projectStatus = $this->projectStatus_repository->find($id);

        return AdminResponse::createResponse("admin/projectStatus/edit.html.twig", [
            "projectStatus" => $projectStatus
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_projectStatus_delete"
     * }
     */
    public function delete($id)
    {
        $projectStatus = $this->projectStatus_repository->find($id);
        EntityManager::remove($projectStatus);

        Router::redirectTo("admin_projectStatus");
    }

    private function mapEntityFromArray(ProjectStatus $projectStatus, array $data, array $files) {
        $projectStatus->setName($data["name"]);
        $projectStatus->setColor($data["color"]);
        $projectStatus->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
    }

}