<?php

namespace API\Controller;

use API\Entity\TaskStatus;
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
 * @RoutePrefix /taskStatus
 */
class TaskStatusController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

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
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->taskStatus_repository = $taskStatus_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "taskStatus_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $taskStatuses = $this->taskStatus_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $taskStatuses
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "taskStatus_single"
     * }
     */
    public function single($id)
    {
        $taskStatus = $this->taskStatus_repository->find($id);

        if (!$taskStatus) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $taskStatus
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

            if (!empty($postData["id"])) {
                $taskStatus = $this->taskStatus_repository->find($postData["id"]);


                if (!$taskStatus) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $taskStatus = new TaskStatus();
            }
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


    private function triggerSave(TaskStatus $taskStatus): TaskStatus
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "taskStatus" => $taskStatus
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("taskStatus");
    }
}