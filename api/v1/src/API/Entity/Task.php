<?php

namespace API\Entity;

/**
 * @ORM\Table task
 * @Serializable
 */
class Task
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
     * @var bool
     *
     * @ORM\Type INT(9)
     * @ORM\Column hour_budget
     */
    private $hour_budget = false;
    
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
     * @ORM\Column task_status_id
     */
    private $task_status_id = null;

    /**
     * @var string
     *
     * @ORM\Type TEXT
     * @ORM\Column description
     */
    private $description = "";
    
    /**
     * @var \DateTime|null
     *
     * @ORM\Type DATETIME
     * @ORM\Column dead_line_date
     */
    private $dead_line_date = null;
    
    /**
     * @var bool
     *
     * @ORM\Type TINYINT(1)
     * @ORM\Column closed
     */
    private $closed = false;
    
    /**
     * @var bool
     *
     * @ORM\Type TINYINT(1)
     * @ORM\Column archived
     */
    private $archived = false;
    
    /**
     * @var bool
     *
     * @ORM\Type INT(9)
     * @ORM\Column priority
     */
    private $priority = false;
    

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
     * @return int
     */
    public function getHourBudget(): int
    {
        return $this->hour_budget;
    }

    /**
     * @param int $hour_budget
     */
    public function setHourBudget(int $hour_budget)
    {
        $this->hour_budget = $hour_budget;
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
    public function getTaskStatusId(): ?int
    {
        return $this->task_status_id;
    }

    /**
     * @param ?int $task_status_id
     */
    public function setTaskStatusId(?int $task_status_id)
    {
        $this->task_status_id = $task_status_id;
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
     * @return \DateTime|null
     */
    public function getDeadLineDate(): ?\DateTime
    {
        return $this->dead_line_date;
    }

    /**
     * @param \DateTime|null $dead_line_date
     */
    public function setDeadLineDate(?\DateTime $dead_line_date)
    {
        $this->dead_line_date = $dead_line_date;
    }

    /**
     * @return bool
     */
    public function isClosed(): bool
    {
        return $this->closed;
    }

    /**
     * @param bool $closed
     */
    public function setClosed(bool $closed)
    {
        $this->closed = $closed;
    }

    /**
     * @return bool
     */
    public function isArchived(): bool
    {
        return $this->archived;
    }

    /**
     * @param bool $archived
     */
    public function setArchived(bool $archived)
    {
        $this->archived = $archived;
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

}