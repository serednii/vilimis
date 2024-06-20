<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\SessionClientContact;
use API\Repository\SessionClientContactRepository;
use API\Repository\SessionRepository;
use API\Repository\ClientContactRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/sessionClientContact
 */
class SessionClientContactController
{
    /**
     * @var SessionClientContactRepository
     */
    private $sessionClientContact_repository;

    /**
     * @var SessionRepository
     */
    private $session_id_repository;

    /**
     * @var ClientContactRepository
     */
    private $client_contact_id_repository;


    public function __construct(
        SessionRepository $session_id_repository,
        ClientContactRepository $client_contact_id_repository,
        SessionClientContactRepository $sessionClientContact_repository
    )
    {
        $this->session_id_repository = $session_id_repository;
        $this->client_contact_id_repository = $client_contact_id_repository;
        $this->sessionClientContact_repository = $sessionClientContact_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_sessionClientContact"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["session_id"])) {
            $sessionClientContact = new SessionClientContact();
            $this->mapEntityFromArray($sessionClientContact, $postData, $filesData);

            EntityManager::save($sessionClientContact);

            Router::redirectTo("admin_sessionClientContact");
        }

        $session_ids = $this->session_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_contact_ids = $this->client_contact_id_repository->findBy([],["ORDER BY" => "id"]);
        $sessionClientContacts = $this->sessionClientContact_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/sessionClientContact/index.html.twig", [
            "session_ids" => $session_ids,
            "client_contact_ids" => $client_contact_ids,
            "sessionClientContacts" => $sessionClientContacts
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_sessionClientContact_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["session_id"])) {
            $sessionClientContact = $this->sessionClientContact_repository->find($id);
            $this->mapEntityFromArray($sessionClientContact, $postData, $filesData);

            EntityManager::save($sessionClientContact);

            Router::redirectTo("admin_sessionClientContact_edit", ["id"=>$sessionClientContact->getId()]);
        }

        $session_ids = $this->session_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_contact_ids = $this->client_contact_id_repository->findBy([],["ORDER BY" => "id"]);
        $sessionClientContact = $this->sessionClientContact_repository->find($id);

        return AdminResponse::createResponse("admin/sessionClientContact/edit.html.twig", [
            "session_ids" => $session_ids,
            "client_contact_ids" => $client_contact_ids,
            "sessionClientContact" => $sessionClientContact
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_sessionClientContact_delete"
     * }
     */
    public function delete($id)
    {
        $sessionClientContact = $this->sessionClientContact_repository->find($id);
        EntityManager::remove($sessionClientContact);

        Router::redirectTo("admin_sessionClientContact");
    }

    private function mapEntityFromArray(SessionClientContact $sessionClientContact, array $data, array $files) {
        $sessionClientContact->setSessionId(!empty($data["session_id"]) ? (int) $data["session_id"] : null);
        $sessionClientContact->setClientContactId(!empty($data["client_contact_id"]) ? (int) $data["client_contact_id"] : null);
    }

}