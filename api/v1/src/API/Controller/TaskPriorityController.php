<?php

namespace API\Controller;

use API\Entity\Task;
use API\Repository\TaskRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /taskPriority
 */
class TaskPriorityController extends AbstractApiController
{
    /**
     * @var TasRepository
     */
    private $task_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    public function __construct(
        TaskRepository $task_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->task_repository = $task_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }



    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "taskPriority_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["tasks"]) && is_array($postData["tasks"])) {
            foreach ($postData["tasks"]["id"] as $key=>$id) {
                /** @var Task $task */
                $task = $this->task_repository->find($id);

                if ($task) {
                    $task->setPriority($postData["tasks"]["priority"][$key]);
                    $task->setTaskStatusId($postData["tasks"]["taskStatusId"][$key]);
                    EntityManager::save($task);
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
     *  "name": "taskStatus_delete"
     * }
     */
    public function delete($id)
    {
        $taskStatus = $this->taskStatus_repository->find($id);
        EntityManager::remove($taskStatus);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "taskStatus_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $taskStatuses = $this->taskStatus_repository->findBy($filter);

        if (is_array($taskStatuses) && count($taskStatuses) > 0) {
            foreach ($taskStatuses as $taskStatus) {
                EntityManager::remove($taskStatus);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
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