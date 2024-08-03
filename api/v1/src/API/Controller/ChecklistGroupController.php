<?php

namespace API\Controller;

use API\Entity\ChecklistGroup;
use API\Repository\ChecklistGroupRepository;
use API\Repository\ChecklistRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /checklistGroup
 * @Security ROLE_USER
 */
class ChecklistGroupController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var ChecklistGroupRepository
     */
    private $checklistGroup_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        ChecklistGroupRepository $checklistGroup_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->checklistGroup_repository = $checklistGroup_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "checklistGroup_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $checklistGroups = $this->checklistGroup_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $checklistGroups
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "checklistGroup_single"
     * }
     */
    public function single($id)
    {
        $checklistGroup = $this->checklistGroup_repository->find($id);

        if (!$checklistGroup) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $checklistGroup
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "checklistGroup_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $checklistGroup = $this->checklistGroup_repository->find($postData["id"]);


                if (!$checklistGroup) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $checklistGroup = new ChecklistGroup();
            }
            $this->mapEntityFromArray($checklistGroup, $postData, $filesData);

            EntityManager::save($checklistGroup);

            $checklistGroup = $this->triggerSave($checklistGroup);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "checklistGroup" => $checklistGroup,
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
     *  "name": "checklistGroup_delete"
     * }
     */
    public function delete($id)
    {
        $checklistGroup = $this->checklistGroup_repository->find($id);
        EntityManager::remove($checklistGroup);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "checklistGroup_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $checklistGroups = $this->checklistGroup_repository->findBy($filter);

        if (is_array($checklistGroups) && count($checklistGroups) > 0) {
            foreach ($checklistGroups as $checklistGroup) {
                EntityManager::remove($checklistGroup);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(ChecklistGroup $checklistGroup, array $data, array $files) {
        $checklistGroup->setName($data["name"]);
        $checklistGroup->setDescription($data["description"]);
        $checklistGroup->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
        $checklistGroup->setDone((bool) isset($data["done"]) ? $data["done"] : false);
        $checklistGroup->setChecklistId(!empty($data["checklist_id"]) ? (int) $data["checklist_id"] : null);
    }


    private function triggerSave(ChecklistGroup $checklistGroup): ChecklistGroup
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "checklistGroup" => $checklistGroup
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("checklistGroup");
    }
}