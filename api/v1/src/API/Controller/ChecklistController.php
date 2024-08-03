<?php

namespace API\Controller;

use API\Entity\Checklist;
use API\Repository\ChecklistRepository;
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
 * @RoutePrefix /checklist
 * @Security ROLE_USER
 */
class ChecklistController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var ChecklistRepository
     */
    private $checklist_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        ChecklistRepository $checklist_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->checklist_repository = $checklist_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "checklist_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $checklists = $this->checklist_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $checklists
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "checklist_single"
     * }
     */
    public function single($id)
    {
        $checklist = $this->checklist_repository->find($id);

        if (!$checklist) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $checklist
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "checklist_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $checklist = $this->checklist_repository->find($postData["id"]);


                if (!$checklist) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $checklist = new Checklist();
            }
            $this->mapEntityFromArray($checklist, $postData, $filesData);

            EntityManager::save($checklist);

            $checklist = $this->triggerSave($checklist);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "checklist" => $checklist,
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
     *  "name": "checklist_delete"
     * }
     */
    public function delete($id)
    {
        $checklist = $this->checklist_repository->find($id);
        EntityManager::remove($checklist);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "checklist_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $checklists = $this->checklist_repository->findBy($filter);

        if (is_array($checklists) && count($checklists) > 0) {
            foreach ($checklists as $checklist) {
                EntityManager::remove($checklist);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(Checklist $checklist, array $data, array $files) {
        $checklist->setName($data["name"]);
        $checklist->setDescription($data["description"]);
        $checklist->setProjectId(!empty($data["project_id"]) ? (int) $data["project_id"] : null);
        $checklist->setTaskId(!empty($data["task_id"]) ? (int) $data["task_id"] : null);
    }


    private function triggerSave(Checklist $checklist): Checklist
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "checklist" => $checklist
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("checklist");
    }
}