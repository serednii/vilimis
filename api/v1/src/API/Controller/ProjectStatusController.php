<?php

namespace API\Controller;

use API\Entity\ProjectStatus;
use API\Repository\ProjectStatusRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /projectStatus
 */
class ProjectStatusController
{
    /**
     * @var ProjectStatusRepository
     */
    private $projectStatus_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    public function __construct(
        ProjectStatusRepository $projectStatus_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->projectStatus_repository = $projectStatus_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "projectStatus_list"
     * }
     */
    public function index()
    {
        $projectStatuses = $this->projectStatus_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $projectStatuses
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "projectStatus_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $projectStatus = new ProjectStatus();
            $this->mapEntityFromArray($projectStatus, $postData, $filesData);

            EntityManager::save($projectStatus);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "projectStatus" => $projectStatus,
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
            "data" => $data,
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