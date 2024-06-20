<?php

namespace API\Entity;

/**
 * @ORM\Table web
 * @Serializable
 */
class Web
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
     * @ORM\Type VARCHAR(255)
     * @ORM\Column url
     */
    private $url = "";
    
    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column parent_web_id
     */
    private $parent_web_id = null;

    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column accesses
     */
    private $accesses = "";
    
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
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column logo
     */
    private $logo = "";
    

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
    public function getUrl(): string
    {
        return $this->url;
    }

    /**
     * @param string $url
     */
    public function setUrl(string $url)
    {
        $this->url = $url;
    }

    /**
     * @return ?int
     */
    public function getParentWebId(): ?int
    {
        return $this->parent_web_id;
    }

    /**
     * @param ?int $parent_web_id
     */
    public function setParentWebId(?int $parent_web_id)
    {
        $this->parent_web_id = $parent_web_id;
    }

    /**
     * @return string
     */
    public function getAccesses(): string
    {
        return $this->accesses;
    }

    /**
     * @param string $accesses
     */
    public function setAccesses(string $accesses)
    {
        $this->accesses = $accesses;
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
     * @return string
     */
    public function getLogo(): string
    {
        return $this->logo;
    }

    /**
     * @param string $logo
     */
    public function setLogo(string $logo)
    {
        $this->logo = $logo;
    }

}