<?php

namespace API\Controller;

use API\Entity\TaskTimetrack;
use API\Repository\TaskTimetrackRepository;
use API\Repository\TaskRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /taskTimetrack
 */
class TaskTimetrackController
{
    /**
     * @var TaskTimetrackRepository
     */
    private $taskTimetrack_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    public function __construct(
        TaskTimetrackRepository $taskTimetrack_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->taskTimetrack_repository = $taskTimetrack_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "taskTimetrack_list"
     * }
     */
    public function index()
    {
        $taskTimetracks = $this->taskTimetrack_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $taskTimetracks
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "taskTimetrack_single"
     * }
     */
    public function single($id)
    {
        $taskTimetrack = $this->taskTimetrack_repository->find($id);

        if (!$taskTimetrack) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $taskTimetrack
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "taskTimetrack_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["task_id"])) {

            if (!empty($postData["id"])) {
                $taskTimetrack = $this->taskTimetrack_repository->find($postData["id"]);


                if (!$taskTimetrack) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $taskTimetrack = new TaskTimetrack();
            }
            $this->mapEntityFromArray($taskTimetrack, $postData, $filesData);

            EntityManager::save($taskTimetrack);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "taskTimetrack" => $taskTimetrack,
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
     *  "name": "taskTimetrack_delete"
     * }
     */
    public function delete($id)
    {
        $taskTimetrack = $this->taskTimetrack_repository->find($id);
        EntityManager::remove($taskTimetrack);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(TaskTimetrack $taskTimetrack, array $data, array $files) {
        $taskTimetrack->setTaskId(!empty($data["task_id"]) ? (int) $data["task_id"] : null);
        $taskTimetrack->setDatetimeStart(new \DateTime($data["datetime_start"]));
        $taskTimetrack->setDatetimeStop(new \DateTime($data["datetime_stop"]));
    }

}