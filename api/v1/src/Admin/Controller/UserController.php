<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\User;
use API\Repository\UserRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

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


    public function __construct(
        UserRepository $user_repository
    )
    {
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

        if (!empty($postData["email"])) {
            $user = new User();
            $this->mapEntityFromArray($user, $postData, $filesData);

            EntityManager::save($user);

            Router::redirectTo("admin_user");
        }

        $users = $this->user_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/user/index.html.twig", [
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

        if (!empty($postData["email"])) {
            $user = $this->user_repository->find($id);
            $this->mapEntityFromArray($user, $postData, $filesData);

            EntityManager::save($user);

            Router::redirectTo("admin_user_edit", ["id"=>$user->getId()]);
        }

        $user = $this->user_repository->find($id);

        return AdminResponse::createResponse("admin/user/edit.html.twig", [
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
        $user->setEmail($data["email"]);
        $user->setName($data["name"]);
        $user->setSurname($data["surname"]);
        $user->setPassword($data["password"]);
    }

}