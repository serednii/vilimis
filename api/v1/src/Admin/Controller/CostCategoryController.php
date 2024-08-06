<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\CostCategory;
use API\Repository\CostCategoryRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/costCategory
 */
class CostCategoryController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var CostCategoryRepository
     */
    private $costCategory_repository;


    public function __construct(
        EventManager $eventManager,
        CostCategoryRepository $costCategory_repository
    )
    {
        $this->eventManager = $eventManager;
        $this->costCategory_repository = $costCategory_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_costCategory"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $costCategory = new CostCategory();
            $this->mapEntityFromArray($costCategory, $postData, $filesData);

            EntityManager::save($costCategory);

            Router::redirectTo("admin_costCategory");
        }

        $costCategories = $this->costCategory_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/costCategory/index.html.twig", [
            "costCategories" => $costCategories
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_costCategory_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $costCategory = $this->costCategory_repository->find($id);
            $this->mapEntityFromArray($costCategory, $postData, $filesData);

            EntityManager::save($costCategory);
            $costCategory = $this->triggerSave($costCategory);

            Router::redirectTo("admin_costCategory_edit", ["id"=>$costCategory->getId()]);
        }

        $costCategory = $this->costCategory_repository->find($id);

        return AdminResponse::createResponse("admin/costCategory/edit.html.twig", [
            "costCategory" => $costCategory
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_costCategory_delete"
     * }
     */
    public function delete($id)
    {
        $costCategory = $this->costCategory_repository->find($id);
        EntityManager::remove($costCategory);

        Router::redirectTo("admin_costCategory");
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
}