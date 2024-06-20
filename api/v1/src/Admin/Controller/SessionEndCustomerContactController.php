<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\SessionEndCustomerContact;
use API\Repository\SessionEndCustomerContactRepository;
use API\Repository\SessionRepository;
use API\Repository\EndCustomerContactRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/sessionEndCustomerContact
 */
class SessionEndCustomerContactController
{
    /**
     * @var SessionEndCustomerContactRepository
     */
    private $sessionEndCustomerContact_repository;

    /**
     * @var SessionRepository
     */
    private $session_id_repository;

    /**
     * @var EndCustomerContactRepository
     */
    private $end_customer_contact_repository;


    public function __construct(
        SessionRepository $session_id_repository,
        EndCustomerContactRepository $end_customer_contact_repository,
        SessionEndCustomerContactRepository $sessionEndCustomerContact_repository
    )
    {
        $this->session_id_repository = $session_id_repository;
        $this->end_customer_contact_repository = $end_customer_contact_repository;
        $this->sessionEndCustomerContact_repository = $sessionEndCustomerContact_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_sessionEndCustomerContact"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["session_id"])) {
            $sessionEndCustomerContact = new SessionEndCustomerContact();
            $this->mapEntityFromArray($sessionEndCustomerContact, $postData, $filesData);

            EntityManager::save($sessionEndCustomerContact);

            Router::redirectTo("admin_sessionEndCustomerContact");
        }

        $session_ids = $this->session_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_contacts = $this->end_customer_contact_repository->findBy([],["ORDER BY" => "id"]);
        $sessionEndCustomerContacts = $this->sessionEndCustomerContact_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/sessionEndCustomerContact/index.html.twig", [
            "session_ids" => $session_ids,
            "end_customer_contacts" => $end_customer_contacts,
            "sessionEndCustomerContacts" => $sessionEndCustomerContacts
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_sessionEndCustomerContact_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["session_id"])) {
            $sessionEndCustomerContact = $this->sessionEndCustomerContact_repository->find($id);
            $this->mapEntityFromArray($sessionEndCustomerContact, $postData, $filesData);

            EntityManager::save($sessionEndCustomerContact);

            Router::redirectTo("admin_sessionEndCustomerContact_edit", ["id"=>$sessionEndCustomerContact->getId()]);
        }

        $session_ids = $this->session_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_contacts = $this->end_customer_contact_repository->findBy([],["ORDER BY" => "id"]);
        $sessionEndCustomerContact = $this->sessionEndCustomerContact_repository->find($id);

        return AdminResponse::createResponse("admin/sessionEndCustomerContact/edit.html.twig", [
            "session_ids" => $session_ids,
            "end_customer_contacts" => $end_customer_contacts,
            "sessionEndCustomerContact" => $sessionEndCustomerContact
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_sessionEndCustomerContact_delete"
     * }
     */
    public function delete($id)
    {
        $sessionEndCustomerContact = $this->sessionEndCustomerContact_repository->find($id);
        EntityManager::remove($sessionEndCustomerContact);

        Router::redirectTo("admin_sessionEndCustomerContact");
    }

    private function mapEntityFromArray(SessionEndCustomerContact $sessionEndCustomerContact, array $data, array $files) {
        $sessionEndCustomerContact->setSessionId(!empty($data["session_id"]) ? (int) $data["session_id"] : null);
        $sessionEndCustomerContact->setEndCustomerContact(!empty($data["end_customer_contact"]) ? (int) $data["end_customer_contact"] : null);
    }

}