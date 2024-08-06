<?php

namespace API\Controller;

use API\Entity\CostCategory;
use API\Repository\CostCategoryRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /costCategory
 * @Security ROLE_USER
 */
class CostCategoryController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";
    const EVENT_BEFORE_SAVE = __CLASS__ . "::EVENT_BEFORE_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var CostCategoryRepository
     */
    private $costCategory_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        CostCategoryRepository $costCategory_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->costCategory_repository = $costCategory_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "costCategory_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $costCategories = $this->costCategory_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $costCategories
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "costCategory_single"
     * }
     */
    public function single($id)
    {
        $costCategory = $this->costCategory_repository->find($id);

        if (!$costCategory) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $costCategory
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "costCategory_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $costCategory = $this->costCategory_repository->find($postData["id"]);


                if (!$costCategory) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $costCategory = new CostCategory();
            }
            $this->mapEntityFromArray($costCategory, $postData, $filesData);

            try {
                $costCategory = $this->triggerBeforeSave($costCategory);

                EntityManager::save($costCategory);

                $costCategory = $this->triggerSave($costCategory);
            } catch (\Exception $exception) {
                return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                    "message" => $exception->getMessage(),
                    "code" => 500
                ]));
            }

            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "costCategory" => $costCategory,
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
     *  "name": "costCategory_delete"
     * }
     */
    public function delete($id)
    {
        $costCategory = $this->costCategory_repository->find($id);
        EntityManager::remove($costCategory);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "costCategory_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $costCategories = $this->costCategory_repository->findBy($filter);

        if (is_array($costCategories) && count($costCategories) > 0) {
            foreach ($costCategories as $costCategory) {
                EntityManager::remove($costCategory);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(CostCategory $costCategory, array $data, array $files) {
        $costCategory->setName($data["name"]);
        $costCategory->setColor($data["color"]);
    }


    private function triggerSave(CostCategory $costCategory): CostCategory
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "costCategory" => $costCategory
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("costCategory");
    }

    private function triggerBeforeSave(CostCategory $costCategory): CostCategory
    {
        $event = new Event();
        $event->setName(self::EVENT_BEFORE_SAVE);
        $event->setParams([
            "costCategory" => $costCategory
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("costCategory");
    }
}