<?php

namespace API\Controller;

use API\Entity\Task;
use API\Repository\TaskRepository;
use API\Repository\ProjectRepository;
use API\Repository\TaskStatusRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /task
 */
class TaskController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

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
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->task_repository = $task_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "task_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $tasks = $this->task_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

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

            $task = $this->triggerSave($task);


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


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "task_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $tasks = $this->task_repository->findBy($filter);

        if (is_array($tasks) && count($tasks) > 0) {
            foreach ($tasks as $task) {
                EntityManager::remove($task);
            }
        }

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
        $task->setClosed((bool) isset($data["closed"]) ? $data["closed"] : false);
        $task->setArchived((bool) isset($data["archived"]) ? $data["archived"] : false);
        $task->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
        $task->setSpendingTime(isset($data["spending_time"]) ? (int) $data["spending_time"] : 0);
        $task->setPlannedDate(!empty($data["planned_date"]) ? new \DateTime($data["planned_date"]) : null);
        $task->setPlannedPriority(isset($data["planned_priority"]) ? (int) $data["planned_priority"] : 0);
        $task->setBoundToTaskId(!empty($data["bound_to_task_id"]) ? (int) $data["bound_to_task_id"] : null);
    }


    private function triggerSave(Task $task): Task
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "task" => $task
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("task");
    }
}