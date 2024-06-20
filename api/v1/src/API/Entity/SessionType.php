<?php

namespace API\Entity;

/**
 * @ORM\Table sessionType
 * @Serializable
 */
class SessionType
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
     * @ORM\Column priority
     */
    private $priority = false;
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column color
     */
    private $color = "";
    
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column ico
     */
    private $ico = "";
    

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
     * @return string
     */
    public function getIco(): string
    {
        return $this->ico;
    }

    /**
     * @param string $ico
     */
    public function setIco(string $ico)
    {
        $this->ico = $ico;
    }

}