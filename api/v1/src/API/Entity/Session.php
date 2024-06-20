<?php

namespace API\Entity;

/**
 * @ORM\Table session
 * @Serializable
 */
class Session
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
     * @var \DateTime|null
     *
     * @ORM\Type DATETIME
     * @ORM\Column datetime_of_session
     */
    private $datetime_of_session = null;
    
    /**
     * @var string
     *
     * @ORM\Type TEXT
     * @ORM\Column description
     */
    private $description = "";
    
    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column session_type_id
     */
    private $session_type_id = null;

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
     * @ORM\Column project_id
     */
    private $project_id = null;


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
     * @return \DateTime|null
     */
    public function getDatetimeOfSession(): ?\DateTime
    {
        return $this->datetime_of_session;
    }

    /**
     * @param \DateTime|null $datetime_of_session
     */
    public function setDatetimeOfSession(?\DateTime $datetime_of_session)
    {
        $this->datetime_of_session = $datetime_of_session;
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
    public function getSessionTypeId(): ?int
    {
        return $this->session_type_id;
    }

    /**
     * @param ?int $session_type_id
     */
    public function setSessionTypeId(?int $session_type_id)
    {
        $this->session_type_id = $session_type_id;
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

}