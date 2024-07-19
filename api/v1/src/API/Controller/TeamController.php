<?php

namespace API\Controller;

use API\Entity\Team;
use API\Repository\TeamRepository;
use API\Repository\UserRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /team
 * @Security ROLE_USER
 */
class TeamController extends AbstractApiController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var TeamRepository
     */
    private $team_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        TeamRepository $team_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->team_repository = $team_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "team_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $teams = $this->team_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $teams
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "team_single"
     * }
     */
    public function single($id)
    {
        $team = $this->team_repository->find($id);

        if (!$team) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $team
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "team_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $team = $this->team_repository->find($postData["id"]);


                if (!$team) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $team = new Team();
            }
            $this->mapEntityFromArray($team, $postData, $filesData);

            EntityManager::save($team);

            $team = $this->triggerSave($team);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "team" => $team,
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
     *  "name": "team_delete"
     * }
     */
    public function delete($id)
    {
        $team = $this->team_repository->find($id);
        EntityManager::remove($team);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "team_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $teams = $this->team_repository->findBy($filter);

        if (is_array($teams) && count($teams) > 0) {
            foreach ($teams as $team) {
                EntityManager::remove($team);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(Team $team, array $data, array $files) {
        $team->setName($data["name"]);
        $team->setParentTeamId(!empty($data["parent_team_id"]) ? (int) $data["parent_team_id"] : null);
        $team->setPriority(isset($data["priority"]) ? (int) $data["priority"] : 0);
        $team->setDefaultRoles($data["default_roles"]);
        $team->setDefaultRights($data["default_rights"]);
        $team->setManagerUserId(!empty($data["manager_user_id"]) ? (int) $data["manager_user_id"] : null);
    }


    private function triggerSave(Team $team): Team
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "team" => $team
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("team");
    }
}