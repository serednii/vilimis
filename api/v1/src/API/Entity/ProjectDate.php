<?php

namespace API\Entity;

/**
 * @ORM\Table projectDate
 * @Serializable
 */
class ProjectDate
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
     * @var \DateTime|null
     *
     * @ORM\Type DATE
     * @ORM\Column date
     */
    private $date = null;
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column color
     */
    private $color = "";
    
    /**
     * @var bool
     *
     * @ORM\Type INT(9)
     * @ORM\Column priority
     */
    private $priority = false;
    
    /**
     * @var bool
     *
     * @ORM\Type TINYINT(1)
     * @ORM\Column done
     */
    private $done = false;
    
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
        $this->date = new \DateTime();
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
     * @return \DateTime|null
     */
    public function getDate(): ?\DateTime
    {
        return $this->date;
    }

    /**
     * @param \DateTime|null $date
     */
    public function setDate(?\DateTime $date)
    {
        $this->date = $date;
    }

    /**
     * @return string
     */
    public function getColor(): string
    {
        return $this->color;
    }

    /**
     * @param string $color
     */
    public function setColor(string $color)
    {
        $this->color = $color;
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
     * @return bool
     */
    public function isDone(): bool
    {
        return $this->done;
    }

    /**
     * @param bool $done
     */
    public function setDone(bool $done)
    {
        $this->done = $done;
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