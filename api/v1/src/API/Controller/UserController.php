<?php

namespace API\Controller;

use API\Entity\User;
use API\Repository\UserRepository;
use API\Repository\TeamRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;
use Gephart\Security\Configuration\SecurityConfiguration;
/**
 * @RoutePrefix /user
 */
class UserController extends AbstractApiController
{
    /**
     * @var UserRepository
     */
    private $user_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    /**
     * @var SecurityConfiguration
     */
    private $security_configuration;

    public function __construct(
        UserRepository $user_repository,
        SecurityConfiguration $security_configuration,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->user_repository = $user_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->security_configuration = $security_configuration;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "user_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $users = $this->user_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $users
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "user_single"
     * }
     */
    public function single($id)
    {
        $user = $this->user_repository->find($id);

        if (!$user) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $user
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "user_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["username"])) {

            if (!empty($postData["id"])) {
                $user = $this->user_repository->find($postData["id"]);


                if (!$user) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $user = new User();
            }
            $this->mapEntityFromArray($user, $postData, $filesData);

            EntityManager::save($user);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "user" => $user,
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
     *  "name": "user_delete"
     * }
     */
    public function delete($id)
    {
        $user = $this->user_repository->find($id);
        EntityManager::remove($user);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "user_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $users = $this->user_repository->findBy($filter);

        if (is_array($users) && count($users) > 0) {
            foreach ($users as $user) {
                EntityManager::remove($user);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
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