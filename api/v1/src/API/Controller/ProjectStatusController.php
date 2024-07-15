<?php

namespace API\Controller;

use API\Entity\ProjectStatus;
use API\Repository\ProjectStatusRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /projectStatus
 */
class ProjectStatusController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var ProjectStatusRepository
     */
    private $projectStatus_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        ProjectStatusRepository $projectStatus_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->projectStatus_repository = $projectStatus_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "projectStatus_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $projectStatuses = $this->projectStatus_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $projectStatuses
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "projectStatus_single"
     * }
     */
    public function single($id)
    {
        $projectStatus = $this->projectStatus_repository->find($id);

        if (!$projectStatus) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $projectStatus
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "projectStatus_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $projectStatus = $this->projectStatus_repository->find($postData["id"]);


                if (!$projectStatus) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $projectStatus = new ProjectStatus();
            }
            $this->mapEntityFromArray($projectStatus, $postData, $filesData);

            EntityManager::save($projectStatus);

            $projectStatus = $this->triggerSave($projectStatus);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "projectStatus" => $projectStatus,
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
     *  "name": "projectStatus_delete"
     * }
     */
    public function delete($id)
    {
        $projectStatus = $this->projectStatus_repository->find($id);
        EntityManager::remove($projectStatus);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "projectStatus_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $projectStatuses = $this->projectStatus_repository->findBy($filter);

        if (is_array($projectStatuses) && count($projectStatuses) > 0) {
            foreach ($projectStatuses as $projectStatus) {
                EntityManager::remove($projectStatus);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(ProjectStatus $projectStatus, array $data, array $files) {
        $projectStatus->setName($data["name"]);
        $projectStatus->setColor($data["color"]);
        $projectStatus->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
    }


    private function triggerSave(ProjectStatus $projectStatus): ProjectStatus
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "projectStatus" => $projectStatus
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("projectStatus");
    }
}