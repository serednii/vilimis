<?php

namespace API\Controller;

use API\Entity\TaskStatus;
use API\Repository\TaskStatusRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /taskStatus
 */
class TaskStatusController
{
    /**
     * @var TaskStatusRepository
     */
    private $taskStatus_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    public function __construct(
        TaskStatusRepository $taskStatus_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->taskStatus_repository = $taskStatus_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "taskStatus_list"
     * }
     */
    public function index()
    {
        $taskStatuses = $this->taskStatus_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $taskStatuses
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "taskStatus_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $taskStatus = new TaskStatus();
            $this->mapEntityFromArray($taskStatus, $postData, $filesData);

            EntityManager::save($taskStatus);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "taskStatus" => $taskStatus,
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
     *  "name": "taskStatus_delete"
     * }
     */
    public function delete($id)
    {
        $taskStatus = $this->taskStatus_repository->find($id);
        EntityManager::remove($taskStatus);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $data,
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(TaskStatus $taskStatus, array $data, array $files) {
        $taskStatus->setName($data["name"]);
        $taskStatus->setColor($data["color"]);
        $taskStatus->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
    }

}