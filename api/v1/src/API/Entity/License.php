<?php

namespace API\Entity;


/**
 * @ORM\Table license
 * @Serializable
 */
class License
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
     * @var \DateTime|null
     *
     * @ORM\Type DATE
     * @ORM\Column date_from
     */
    private $date_from = null;
    
    /**
     * @var \DateTime|null
     *
     * @ORM\Type DATE
     * @ORM\Column date_to
     */
    private $date_to = null;
    
    /**
     * @var float
     *
     * @ORM\Type DOUBLE(20,5)
     * @ORM\Column amount
     */
    private $amount = false;
    
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
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column before_license_id
     */
    private $before_license_id = null;

    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column after_license_id
     */
    private $after_license_id = null;

    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column cost_id
     */
    private $cost_id = null;


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
     * @return \DateTime|null
     */
    public function getDateFrom(): ?\DateTime
    {
        return $this->date_from;
    }

    /**
     * @param \DateTime|null $date_from
     */
    public function setDateFrom(?\DateTime $date_from)
    {
        $this->date_from = $date_from;
    }

    /**
     * @return \DateTime|null
     */
    public function getDateTo(): ?\DateTime
    {
        return $this->date_to;
    }

    /**
     * @param \DateTime|null $date_to
     */
    public function setDateTo(?\DateTime $date_to)
    {
        $this->date_to = $date_to;
    }

    /**
     * @return float
     */
    public function getAmount(): float
    {
        return $this->amount;
    }

    /**
     * @param float $amount
     */
    public function setAmount(float $amount)
    {
        $this->amount = $amount;
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
     * @return ?int
     */
    public function getBeforeLicenseId(): ?int
    {
        return $this->before_license_id;
    }

    /**
     * @param ?int $before_license_id
     */
    public function setBeforeLicenseId(?int $before_license_id)
    {
        $this->before_license_id = $before_license_id;
    }

    /**
     * @return ?int
     */
    public function getAfterLicenseId(): ?int
    {
        return $this->after_license_id;
    }

    /**
     * @param ?int $after_license_id
     */
    public function setAfterLicenseId(?int $after_license_id)
    {
        $this->after_license_id = $after_license_id;
    }

    /**
     * @return ?int
     */
    public function getCostId(): ?int
    {
        return $this->cost_id;
    }

    /**
     * @param ?int $cost_id
     */
    public function setCostId(?int $cost_id)
    {
        $this->cost_id = $cost_id;
    }

}