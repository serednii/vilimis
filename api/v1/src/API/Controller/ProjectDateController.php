<?php

namespace API\Controller;

use API\Entity\ProjectDate;
use API\Repository\ProjectDateRepository;
use API\Repository\ProjectRepository;
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
 * @RoutePrefix /projectDate
 */
class ProjectDateController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

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
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->projectDate_repository = $projectDate_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "projectDate_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $projectDates = $this->projectDate_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $projectDates
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "projectDate_single"
     * }
     */
    public function single($id)
    {
        $projectDate = $this->projectDate_repository->find($id);

        if (!$projectDate) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $projectDate
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

            if (!empty($postData["id"])) {
                $projectDate = $this->projectDate_repository->find($postData["id"]);


                if (!$projectDate) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $projectDate = new ProjectDate();
            }
            $this->mapEntityFromArray($projectDate, $postData, $filesData);

            EntityManager::save($projectDate);

            $projectDate = $this->triggerSave($projectDate);


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
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "projectDate_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $projectDates = $this->projectDate_repository->findBy($filter);

        if (is_array($projectDates) && count($projectDates) > 0) {
            foreach ($projectDates as $projectDate) {
                EntityManager::remove($projectDate);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(ProjectDate $projectDate, array $data, array $files) {
        $projectDate->setName($data["name"]);
        $projectDate->setDate(!empty($data["date"]) ? new \DateTime($data["date"]) : null);
        $projectDate->setColor($data["color"]);
        $projectDate->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
        $projectDate->setDone((bool) isset($data["done"]) ? $data["done"] : false);
        $projectDate->setProjectId(!empty($data["project_id"]) ? (int) $data["project_id"] : null);
        $projectDate->setTaskId(!empty($data["task_id"]) ? (int) $data["task_id"] : null);
    }


    private function triggerSave(ProjectDate $projectDate): ProjectDate
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "projectDate" => $projectDate
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("projectDate");
    }
}