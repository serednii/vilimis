<?php

namespace API\Controller;

use API\Entity\Project;
use API\Entity\Task;
use API\Entity\TaskTimetrack;
use API\Repository\ClientRepository;
use API\Repository\ProjectRepository;
use API\Repository\TaskTimetrackRepository;
use API\Repository\TaskRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /taskTimetracksSummary
 */
class TaskTimetracksSummaryController extends AbstractApiController
{
    /**
     * @var EventManager
     */
    private $eventManager;

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
    private ProjectRepository $projectRepository;
    private TaskRepository $taskRepository;
    private ClientRepository $clientRepository;


    public function __construct(
        TaskTimetrackRepository $taskTimetrack_repository,
        ProjectRepository       $projectRepository,
        ClientRepository $clientRepository,
        TaskRepository          $taskRepository,
        JsonResponseFactory     $jsonResponseFactory,
        JsonSerializator        $jsonSerializator,
        EventManager            $eventManager
    )
    {
        $this->taskTimetrack_repository = $taskTimetrack_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
        $this->projectRepository = $projectRepository;
        $this->taskRepository = $taskRepository;
        $this->clientRepository = $clientRepository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "taskTimetracksSummary_list"
     * }
     */
    public function index()
    {
        $monthThis = date("Y-m");
        $monthLast = (new \DateTime('1 month ago'))->format("Y-m");

        /** @var Project[] $projects */
        $projects = $this->projectRepository->findBy();
        /** @var Task[] $tasks */
        $tasks = $this->taskRepository->findBy();
        /** @var Task[] $clients */
        $clients = $this->clientRepository->findBy();

        $projectDataThisMonth = [];
        $clientDataThisMonth = [];
        $totalDataThisMonth = ["seconds"=>0];

        $projectDataLastMonth = [];
        $clientDataLastMonth = [];
        $totalDataLastMonth = ["seconds"=>0];

        /** @var TaskTimetrack[] $taskTimetracksThisMonth */
        $taskTimetracksThisMonth = $this->taskTimetrack_repository->findBy([
            "datetime_start LIKE %1", $monthThis . "%"
        ]);

        /** @var TaskTimetrack[] $taskTimetracksLastMonth */
        $taskTimetracksLastMonth = $this->taskTimetrack_repository->findBy([
            "datetime_start LIKE %1", $monthLast . "%"
        ]);

        if (empty($taskTimetracksLastMonth) && empty($taskTimetracksThisMonth)) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "totalDataThisMonth" => $totalDataThisMonth,
                "totalDataLastMonth" => $totalDataLastMonth,
                "projectDataThisMonth" => array_values($projectDataThisMonth),
                "projectDataLastMonth" => array_values($projectDataLastMonth),
                "clientDataThisMonth" => array_values($clientDataThisMonth),
                "clientDataLastMonth" => array_values($clientDataLastMonth)
            ]));
        }

        foreach(["This","Last"] as $type) {
            foreach (${"taskTimetracks".$type."Month"} as $taskTimetracks) {
                $seconds = $taskTimetracks->getDatetimeStop()->getTimestamp() - $taskTimetracks->getDatetimeStart()->getTimestamp();
                ${"totalData".$type."Month"}["seconds"] += $seconds;
                foreach ($tasks as $task) {
                    if ($task->getId() == $taskTimetracks->getTaskId()) {
                        if (empty(${"projectData".$type."Month"}[$task->getProjectId()])) {
                            ${"projectData".$type."Month"}[$task->getProjectId()] = ["seconds" => 0];
                        }
                        ${"projectData".$type."Month"}[$task->getProjectId()]["seconds"] += $seconds;

                        foreach ($projects as $project) {
                            if ($project->getId() == $task->getProjectId()) {
                                if (empty(${"clientData".$type."Month"}[$project->getClientId()])) {
                                    ${"clientData".$type."Month"}[$project->getClientId()] = ["seconds" => 0];
                                }
                                ${"clientData".$type."Month"}[$project->getClientId()]["seconds"] += $seconds;
                                break;
                            }
                        }
                        break;
                    }
                }

                foreach (${"clientData".$type."Month"} as $id=>$data) {
                    foreach ($clients as $client) {
                        if ($client->getId() == $id) {
                            $data["name"] = $client->getName();
                            $data["id"] = $id;
                            ${"clientData".$type."Month"}[$id] = $data;
                            break;
                        }
                    }
                }

                foreach (${"projectData".$type."Month"} as $id=>$data) {
                    foreach ($projects as $project) {
                        if ($project->getId() == $id) {
                            $data["name"] = $project->getName();
                            $data["id"] = $id;
                            ${"projectData".$type."Month"}[$id] = $data;
                            break;
                        }
                    }
                }
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "totalDataThisMonth" => $totalDataThisMonth,
            "totalDataLastMonth" => $totalDataLastMonth,
            "projectDataThisMonth" => array_values($projectDataThisMonth),
            "projectDataLastMonth" => array_values($projectDataLastMonth),
            "clientDataThisMonth" => array_values($clientDataThisMonth),
            "clientDataLastMonth" => array_values($clientDataLastMonth)
        ]));
    }
}