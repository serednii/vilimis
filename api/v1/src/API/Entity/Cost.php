<?php

namespace API\Entity;


/**
 * @ORM\Table cost
 * @Serializable
 */
class Cost
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
     * @ORM\Column cost_category_id
     */
    private $cost_category_id = null;

    /**
     * @var float
     *
     * @ORM\Type DOUBLE(20,5)
     * @ORM\Column amount
     */
    private $amount = false;
    
    /**
     * @var \DateTime|null
     *
     * @ORM\Type DATE
     * @ORM\Column day_of_accounting
     */
    private $day_of_accounting = null;
    
    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column cost_repeatable_id
     */
    private $cost_repeatable_id = null;


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
    public function getCostCategoryId(): ?int
    {
        return $this->cost_category_id;
    }

    /**
     * @param ?int $cost_category_id
     */
    public function setCostCategoryId(?int $cost_category_id)
    {
        $this->cost_category_id = $cost_category_id;
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
     * @return \DateTime|null
     */
    public function getDayOfAccounting(): ?\DateTime
    {
        return $this->day_of_accounting;
    }

    /**
     * @param \DateTime|null $day_of_accounting
     */
    public function setDayOfAccounting(?\DateTime $day_of_accounting)
    {
        $this->day_of_accounting = $day_of_accounting;
    }

    /**
     * @return ?int
     */
    public function getCostRepeatableId(): ?int
    {
        return $this->cost_repeatable_id;
    }

    /**
     * @param ?int $cost_repeatable_id
     */
    public function setCostRepeatableId(?int $cost_repeatable_id)
    {
        $this->cost_repeatable_id = $cost_repeatable_id;
    }

}