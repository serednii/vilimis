<?php

namespace API\Entity;


/**
 * @ORM\Table invoiceitem
 * @Serializable
 */
class InvoiceItem
{

    /**
     * @var int
     *
     * @ORM\Id
     */
    private $id = 0;

    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column invoice_id
     */
    private $invoice_id = null;

    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column code
     */
    private $code = "";
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column item
     */
    private $item = "";
    
    /**
     * @var float
     *
     * @ORM\Type DOUBLE(20,5)
     * @ORM\Column vat
     */
    private $vat = false;
    
    /**
     * @var float
     *
     * @ORM\Type DOUBLE(20,5)
     * @ORM\Column quantity
     */
    private $quantity = false;
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column unit
     */
    private $unit = "";
    
    /**
     * @var float
     *
     * @ORM\Type DOUBLE(20,5)
     * @ORM\Column price_without_vat
     */
    private $price_without_vat = false;
    

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
     * @return ?int
     */
    public function getInvoiceId(): ?int
    {
        return $this->invoice_id;
    }

    /**
     * @param ?int $invoice_id
     */
    public function setInvoiceId(?int $invoice_id)
    {
        $this->invoice_id = $invoice_id;
    }

    /**
     * @return string
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * @param string $code
     */
    public function setCode(string $code)
    {
        $this->code = $code;
    }

    /**
     * @return string
     */
    public function getItem(): string
    {
        return $this->item;
    }

    /**
     * @param string $item
     */
    public function setItem(string $item)
    {
        $this->item = $item;
    }

    /**
     * @return float
     */
    public function getVat(): float
    {
        return $this->vat;
    }

    /**
     * @param float $vat
     */
    public function setVat(float $vat)
    {
        $this->vat = $vat;
    }

    /**
     * @return float
     */
    public function getQuantity(): float
    {
        return $this->quantity;
    }

    /**
     * @param float $quantity
     */
    public function setQuantity(float $quantity)
    {
        $this->quantity = $quantity;
    }

    /**
     * @return string
     */
    public function getUnit(): string
    {
        return $this->unit;
    }

    /**
     * @param string $unit
     */
    public function setUnit(string $unit)
    {
        $this->unit = $unit;
    }

    /**
     * @return float
     */
    public function getPriceWithoutVat(): float
    {
        return $this->price_without_vat;
    }

    /**
     * @param float $price_without_vat
     */
    public function setPriceWithoutVat(float $price_without_vat)
    {
        $this->price_without_vat = $price_without_vat;
    }

}