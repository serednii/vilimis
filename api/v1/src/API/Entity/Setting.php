<?php

namespace API\Entity;


/**
 * @ORM\Table setting
 * @Serializable
 */
class Setting
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
     * @ORM\Column key
     */
    private $key = "";
    
    /**
     * @var string
     *
     * @ORM\Type TEXT
     * @ORM\Column value
     */
    private $value = "";
    

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
    public function getKey(): string
    {
        return $this->key;
    }

    /**
     * @param string $key
     */
    public function setKey(string $key)
    {
        $this->key = $key;
    }

    /**
     * @return string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * @param string $value
     */
    public function setValue(string $value)
    {
        $this->value = $value;
    }
    
}