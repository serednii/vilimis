<?php

namespace API\Controller;

use API\Entity\Session;
use API\Repository\SessionRepository;
use API\Repository\SessionTypeRepository;
use API\Repository\ClientRepository;
use API\Repository\EndCustomerRepository;
use API\Repository\ProjectRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /session
 * @Security ROLE_USER
 */
class SessionController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var SessionRepository
     */
    private $session_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        SessionRepository $session_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->session_repository = $session_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "session_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $sessions = $this->session_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $sessions
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "session_single"
     * }
     */
    public function single($id)
    {
        $session = $this->session_repository->find($id);

        if (!$session) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $session
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "session_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $session = $this->session_repository->find($postData["id"]);


                if (!$session) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $session = new Session();
            }
            $this->mapEntityFromArray($session, $postData, $filesData);

            EntityManager::save($session);

            $session = $this->triggerSave($session);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "session" => $session,
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
     *  "name": "session_delete"
     * }
     */
    public function delete($id)
    {
        $session = $this->session_repository->find($id);
        EntityManager::remove($session);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "session_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $sessions = $this->session_repository->findBy($filter);

        if (is_array($sessions) && count($sessions) > 0) {
            foreach ($sessions as $session) {
                EntityManager::remove($session);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
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


    private function triggerSave(Session $session): Session
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "session" => $session
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("session");
    }
}