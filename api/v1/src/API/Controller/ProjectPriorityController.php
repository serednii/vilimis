<?php

namespace API\Controller;

use API\Entity\Project;
use API\Entity\ProjectStatus;
use API\Repository\ProjectRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /projectPriority
 */
class ProjectPriorityController extends AbstractApiController
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
     *  "rule": "/save",
     *  "name": "projectPriority_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["projects"]) && is_array($postData["projects"])) {
            foreach ($postData["projects"]["id"] as $key=>$id) {
                /** @var Project $project */
                $project = $this->project_repository->find($id);

                if ($project) {
                    $project->setPriority($postData["projects"]["priority"][$key]);
                    $project->setProjectStatusId($postData["projects"]["projectStatusId"][$key]);
                    EntityManager::save($project);
                }
            }

            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
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
     *  "name": "projectStatus_delete"
     * }
     */
    public function delete($id)
    {
        $projectStatus = $this->projectStatus_repository->find($id);
        EntityManager::remove($projectStatus);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "projectStatus_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $projectStatuses = $this->projectStatus_repository->findBy($filter);

        if (is_array($projectStatuses) && count($projectStatuses) > 0) {
            foreach ($projectStatuses as $projectStatus) {
                EntityManager::remove($projectStatus);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(ProjectStatus $projectStatus, array $data, array $files) {
        $projectStatus->setName($data["name"]);
        $projectStatus->setColor($data["color"]);
        $projectStatus->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
    }

}