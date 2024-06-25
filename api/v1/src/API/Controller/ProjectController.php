<?php

namespace API\Controller;

use API\Entity\Project;
use API\Repository\ProjectRepository;
use API\Repository\ClientRepository;
use API\Repository\EndCustomerRepository;
use API\Repository\ProjectStatusRepository;
use API\Repository\WebRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /project
 */
class ProjectController extends AbstractApiController
{
    /**
     * @var ProjectRepository
     */
    private $project_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        ProjectRepository $project_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->project_repository = $project_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "project_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $projects = $this->project_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $projects
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "project_single"
     * }
     */
    public function single($id)
    {
        $project = $this->project_repository->find($id);

        if (!$project) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $project
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "project_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $project = $this->project_repository->find($postData["id"]);


                if (!$project) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $project = new Project();
            }
            $this->mapEntityFromArray($project, $postData, $filesData);

            EntityManager::save($project);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "project" => $project,
                "message" => "Uloženo",
                "code" => 200
            ]));
        }


        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Chybí data",
            "code" => 500
        ]));
    }


    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "project_delete"
     * }
     */
    public function delete($id)
    {
        $project = $this->project_repository->find($id);
        EntityManager::remove($project);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "project_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $projects = $this->project_repository->findBy($filter);

        if (is_array($projects) && count($projects) > 0) {
            foreach ($projects as $project) {
                EntityManager::remove($project);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(Project $project, array $data, array $files) {
        $project->setName($data["name"]);
        $project->setBudget(isset($data["budget"]) ? (int) $data["budget"] : 0);
        $project->setClientId(!empty($data["client_id"]) ? (int) $data["client_id"] : null);
        $project->setEndCustomerId(!empty($data["end_customer_id"]) ? (int) $data["end_customer_id"] : null);
        $project->setHourRate(isset($data["hour_rate"]) ? (int) $data["hour_rate"] : 0);
        $project->setHourBudget(isset($data["hour_budget"]) ? (int) $data["hour_budget"] : 0);
        $project->setProjectStatusId(!empty($data["project_status_id"]) ? (int) $data["project_status_id"] : null);
        $project->setWebId(!empty($data["web_id"]) ? (int) $data["web_id"] : null);
        $project->setClosed((bool) isset($data["closed"]) ? $data["closed"] : false);
        $project->setArchived((bool) isset($data["archived"]) ? $data["archived"] : false);
        $project->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
    }

}