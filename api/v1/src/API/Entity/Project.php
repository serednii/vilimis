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

}