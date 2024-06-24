<?php

namespace API\Security\Provider;

use App\Entity\User;
use App\Repository\UserRepository;
use Gephart\ORM\EntityManager;
use Gephart\Security\Entity\UserInterface;
use Gephart\Security\Provider\ProviderInterface;
use Gephart\Sessions\Sessions;

class APIProvider implements ProviderInterface
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
     * @param Sessions $sessions
     * @param UserRepository $user_repository
     */
    public function __construct(
        Sessions $sessions,
        UserRepository $user_repository,
        EntityManager $entity_manager
    )
    {
        $this->sessions = $sessions;
        $this->user_repository = $user_repository;
        $this->entity_manager = $entity_manager;
    }

    /**
     * @param string $username
     * @param string $password
     * @throws \Exception
     */
    public function authorise(string $username, string $password)
    {
        $users = $this->user_repository->findByMapByEmail();


        $url = "https://www.profifp.cz/api/login";

        $data = [
            "username" => $username,
            "password" => $password
        ];

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($curl);
        $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($httpcode == 403) {
            throw new \Exception("Uživatelské jméno nebo heslo je špatně zadané.");
        } elseif ($httpcode != 200) {
            throw new \Exception("Problém při komunikaci s API");
        }

        $data = json_decode($response, true);

        if (empty($data["name"]) || empty($data["email"])) {
            throw new \Exception("API nevrátilo email nebo uživatelské jméno");
        }

        if (empty($users[$data["email"]])) {
            $user = new User();
        } else {
            $user = $users[$data["email"]];
        }


        if (!empty($data["parent"]) && !empty($data["parent"]["email"])) {
            if (isset($users[$data["parent"]["email"]])) {
                $user->setNadrizeny($users[$data["parent"]["email"]]->getId());
            }
        }

        $user->setName($data["name"] . " ". $data["lastname"]);
        $user->setEmail($data["email"]);
        $user->setPhone($data["phone"]);
        $user->setChangedPassword(true);

        $this->entity_manager->save($user);

        $this->setUser($user);
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
        setcookie('nexis_permlogin_hash', "", time()-3600, "/");
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

        if (isset($_COOKIE["nexis_permlogin_hash"])) {
            $permlogin_hash = $_COOKIE["nexis_permlogin_hash"];
            $users = $this->user_repository->findBy(["permlogin_hash = %1", $permlogin_hash]);

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

        setcookie('nexis_permlogin_hash', $permlogin_hash, time()+(3600*24*7), "/");
        $this->sessions->set("user", $user);
    }

}