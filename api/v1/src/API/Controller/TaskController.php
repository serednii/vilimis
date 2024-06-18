<?php

namespace API\Controller;

use API\Entity\Task;
use API\Repository\TaskRepository;
use API\Repository\ProjectRepository;
use API\Repository\TaskStatusRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /task
 */
class TaskController
{
    /**
     * @var TaskRepository
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
     *  "rule": "/list",
     *  "name": "task_list"
     * }
     */
    public function index()
    {
        $tasks = $this->task_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $tasks
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "task_single"
     * }
     */
    public function single($id)
    {
        $task = $this->task_repository->find($id);

        if (!$task) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $task
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "task_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $task = $this->task_repository->find($postData["id"]);


                if (!$task) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $task = new Task();
            }
            $this->mapEntityFromArray($task, $postData, $filesData);

            EntityManager::save($task);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "task" => $task,
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
     *  "name": "task_delete"
     * }
     */
    public function delete($id)
    {
        $task = $this->task_repository->find($id);
        EntityManager::remove($task);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(Task $task, array $data, array $files) {
        $task->setName($data["name"]);
        $task->setHourBudget(isset($data["hour_budget"]) ? (int) $data["hour_budget"] : 0);
        $task->setProjectId(!empty($data["project_id"]) ? (int) $data["project_id"] : null);
        $task->setTaskStatusId(!empty($data["task_status_id"]) ? (int) $data["task_status_id"] : null);
        $task->setDescription($data["description"]);
        $task->setDeadLineDate(!empty($data["dead_line_date"]) ? new \DateTime($data["dead_line_date"]) : null);
    }

}