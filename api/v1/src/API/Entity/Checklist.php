<?php

namespace API\Entity;


/**
 * @ORM\Table checklist
 * @Serializable
 */
class Checklist
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
     * @var string
     *
     * @ORM\Type LONGTEXT
     * @ORM\Column description
     */
    private $description = "";
    
    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column project_id
     */
    private $project_id = null;

    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column task_id
     */
    private $task_id = null;


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
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription(string $description)
    {
        $this->description = $description;
    }
    
    /**
     * @return ?int
     */
    public function getProjectId(): ?int
    {
        return $this->project_id;
    }

    /**
     * @param ?int $project_id
     */
    public function setProjectId(?int $project_id)
    {
        $this->project_id = $project_id;
    }

    /**
     * @return ?int
     */
    public function getTaskId(): ?int
    {
        return $this->task_id;
    }

    /**
     * @param ?int $task_id
     */
    public function setTaskId(?int $task_id)
    {
        $this->task_id = $task_id;
    }

}