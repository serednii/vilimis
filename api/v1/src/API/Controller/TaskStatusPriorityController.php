<?php

namespace API\Controller;

use API\Entity\TaskStatus;
use API\Repository\TaskStatusRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /taskStatusPriority
 */
class TaskStatusPriorityController extends AbstractApiController
{

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;
    private TaskStatusRepository $taskStatusRepository;

    public function __construct(
        TaskStatusRepository $taskStatusRepository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->taskStatusRepository = $taskStatusRepository;
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "taskStatusPriority_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["taskStatuses"]) && is_array($postData["taskStatuses"])) {
            foreach ($postData["taskStatuses"]["id"] as $key=>$id) {
                /** @var TaskStatus $taskStatus */
                $taskStatus = $this->taskStatusRepository->find($id);

                if ($taskStatus) {
                    $taskStatus->setPriority($postData["taskStatuses"]["priority"][$key]);
                    EntityManager::save($taskStatus);
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