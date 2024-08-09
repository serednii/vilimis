<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\License;
use API\Repository\LicenseRepository;
use API\Repository\ProjectRepository;
use API\Repository\ClientRepository;
use API\Repository\EndCustomerRepository;
use API\Repository\CostRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/license
 */
class LicenseController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var LicenseRepository
     */
    private $license_repository;

    /**
     * @var ProjectRepository
     */
    private $project_id_repository;

    /**
     * @var ClientRepository
     */
    private $client_id_repository;

    /**
     * @var EndCustomerRepository
     */
    private $end_customer_id_repository;

    /**
     * @var LicenseRepository
     */
    private $before_license_id_repository;

    /**
     * @var LicenseRepository
     */
    private $after_license_id_repository;

    /**
     * @var CostRepository
     */
    private $cost_id_repository;


    public function __construct(
        ProjectRepository $project_id_repository,
        ClientRepository $client_id_repository,
        EndCustomerRepository $end_customer_id_repository,
        LicenseRepository $before_license_id_repository,
        LicenseRepository $after_license_id_repository,
        CostRepository $cost_id_repository,
        EventManager $eventManager,
        LicenseRepository $license_repository
    )
    {
        $this->project_id_repository = $project_id_repository;
        $this->client_id_repository = $client_id_repository;
        $this->end_customer_id_repository = $end_customer_id_repository;
        $this->before_license_id_repository = $before_license_id_repository;
        $this->after_license_id_repository = $after_license_id_repository;
        $this->cost_id_repository = $cost_id_repository;
        $this->eventManager = $eventManager;
        $this->license_repository = $license_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_license"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $license = new License();
            $this->mapEntityFromArray($license, $postData, $filesData);

            EntityManager::save($license);

            Router::redirectTo("admin_license");
        }

        $project_ids = $this->project_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $before_license_ids = $this->before_license_id_repository->findBy([],["ORDER BY" => "id"]);
        $after_license_ids = $this->after_license_id_repository->findBy([],["ORDER BY" => "id"]);
        $cost_ids = $this->cost_id_repository->findBy([],["ORDER BY" => "id"]);
        $licenses = $this->license_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/license/index.html.twig", [
            "project_ids" => $project_ids,
            "client_ids" => $client_ids,
            "end_customer_ids" => $end_customer_ids,
            "before_license_ids" => $before_license_ids,
            "after_license_ids" => $after_license_ids,
            "cost_ids" => $cost_ids,
            "licenses" => $licenses
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_license_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $license = $this->license_repository->find($id);
            $this->mapEntityFromArray($license, $postData, $filesData);

            EntityManager::save($license);
            $license = $this->triggerSave($license);

            Router::redirectTo("admin_license_edit", ["id"=>$license->getId()]);
        }

        $project_ids = $this->project_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $before_license_ids = $this->before_license_id_repository->findBy([],["ORDER BY" => "id"]);
        $after_license_ids = $this->after_license_id_repository->findBy([],["ORDER BY" => "id"]);
        $cost_ids = $this->cost_id_repository->findBy([],["ORDER BY" => "id"]);
        $license = $this->license_repository->find($id);

        return AdminResponse::createResponse("admin/license/edit.html.twig", [
            "project_ids" => $project_ids,
            "client_ids" => $client_ids,
            "end_customer_ids" => $end_customer_ids,
            "before_license_ids" => $before_license_ids,
            "after_license_ids" => $after_license_ids,
            "cost_ids" => $cost_ids,
            "license" => $license
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_license_delete"
     * }
     */
    public function delete($id)
    {
        $license = $this->license_repository->find($id);
        EntityManager::remove($license);

        Router::redirectTo("admin_license");
    }

    private function mapEntityFromArray(License $license, array $data, array $files) {
        $license->setName($data["name"]);
        $license->setDescription($data["description"]);
        $license->setDateFrom(!empty($data["date_from"]) ? new \DateTime($data["date_from"]) : null);
        $license->setDateTo(!empty($data["date_to"]) ? new \DateTime($data["date_to"]) : null);
        $license->setAmount(isset($data["amount"]) ? (float) $data["amount"] : 0);
        $license->setProjectId(!empty($data["project_id"]) ? (int) $data["project_id"] : null);
        $license->setClientId(!empty($data["client_id"]) ? (int) $data["client_id"] : null);
        $license->setEndCustomerId(!empty($data["end_customer_id"]) ? (int) $data["end_customer_id"] : null);
        $license->setBeforeLicenseId(!empty($data["before_license_id"]) ? (int) $data["before_license_id"] : null);
        $license->setAfterLicenseId(!empty($data["after_license_id"]) ? (int) $data["after_license_id"] : null);
        $license->setCostId(!empty($data["cost_id"]) ? (int) $data["cost_id"] : null);
    }


    private function triggerSave(License $license): License
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "license" => $license
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("license");
    }
}