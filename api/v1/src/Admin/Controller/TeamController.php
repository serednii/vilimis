<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Team;
use API\Repository\TeamRepository;
use API\Repository\UserRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/team
 */
class TeamController
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
     * @var TeamRepository
     */
    private $parent_team_id_repository;

    /**
     * @var UserRepository
     */
    private $manager_user_id_repository;


    public function __construct(
        TeamRepository $parent_team_id_repository,
        UserRepository $manager_user_id_repository,
        EventManager $eventManager,
        TeamRepository $team_repository
    )
    {
        $this->parent_team_id_repository = $parent_team_id_repository;
        $this->manager_user_id_repository = $manager_user_id_repository;
        $this->eventManager = $eventManager;
        $this->team_repository = $team_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_team"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $team = new Team();
            $this->mapEntityFromArray($team, $postData, $filesData);

            EntityManager::save($team);

            Router::redirectTo("admin_team");
        }

        $parent_team_ids = $this->parent_team_id_repository->findBy([],["ORDER BY" => "id"]);
        $manager_user_ids = $this->manager_user_id_repository->findBy([],["ORDER BY" => "id"]);
        $teams = $this->team_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/team/index.html.twig", [
            "parent_team_ids" => $parent_team_ids,
            "manager_user_ids" => $manager_user_ids,
            "teams" => $teams
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_team_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $team = $this->team_repository->find($id);
            $this->mapEntityFromArray($team, $postData, $filesData);

            EntityManager::save($team);
            $team = $this->triggerSave($team);

            Router::redirectTo("admin_team_edit", ["id"=>$team->getId()]);
        }

        $parent_team_ids = $this->parent_team_id_repository->findBy([],["ORDER BY" => "id"]);
        $manager_user_ids = $this->manager_user_id_repository->findBy([],["ORDER BY" => "id"]);
        $team = $this->team_repository->find($id);

        return AdminResponse::createResponse("admin/team/edit.html.twig", [
            "parent_team_ids" => $parent_team_ids,
            "manager_user_ids" => $manager_user_ids,
            "team" => $team
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_team_delete"
     * }
     */
    public function delete($id)
    {
        $team = $this->team_repository->find($id);
        EntityManager::remove($team);

        Router::redirectTo("admin_team");
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