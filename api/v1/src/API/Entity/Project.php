<?php

namespace API\Entity;


/**
 * @ORM\Table project
 * @Serializable
 */
class Project
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
     * @ORM\Column budget
     */
    private $budget = false;
    
    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column client_id
     */
    private $client_id = null;

    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column end_customer_id
     */
    private $end_customer_id = null;

    /**
     * @var bool
     *
     * @ORM\Type INT(9)
     * @ORM\Column hour_rate
     */
    private $hour_rate = false;
    
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
     * @ORM\Column project_status_id
     */
    private $project_status_id = null;

    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column web_id
     */
    private $web_id = null;

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
    
    /**
     * @var bool
     *
     * @ORM\Type INT(9)
     * @ORM\Column spending_time
     */
    private $spending_time = false;
    
    /**
     * @var \DateTime|null
     *
     * @ORM\Type DATE
     * @ORM\Column planned_from
     */
    private $planned_from = null;
    
    /**
     * @var \DateTime|null
     *
     * @ORM\Type DATE
     * @ORM\Column planned_to
     */
    private $planned_to = null;
    

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
    public function getBudget(): int
    {
        return $this->budget;
    }

    /**
     * @param int $budget
     */
    public function setBudget(int $budget)
    {
        $this->budget = $budget;
    }

    /**
     * @return ?int
     */
    public function getClientId(): ?int
    {
        return $this->client_id;
    }

    /**
     * @param ?int $client_id
     */
    public function setClientId(?int $client_id)
    {
        $this->client_id = $client_id;
    }

    /**
     * @return ?int
     */
    public function getEndCustomerId(): ?int
    {
        return $this->end_customer_id;
    }

    /**
     * @param ?int $end_customer_id
     */
    public function setEndCustomerId(?int $end_customer_id)
    {
        $this->end_customer_id = $end_customer_id;
    }

    /**
     * @return int
     */
    public function getHourRate(): int
    {
        return $this->hour_rate;
    }

    /**
     * @param int $hour_rate
     */
    public function setHourRate(int $hour_rate)
    {
        $this->hour_rate = $hour_rate;
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
    public function getProjectStatusId(): ?int
    {
        return $this->project_status_id;
    }

    /**
     * @param ?int $project_status_id
     */
    public function setProjectStatusId(?int $project_status_id)
    {
        $this->project_status_id = $project_status_id;
    }

    /**
     * @return ?int
     */
    public function getWebId(): ?int
    {
        return $this->web_id;
    }

    /**
     * @param ?int $web_id
     */
    public function setWebId(?int $web_id)
    {
        $this->web_id = $web_id;
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

    /**
     * @return int
     */
    public function getSpendingTime(): int
    {
        return $this->spending_time;
    }

    /**
     * @param int $spending_time
     */
    public function setSpendingTime(int $spending_time)
    {
        $this->spending_time = $spending_time;
    }

    /**
     * @return \DateTime|null
     */
    public function getPlannedFrom(): ?\DateTime
    {
        return $this->planned_from;
    }

    /**
     * @param \DateTime|null $planned_from
     */
    public function setPlannedFrom(?\DateTime $planned_from)
    {
        $this->planned_from = $planned_from;
    }

    /**
     * @return \DateTime|null
     */
    public function getPlannedTo(): ?\DateTime
    {
        return $this->planned_to;
    }

    /**
     * @param \DateTime|null $planned_to
     */
    public function setPlannedTo(?\DateTime $planned_to)
    {
        $this->planned_to = $planned_to;
    }

}