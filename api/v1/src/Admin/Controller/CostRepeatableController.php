<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\CostRepeatable;
use API\Repository\CostRepeatableRepository;
use API\Repository\CostCategoryRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/costRepeatable
 */
class CostRepeatableController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var CostRepeatableRepository
     */
    private $costRepeatable_repository;

    /**
     * @var CostCategoryRepository
     */
    private $cost_category_id_repository;


    public function __construct(
        CostCategoryRepository $cost_category_id_repository,
        EventManager $eventManager,
        CostRepeatableRepository $costRepeatable_repository
    )
    {
        $this->cost_category_id_repository = $cost_category_id_repository;
        $this->eventManager = $eventManager;
        $this->costRepeatable_repository = $costRepeatable_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_costRepeatable"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $costRepeatable = new CostRepeatable();
            $this->mapEntityFromArray($costRepeatable, $postData, $filesData);

            EntityManager::save($costRepeatable);

            Router::redirectTo("admin_costRepeatable");
        }

        $cost_category_ids = $this->cost_category_id_repository->findBy([],["ORDER BY" => "id"]);
        $costRepeatables = $this->costRepeatable_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/costRepeatable/index.html.twig", [
            "cost_category_ids" => $cost_category_ids,
            "costRepeatables" => $costRepeatables
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_costRepeatable_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $costRepeatable = $this->costRepeatable_repository->find($id);
            $this->mapEntityFromArray($costRepeatable, $postData, $filesData);

            EntityManager::save($costRepeatable);
            $costRepeatable = $this->triggerSave($costRepeatable);

            Router::redirectTo("admin_costRepeatable_edit", ["id"=>$costRepeatable->getId()]);
        }

        $cost_category_ids = $this->cost_category_id_repository->findBy([],["ORDER BY" => "id"]);
        $costRepeatable = $this->costRepeatable_repository->find($id);

        return AdminResponse::createResponse("admin/costRepeatable/edit.html.twig", [
            "cost_category_ids" => $cost_category_ids,
            "costRepeatable" => $costRepeatable
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_costRepeatable_delete"
     * }
     */
    public function delete($id)
    {
        $costRepeatable = $this->costRepeatable_repository->find($id);
        EntityManager::remove($costRepeatable);

        Router::redirectTo("admin_costRepeatable");
    }

    private function mapEntityFromArray(CostRepeatable $costRepeatable, array $data, array $files) {
        $costRepeatable->setName($data["name"]);
        $costRepeatable->setDescription($data["description"]);
        $costRepeatable->setCostCategoryId(!empty($data["cost_category_id"]) ? (int) $data["cost_category_id"] : null);
        $costRepeatable->setFrequency($data["frequency"]);
        $costRepeatable->setAmount(isset($data["amount"]) ? (float) $data["amount"] : 0);
        $costRepeatable->setDayOfAccounting(isset($data["day_of_accounting"]) ? (int) $data["day_of_accounting"] : 0);
        $costRepeatable->setFirstDayOfAccounting(!empty($data["first_day_of_accounting"]) ? new \DateTime($data["first_day_of_accounting"]) : null);
    }


    private function triggerSave(CostRepeatable $costRepeatable): CostRepeatable
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "costRepeatable" => $costRepeatable
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("costRepeatable");
    }
}