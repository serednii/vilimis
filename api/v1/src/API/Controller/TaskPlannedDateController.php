<?php

namespace API\Controller;

use API\Entity\Task;
use API\Entity\TaskStatus;
use API\Repository\TaskRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /taskPlannedDate
 */
class TaskPlannedDateController extends AbstractApiController
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
     *  "rule": "/save",
     *  "name": "taskPlannedDate_save"
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
                    $task->setPlannedPriority($postData["tasks"]["planned_priority"][$key]);
                    $task->setPlannedDate($postData["tasks"]["planned_date"][$key] && $postData["tasks"]["planned_date"][$key] ? new \DateTime($postData["tasks"]["planned_date"][$key]) : null);
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

}