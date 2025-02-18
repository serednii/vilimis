<?php

namespace API\Controller;

use API\Entity\SessionEndCustomerContact;
use API\Repository\SessionEndCustomerContactRepository;
use API\Repository\SessionRepository;
use API\Repository\EndCustomerContactRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /sessionEndCustomerContact
 * @Security ROLE_USER
 */
class SessionEndCustomerContactController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var SessionEndCustomerContactRepository
     */
    private $sessionEndCustomerContact_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        SessionEndCustomerContactRepository $sessionEndCustomerContact_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->sessionEndCustomerContact_repository = $sessionEndCustomerContact_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "sessionEndCustomerContact_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $sessionEndCustomerContacts = $this->sessionEndCustomerContact_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $sessionEndCustomerContacts
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "sessionEndCustomerContact_single"
     * }
     */
    public function single($id)
    {
        $sessionEndCustomerContact = $this->sessionEndCustomerContact_repository->find($id);

        if (!$sessionEndCustomerContact) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $sessionEndCustomerContact
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "sessionEndCustomerContact_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["session_id"])) {

            if (!empty($postData["id"])) {
                $sessionEndCustomerContact = $this->sessionEndCustomerContact_repository->find($postData["id"]);


                if (!$sessionEndCustomerContact) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $sessionEndCustomerContact = new SessionEndCustomerContact();
            }
            $this->mapEntityFromArray($sessionEndCustomerContact, $postData, $filesData);

            EntityManager::save($sessionEndCustomerContact);

            $sessionEndCustomerContact = $this->triggerSave($sessionEndCustomerContact);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "sessionEndCustomerContact" => $sessionEndCustomerContact,
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
     *  "name": "sessionEndCustomerContact_delete"
     * }
     */
    public function delete($id)
    {
        $sessionEndCustomerContact = $this->sessionEndCustomerContact_repository->find($id);
        EntityManager::remove($sessionEndCustomerContact);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "sessionEndCustomerContact_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $sessionEndCustomerContacts = $this->sessionEndCustomerContact_repository->findBy($filter);

        if (is_array($sessionEndCustomerContacts) && count($sessionEndCustomerContacts) > 0) {
            foreach ($sessionEndCustomerContacts as $sessionEndCustomerContact) {
                EntityManager::remove($sessionEndCustomerContact);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(SessionEndCustomerContact $sessionEndCustomerContact, array $data, array $files) {
        $sessionEndCustomerContact->setSessionId(!empty($data["session_id"]) ? (int) $data["session_id"] : null);
        $sessionEndCustomerContact->setEndCustomerContactId(!empty($data["end_customer_contact_id"]) ? (int) $data["end_customer_contact_id"] : null);
    }


    private function triggerSave(SessionEndCustomerContact $sessionEndCustomerContact): SessionEndCustomerContact
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "sessionEndCustomerContact" => $sessionEndCustomerContact
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("sessionEndCustomerContact");
    }
}