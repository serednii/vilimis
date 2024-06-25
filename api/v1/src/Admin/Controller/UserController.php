<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\User;
use API\Repository\UserRepository;
use API\Repository\TeamRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use Gephart\Security\Configuration\SecurityConfiguration;
/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/user
 */
class UserController
{
    /**
     * @var UserRepository
     */
    private $user_repository;

    /**
     * @var TeamRepository
     */
    private $team_id_repository;

    /**
     * @var UserRepository
     */
    private $parent_user_id_repository;

    /**
     * @var SecurityConfiguration
     */
    private $security_configuration;

    public function __construct(
        TeamRepository $team_id_repository,
        UserRepository $parent_user_id_repository,
        SecurityConfiguration $security_configuration,
        UserRepository $user_repository
    )
    {
        $this->team_id_repository = $team_id_repository;
        $this->parent_user_id_repository = $parent_user_id_repository;
        $this->security_configuration = $security_configuration;
        $this->user_repository = $user_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_user"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["username"])) {
            $user = new User();
            $this->mapEntityFromArray($user, $postData, $filesData);

            EntityManager::save($user);

            Router::redirectTo("admin_user");
        }

        $team_ids = $this->team_id_repository->findBy([],["ORDER BY" => "id"]);
        $parent_user_ids = $this->parent_user_id_repository->findBy([],["ORDER BY" => "id"]);
        $users = $this->user_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/user/index.html.twig", [
            "team_ids" => $team_ids,
            "parent_user_ids" => $parent_user_ids,
            "users" => $users
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_user_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["username"])) {
            $user = $this->user_repository->find($id);
            $this->mapEntityFromArray($user, $postData, $filesData);

            EntityManager::save($user);

            Router::redirectTo("admin_user_edit", ["id"=>$user->getId()]);
        }

        $team_ids = $this->team_id_repository->findBy([],["ORDER BY" => "id"]);
        $parent_user_ids = $this->parent_user_id_repository->findBy([],["ORDER BY" => "id"]);
        $user = $this->user_repository->find($id);

        return AdminResponse::createResponse("admin/user/edit.html.twig", [
            "team_ids" => $team_ids,
            "parent_user_ids" => $parent_user_ids,
            "user" => $user
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_user_delete"
     * }
     */
    public function delete($id)
    {
        $user = $this->user_repository->find($id);
        EntityManager::remove($user);

        Router::redirectTo("admin_user");
    }

    private function mapEntityFromArray(User $user, array $data, array $files) {
        $securityProvider = $this->security_configuration->get("provider")["Admin\Security\Provider\DBProvider"];
        $user->setUsername($data["username"]);
        if ($data["password"]) {
            $password = $data["password"];
            if (!empty($provider["salt"])) {
                $password .= $securityProvider["salt"];
            }
            $password_hash = password_hash($password, PASSWORD_BCRYPT, ["cost" => $securityProvider["cost"]]);
            $user->setPassword($password_hash);
        }
        $user->setName($data["name"]);
        $user->setSurname($data["surname"]);
        $user->setTeamId(!empty($data["team_id"]) ? (int) $data["team_id"] : null);
        $user->setPosition($data["position"]);
        $user->setParentUserId(!empty($data["parent_user_id"]) ? (int) $data["parent_user_id"] : null);
        $user->setCreated(!empty($data["created"]) ? new \DateTime($data["created"]) : null);
        if (!empty($files["avatar"]) && $files["avatar"] instanceof UploadedFileInterface) {
            $user->setAvatar($this->uploadFile($files["avatar"]));
        }
        if (isset($data["avatar_delete"])) {
            $user->setAvatar("");
        }
        $user->setRoles(explode(";", $data["roles"]));
        $user->setRights(explode(";", $data["rights"]));
        $user->setPhone($data["phone"]);
        $user->setPermLoginHash($data["perm_login_hash"]);
        $user->setActive((bool) isset($data["active"]) ? $data["active"] : false);
    }

    private function uploadFile(UploadedFileInterface $file): string
    {
        $client_filename = $file->getClientFilename();
        $filename = md5($client_filename.time()) . "." . substr($client_filename, -4);
        $dir1 = substr($filename, 0, 2);
        $dir2 = substr($filename, 2, 2);
        $upload_dir = __DIR__ . "/../../../web/upload";
        $target = $upload_dir . "/" . $dir1 . "/" . $dir2 . "/" . $filename;

        if (!is_dir($upload_dir . "/" . $dir1)) {
            @mkdir($upload_dir . "/" . $dir1);
            @chmod($upload_dir . "/" . $dir1, 0777);
        }

        if (!is_dir($upload_dir . "/" . $dir1 . "/" . $dir2)) {
            @mkdir($upload_dir . "/" . $dir1 . "/" . $dir2);
            @chmod($upload_dir . "/" . $dir1 . "/" . $dir2, 0777);
        }

        if ($file->moveTo($target)) {
            @chmod($target, 0777);
            return $dir1 . "/" . $dir2 . "/" . $filename;
        }

        return "";
    }

}