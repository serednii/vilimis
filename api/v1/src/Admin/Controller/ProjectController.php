<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Project;
use API\Repository\ProjectRepository;
use API\Repository\ClientRepository;
use API\Repository\EndCustomerRepository;
use API\Repository\ProjectStatusRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/project
 */
class ProjectController
{
    /**
     * @var ProjectRepository
     */
    private $project_repository;

    /**
     * @var ClientRepository
     */
    private $client_id_repository;

    /**
     * @var EndCustomerRepository
     */
    private $end_customer_id_repository;

    /**
     * @var ProjectStatusRepository
     */
    private $project_status_id_repository;


    public function __construct(
        ClientRepository $client_id_repository,
        EndCustomerRepository $end_customer_id_repository,
        ProjectStatusRepository $project_status_id_repository,
        ProjectRepository $project_repository
    )
    {
        $this->client_id_repository = $client_id_repository;
        $this->end_customer_id_repository = $end_customer_id_repository;
        $this->project_status_id_repository = $project_status_id_repository;
        $this->project_repository = $project_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_project"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $project = new Project();
            $this->mapEntityFromArray($project, $postData, $filesData);

            EntityManager::save($project);

            Router::redirectTo("admin_project");
        }

        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $project_status_ids = $this->project_status_id_repository->findBy([],["ORDER BY" => "id"]);
        $projects = $this->project_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/project/index.html.twig", [
            "client_ids" => $client_ids,
            "end_customer_ids" => $end_customer_ids,
            "project_status_ids" => $project_status_ids,
            "projects" => $projects
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_project_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $project = $this->project_repository->find($id);
            $this->mapEntityFromArray($project, $postData, $filesData);

            EntityManager::save($project);

            Router::redirectTo("admin_project_edit", ["id"=>$project->getId()]);
        }

        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $project_status_ids = $this->project_status_id_repository->findBy([],["ORDER BY" => "id"]);
        $project = $this->project_repository->find($id);

        return AdminResponse::createResponse("admin/project/edit.html.twig", [
            "client_ids" => $client_ids,
            "end_customer_ids" => $end_customer_ids,
            "project_status_ids" => $project_status_ids,
            "project" => $project
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_project_delete"
     * }
     */
    public function delete($id)
    {
        $project = $this->project_repository->find($id);
        EntityManager::remove($project);

        Router::redirectTo("admin_project");
    }

    private function mapEntityFromArray(Project $project, array $data, array $files) {
        $project->setName($data["name"]);
        $project->setBudget(isset($data["budget"]) ? (int) $data["budget"] : 0);
        $project->setClientId(!empty($data["client_id"]) ? (int) $data["client_id"] : null);
        $project->setEndCustomerId(!empty($data["end_customer_id"]) ? (int) $data["end_customer_id"] : null);
        $project->setHourRate(isset($data["hour_rate"]) ? (int) $data["hour_rate"] : 0);
        $project->setHourBudget(isset($data["hour_budget"]) ? (int) $data["hour_budget"] : 0);
        $project->setProjectStatusId(!empty($data["project_status_id"]) ? (int) $data["project_status_id"] : null);
    }

}