<?php

namespace API\Entity;

use Gephart\Security\Entity\UserInterface;

/**
 * @ORM\Table user
 * @Serializable
 */
class User implements UserInterface
{

    /**
     * @var int
     *
     * @ORM\Id
     */
    private $id = 0;

    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column username
     */
    private $username = "";
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column password
     */
    private $password = "";
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column name
     */
    private $name = "";
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column surname
     */
    private $surname = "";
    
    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column team_id
     */
    private $team_id = null;

    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column position
     */
    private $position = "";
    
    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column parent_user_id
     */
    private $parent_user_id = null;

    /**
     * @var \DateTime|null
     *
     * @ORM\Type DATETIME
     * @ORM\Column created
     */
    private $created = null;
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column avatar
     */
    private $avatar = "";
    
    /**
     * @var string
     *
     * @ORM\Type TEXT
     * @ORM\Column roles
     */
    private $roles = "";
    
    /**
     * @var string
     *
     * @ORM\Type TEXT
     * @ORM\Column rights
     */
    private $rights = "";
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column phone
     */
    private $phone = "";
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column perm_login_hash
     */
    private $perm_login_hash = "";
    

    public function __construct()
    {
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * @param string $username
     */
    public function setUsername(string $username)
    {
        $this->username = $username;
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @param string $password
     */
    public function setPassword(string $password)
    {
        $this->password = $password;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getSurname(): string
    {
        return $this->surname;
    }

    /**
     * @param string $surname
     */
    public function setSurname(string $surname)
    {
        $this->surname = $surname;
    }

    /**
     * @return ?int
     */
    public function getTeamId(): ?int
    {
        return $this->team_id;
    }

    /**
     * @param ?int $team_id
     */
    public function setTeamId(?int $team_id)
    {
        $this->team_id = $team_id;
    }

    /**
     * @return string
     */
    public function getPosition(): string
    {
        return $this->position;
    }

    /**
     * @param string $position
     */
    public function setPosition(string $position)
    {
        $this->position = $position;
    }

    /**
     * @return ?int
     */
    public function getParentUserId(): ?int
    {
        return $this->parent_user_id;
    }

    /**
     * @param ?int $parent_user_id
     */
    public function setParentUserId(?int $parent_user_id)
    {
        $this->parent_user_id = $parent_user_id;
    }

    /**
     * @return \DateTime|null
     */
    public function getCreated(): ?\DateTime
    {
        return $this->created;
    }

    /**
     * @param \DateTime|null $created
     */
    public function setCreated(?\DateTime $created)
    {
        $this->created = $created;
    }

    /**
     * @return string
     */
    public function getAvatar(): string
    {
        return $this->avatar;
    }

    /**
     * @param string $avatar
     */
    public function setAvatar(string $avatar)
    {
        $this->avatar = $avatar;
    }

    /**
     * @return array|null
     */
    public function getRoles(): ?array
    {
        try {
            return json_decode($this->roles);
        } catch (\Exception $exception) {
            return [];
        } 
    }

    /**
     * @param array|string|null $roles
     */
    public function setRoles(array|string|null $roles)
    {
        if (is_array($roles)) {
            $roles = json_encode($roles);
        }
        $this->roles = $roles;
    }

    /**
     * @return array|null
     */
    public function getRights(): ?array
    {
        try {
            return json_decode($this->rights);
        } catch (\Exception $exception) {
            return [];
        } 
    }

    /**
     * @param array|string|null $rights
     */
    public function setRights(array|string|null $rights)
    {
        if (is_array($rights)) {
            $rights = json_encode($rights);
        }
        $this->rights = $rights;
    }

    /**
     * @return string
     */
    public function getPhone(): string
    {
        return $this->phone;
    }

    /**
     * @param string $phone
     */
    public function setPhone(string $phone)
    {
        $this->phone = $phone;
    }

    /**
     * @return string
     */
    public function getPermLoginHash(): string
    {
        return $this->perm_login_hash;
    }

    /**
     * @param string $perm_login_hash
     */
    public function setPermLoginHash(string $perm_login_hash)
    {
        $this->perm_login_hash = $perm_login_hash;
    }

}