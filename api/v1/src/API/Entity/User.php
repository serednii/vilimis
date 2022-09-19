<?php

namespace API\Entity;

/**
 * @ORM\Table user
 * @ORM\Translation
 * @Serializable
 */
class User
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
     * @ORM\Column email
     * @ORM\Translatable
     */
    private $email = "";
    

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
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email)
    {
        $this->email = $email;
    }

}