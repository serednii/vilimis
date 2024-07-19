<?php

namespace API\Entity;


/**
 * @ORM\Table invoice
 * @Serializable
 */
class Invoice
{

    /**
     * @var int
     *
     * @ORM\Id
     */
    private $id = 0;

    /**
     * @var bool
     *
     * @ORM\Type INT(9)
     * @ORM\Column number
     */
    private $number = false;
    
    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column user_id
     */
    private $user_id = null;

    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column client_id
     */
    private $client_id = null;

    /**
     * @var \DateTime|null
     *
     * @ORM\Type DATE
     * @ORM\Column created_date
     */
    private $created_date = null;
    
    /**
     * @var \DateTime|null
     *
     * @ORM\Type DATE
     * @ORM\Column due_date
     */
    private $due_date = null;
    
    /**
     * @var \DateTime|null
     *
     * @ORM\Type DATE
     * @ORM\Column duty_date
     */
    private $duty_date = null;
    
    /**
     * @var bool
     *
     * @ORM\Type TINYINT(1)
     * @ORM\Column payed
     */
    private $payed = false;
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column form_of_payment
     */
    private $form_of_payment = "";
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column invoice_type
     */
    private $invoice_type = "";
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column variable_symbol
     */
    private $variable_symbol = "";
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column specific_symbol
     */
    private $specific_symbol = "";
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column constant_symbol
     */
    private $constant_symbol = "";
    
    /**
     * @var float
     *
     * @ORM\Type DOUBLE(20,5)
     * @ORM\Column amount
     */
    private $amount = false;
    

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
     * @return int
     */
    public function getNumber(): int
    {
        return $this->number;
    }

    /**
     * @param int $number
     */
    public function setNumber(int $number)
    {
        $this->number = $number;
    }

    /**
     * @return ?int
     */
    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    /**
     * @param ?int $user_id
     */
    public function setUserId(?int $user_id)
    {
        $this->user_id = $user_id;
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
     * @return \DateTime|null
     */
    public function getCreatedDate(): ?\DateTime
    {
        return $this->created_date;
    }

    /**
     * @param \DateTime|null $created_date
     */
    public function setCreatedDate(?\DateTime $created_date)
    {
        $this->created_date = $created_date;
    }

    /**
     * @return \DateTime|null
     */
    public function getDueDate(): ?\DateTime
    {
        return $this->due_date;
    }

    /**
     * @param \DateTime|null $due_date
     */
    public function setDueDate(?\DateTime $due_date)
    {
        $this->due_date = $due_date;
    }

    /**
     * @return \DateTime|null
     */
    public function getDutyDate(): ?\DateTime
    {
        return $this->duty_date;
    }

    /**
     * @param \DateTime|null $duty_date
     */
    public function setDutyDate(?\DateTime $duty_date)
    {
        $this->duty_date = $duty_date;
    }

    /**
     * @return bool
     */
    public function isPayed(): bool
    {
        return $this->payed;
    }

    /**
     * @param bool $payed
     */
    public function setPayed(bool $payed)
    {
        $this->payed = $payed;
    }

    /**
     * @return string
     */
    public function getFormOfPayment(): string
    {
        return $this->form_of_payment;
    }

    /**
     * @param string $form_of_payment
     */
    public function setFormOfPayment(string $form_of_payment)
    {
        $this->form_of_payment = $form_of_payment;
    }

    /**
     * @return string
     */
    public function getInvoiceType(): string
    {
        return $this->invoice_type;
    }

    /**
     * @param string $invoice_type
     */
    public function setInvoiceType(string $invoice_type)
    {
        $this->invoice_type = $invoice_type;
    }

    /**
     * @return string
     */
    public function getVariableSymbol(): string
    {
        return $this->variable_symbol;
    }

    /**
     * @param string $variable_symbol
     */
    public function setVariableSymbol(string $variable_symbol)
    {
        $this->variable_symbol = $variable_symbol;
    }

    /**
     * @return string
     */
    public function getSpecificSymbol(): string
    {
        return $this->specific_symbol;
    }

    /**
     * @param string $specific_symbol
     */
    public function setSpecificSymbol(string $specific_symbol)
    {
        $this->specific_symbol = $specific_symbol;
    }

    /**
     * @return string
     */
    public function getConstantSymbol(): string
    {
        return $this->constant_symbol;
    }

    /**
     * @param string $constant_symbol
     */
    public function setConstantSymbol(string $constant_symbol)
    {
        $this->constant_symbol = $constant_symbol;
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

}