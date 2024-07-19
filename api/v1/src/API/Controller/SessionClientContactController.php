<?php

namespace API\Controller;

use API\Entity\SessionClientContact;
use API\Repository\SessionClientContactRepository;
use API\Repository\SessionRepository;
use API\Repository\ClientContactRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /sessionClientContact
 * @Security ROLE_USER
 */
class SessionClientContactController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var SessionClientContactRepository
     */
    private $sessionClientContact_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        SessionClientContactRepository $sessionClientContact_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->sessionClientContact_repository = $sessionClientContact_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "sessionClientContact_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $sessionClientContacts = $this->sessionClientContact_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $sessionClientContacts
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "sessionClientContact_single"
     * }
     */
    public function single($id)
    {
        $sessionClientContact = $this->sessionClientContact_repository->find($id);

        if (!$sessionClientContact) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $sessionClientContact
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "sessionClientContact_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["session_id"])) {

            if (!empty($postData["id"])) {
                $sessionClientContact = $this->sessionClientContact_repository->find($postData["id"]);


                if (!$sessionClientContact) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $sessionClientContact = new SessionClientContact();
            }
            $this->mapEntityFromArray($sessionClientContact, $postData, $filesData);

            EntityManager::save($sessionClientContact);

            $sessionClientContact = $this->triggerSave($sessionClientContact);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "sessionClientContact" => $sessionClientContact,
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
     *  "name": "sessionClientContact_delete"
     * }
     */
    public function delete($id)
    {
        $sessionClientContact = $this->sessionClientContact_repository->find($id);
        EntityManager::remove($sessionClientContact);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "sessionClientContact_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $sessionClientContacts = $this->sessionClientContact_repository->findBy($filter);

        if (is_array($sessionClientContacts) && count($sessionClientContacts) > 0) {
            foreach ($sessionClientContacts as $sessionClientContact) {
                EntityManager::remove($sessionClientContact);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(SessionClientContact $sessionClientContact, array $data, array $files) {
        $sessionClientContact->setSessionId(!empty($data["session_id"]) ? (int) $data["session_id"] : null);
        $sessionClientContact->setClientContactId(!empty($data["client_contact_id"]) ? (int) $data["client_contact_id"] : null);
    }


    private function triggerSave(SessionClientContact $sessionClientContact): SessionClientContact
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "sessionClientContact" => $sessionClientContact
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("sessionClientContact");
    }
}