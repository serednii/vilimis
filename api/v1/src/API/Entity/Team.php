<?php

namespace API\Entity;

/**
 * @ORM\Table team
 * @Serializable
 */
class Team
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
     * @ORM\Column name
     */
    private $name = "";
    
    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column parent_team_id
     */
    private $parent_team_id = null;

    /**
     * @var bool
     *
     * @ORM\Type INT(9)
     * @ORM\Column priority
     */
    private $priority = false;
    
    /**
     * @var string
     *
     * @ORM\Type TEXT
     * @ORM\Column default_roles
     */
    private $default_roles = "";
    
    /**
     * @var string
     *
     * @ORM\Type TEXT
     * @ORM\Column default_rights
     */
    private $default_rights = "";
    
    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column manager_user_id
     */
    private $manager_user_id = null;


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
     * @return ?int
     */
    public function getParentTeamId(): ?int
    {
        return $this->parent_team_id;
    }

    /**
     * @param ?int $parent_team_id
     */
    public function setParentTeamId(?int $parent_team_id)
    {
        $this->parent_team_id = $parent_team_id;
    }

    /**
     * @return int
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * @param int $priority
     */
    public function setPriority(int $priority)
    {
        $this->priority = $priority;
    }

    /**
     * @return string
     */
    public function getDefaultRoles(): string
    {
        return $this->default_roles;
    }

    /**
     * @param string $default_roles
     */
    public function setDefaultRoles(string $default_roles)
    {
        $this->default_roles = $default_roles;
    }
    
    /**
     * @return string
     */
    public function getDefaultRights(): string
    {
        return $this->default_rights;
    }

    /**
     * @param string $default_rights
     */
    public function setDefaultRights(string $default_rights)
    {
        $this->default_rights = $default_rights;
    }
    
    /**
     * @return ?int
     */
    public function getManagerUserId(): ?int
    {
        return $this->manager_user_id;
    }

    /**
     * @param ?int $manager_user_id
     */
    public function setManagerUserId(?int $manager_user_id)
    {
        $this->manager_user_id = $manager_user_id;
    }

}