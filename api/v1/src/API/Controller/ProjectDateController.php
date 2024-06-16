<?php

namespace API\Controller;

use API\Entity\ProjectDate;
use API\Repository\ProjectDateRepository;
use API\Repository\ProjectRepository;
use API\Repository\TaskRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /projectDate
 */
class ProjectDateController
{
    /**
     * @var ProjectDateRepository
     */
    private $projectDate_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    public function __construct(
        ProjectDateRepository $projectDate_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->projectDate_repository = $projectDate_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "projectDate_list"
     * }
     */
    public function index()
    {
        $projectDates = $this->projectDate_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $projectDates
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "projectDate_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $projectDate = new ProjectDate();
            $this->mapEntityFromArray($projectDate, $postData, $filesData);

            EntityManager::save($projectDate);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "projectDate" => $projectDate,
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
     *  "name": "projectDate_delete"
     * }
     */
    public function delete($id)
    {
        $projectDate = $this->projectDate_repository->find($id);
        EntityManager::remove($projectDate);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $data,
            "message" => "Smazáno",
            "code" => 200
        ]));
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