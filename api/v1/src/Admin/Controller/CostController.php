<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Cost;
use API\Repository\CostRepository;
use API\Repository\CostCategoryRepository;
use API\Repository\CostRepeatableRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/cost
 */
class CostController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var CostRepository
     */
    private $cost_repository;

    /**
     * @var CostCategoryRepository
     */
    private $cost_category_id_repository;

    /**
     * @var CostRepeatableRepository
     */
    private $cost_repeatable_id_repository;


    public function __construct(
        CostCategoryRepository $cost_category_id_repository,
        CostRepeatableRepository $cost_repeatable_id_repository,
        EventManager $eventManager,
        CostRepository $cost_repository
    )
    {
        $this->cost_category_id_repository = $cost_category_id_repository;
        $this->cost_repeatable_id_repository = $cost_repeatable_id_repository;
        $this->eventManager = $eventManager;
        $this->cost_repository = $cost_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_cost"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $cost = new Cost();
            $this->mapEntityFromArray($cost, $postData, $filesData);

            EntityManager::save($cost);

            Router::redirectTo("admin_cost");
        }

        $cost_category_ids = $this->cost_category_id_repository->findBy([],["ORDER BY" => "id"]);
        $cost_repeatable_ids = $this->cost_repeatable_id_repository->findBy([],["ORDER BY" => "id"]);
        $costs = $this->cost_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/cost/index.html.twig", [
            "cost_category_ids" => $cost_category_ids,
            "cost_repeatable_ids" => $cost_repeatable_ids,
            "costs" => $costs
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_cost_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $cost = $this->cost_repository->find($id);
            $this->mapEntityFromArray($cost, $postData, $filesData);

            EntityManager::save($cost);
            $cost = $this->triggerSave($cost);

            Router::redirectTo("admin_cost_edit", ["id"=>$cost->getId()]);
        }

        $cost_category_ids = $this->cost_category_id_repository->findBy([],["ORDER BY" => "id"]);
        $cost_repeatable_ids = $this->cost_repeatable_id_repository->findBy([],["ORDER BY" => "id"]);
        $cost = $this->cost_repository->find($id);

        return AdminResponse::createResponse("admin/cost/edit.html.twig", [
            "cost_category_ids" => $cost_category_ids,
            "cost_repeatable_ids" => $cost_repeatable_ids,
            "cost" => $cost
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_cost_delete"
     * }
     */
    public function delete($id)
    {
        $cost = $this->cost_repository->find($id);
        EntityManager::remove($cost);

        Router::redirectTo("admin_cost");
    }

    private function mapEntityFromArray(Cost $cost, array $data, array $files) {
        $cost->setName($data["name"]);
        $cost->setDescription($data["description"]);
        $cost->setCostCategoryId(!empty($data["cost_category_id"]) ? (int) $data["cost_category_id"] : null);
        $cost->setAmount(isset($data["amount"]) ? (float) $data["amount"] : 0);
        $cost->setDayOfAccounting(!empty($data["day_of_accounting"]) ? new \DateTime($data["day_of_accounting"]) : null);
        $cost->setCostRepeatableId(!empty($data["cost_repeatable_id"]) ? (int) $data["cost_repeatable_id"] : null);
    }


    private function triggerSave(Cost $cost): Cost
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "cost" => $cost
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("cost");
    }
}