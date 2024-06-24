<?php

namespace Admin\Security\Provider;

use API\Entity\User;
use API\Repository\UserRepository;
use Gephart\Framework\Facade\Request;
use Gephart\ORM\EntityManager;
use Gephart\Security\Configuration\SecurityConfiguration;
use Gephart\Security\Entity\UserInterface;
use Gephart\Security\Provider\ProviderInterface;
use Gephart\Sessions\Sessions;

class DBProvider implements ProviderInterface
{

    /**
     * @var Sessions
     */
    private $sessions;

    /**
     * @var UserRepository
     */
    private $user_repository;

    /**
     * @var EntityManager
     */
    private $entity_manager;

    /**
     * @var SecurityConfiguration
     */
    private $security_configuration;

    public function __construct(
        Sessions $sessions,
        UserRepository $user_repository,
        EntityManager $entity_manager,
        SecurityConfiguration $security_configuration
    )
    {
        $this->sessions = $sessions;
        $this->user_repository = $user_repository;
        $this->entity_manager = $entity_manager;
        $this->security_configuration = $security_configuration;
    }

    /**
     * @param string $username
     * @param string $password
     * @throws \Exception
     */
    public function authorise(string $username, string $password)
    {
        $headers = Request::getHeaders();

        $securityProvider = $this->security_configuration->get("provider")["Admin\Security\Provider\DBProvider"];

        $users = $this->user_repository->findBy(["username = %1", $username]);

        if (empty($users) || empty($users[0])) {
            throw new \Exception("Uživatel '$username' nebyl nalezen.");
        }

        /** @var User $user */
        $user = $users[0];

        if (!empty($provider["salt"])) {
            $password .= $securityProvider["salt"];
        }
        if (!password_verify($password, $user->getPassword())) {
            throw new \Exception("Heslo není správné.");
        }


        $this->setUser($user);

        return true;
    }

    public function refresh(UserInterface $user)
    {
        $this->setUser($user);
    }

    /**
     * Remove user from session
     */
    public function unauthorise()
    {
        setcookie('gephartis_permlogin_hash', "", time()-3600, "/");
        $this->sessions->set("user", false);
    }

    /**
     * Get user from session
     *
     * @return bool|UserInterface
     */
    public function getUser()
    {
        if ($this->sessions->get("user")) {
            return $this->sessions->get("user");
        }

        if (isset($_COOKIE["gephartis_permlogin_hash"])) {
            $permlogin_hash = $_COOKIE["gephartis_permlogin_hash"];
            $users = $this->user_repository->findBy(["perm_login_hash = %1", $permlogin_hash]);

            if (is_array($users) && count($users) == 1) {
                $user = $users[0];
                $this->setUser($user);
                return $user;
            }
        }

        return false;
    }

    /**
     * Add user to session
     *
     * @param UserInterface $user
     */
    private function setUser(UserInterface $user)
    {
        $permlogin_hash = md5(microtime() . rand(1,1000) . $user->getUsername());
        $user->setPermloginHash($permlogin_hash);
        $this->entity_manager->save($user);

        setcookie('gephartis_permlogin_hash', $permlogin_hash, time()+(3600*24*7), "/");
        $this->sessions->set("user", $user);
    }

    public function getUserFromExternal(UserInterface $user)
    {
        $this->setUser($user);
    }

}