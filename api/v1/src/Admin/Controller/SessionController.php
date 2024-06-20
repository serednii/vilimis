<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Session;
use API\Repository\SessionRepository;
use API\Repository\SessionTypeRepository;
use API\Repository\ClientRepository;
use API\Repository\EndCustomerRepository;
use API\Repository\ProjectRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/session
 */
class SessionController
{
    /**
     * @var SessionRepository
     */
    private $session_repository;

    /**
     * @var SessionTypeRepository
     */
    private $session_type_id_repository;

    /**
     * @var ClientRepository
     */
    private $client_id_repository;

    /**
     * @var EndCustomerRepository
     */
    private $end_customer_id_repository;

    /**
     * @var ProjectRepository
     */
    private $project_id_repository;


    public function __construct(
        SessionTypeRepository $session_type_id_repository,
        ClientRepository $client_id_repository,
        EndCustomerRepository $end_customer_id_repository,
        ProjectRepository $project_id_repository,
        SessionRepository $session_repository
    )
    {
        $this->session_type_id_repository = $session_type_id_repository;
        $this->client_id_repository = $client_id_repository;
        $this->end_customer_id_repository = $end_customer_id_repository;
        $this->project_id_repository = $project_id_repository;
        $this->session_repository = $session_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_session"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $session = new Session();
            $this->mapEntityFromArray($session, $postData, $filesData);

            EntityManager::save($session);

            Router::redirectTo("admin_session");
        }

        $session_type_ids = $this->session_type_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $project_ids = $this->project_id_repository->findBy([],["ORDER BY" => "id"]);
        $sessions = $this->session_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/session/index.html.twig", [
            "session_type_ids" => $session_type_ids,
            "client_ids" => $client_ids,
            "end_customer_ids" => $end_customer_ids,
            "project_ids" => $project_ids,
            "sessions" => $sessions
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_session_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $session = $this->session_repository->find($id);
            $this->mapEntityFromArray($session, $postData, $filesData);

            EntityManager::save($session);

            Router::redirectTo("admin_session_edit", ["id"=>$session->getId()]);
        }

        $session_type_ids = $this->session_type_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $project_ids = $this->project_id_repository->findBy([],["ORDER BY" => "id"]);
        $session = $this->session_repository->find($id);

        return AdminResponse::createResponse("admin/session/edit.html.twig", [
            "session_type_ids" => $session_type_ids,
            "client_ids" => $client_ids,
            "end_customer_ids" => $end_customer_ids,
            "project_ids" => $project_ids,
            "session" => $session
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_session_delete"
     * }
     */
    public function delete($id)
    {
        $session = $this->session_repository->find($id);
        EntityManager::remove($session);

        Router::redirectTo("admin_session");
    }

    private function mapEntityFromArray(Session $session, array $data, array $files) {
        $session->setName($data["name"]);
        $session->setDatetimeOfSession(!empty($data["datetime_of_session"]) ? new \DateTime($data["datetime_of_session"]) : null);
        $session->setDescription($data["description"]);
        $session->setSessionTypeId(!empty($data["session_type_id"]) ? (int) $data["session_type_id"] : null);
        $session->setClientId(!empty($data["client_id"]) ? (int) $data["client_id"] : null);
        $session->setEndCustomerId(!empty($data["end_customer_id"]) ? (int) $data["end_customer_id"] : null);
        $session->setProjectId(!empty($data["project_id"]) ? (int) $data["project_id"] : null);
    }

}