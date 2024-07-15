<?php

namespace API\Entity;


/**
 * @ORM\Table sessionendcustomercontact
 * @Serializable
 */
class SessionEndCustomerContact
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
     * @ORM\Column session_id
     */
    private $session_id = null;

    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column end_customer_contact_id
     */
    private $end_customer_contact_id = null;


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
    public function getSessionId(): ?int
    {
        return $this->session_id;
    }

    /**
     * @param ?int $session_id
     */
    public function setSessionId(?int $session_id)
    {
        $this->session_id = $session_id;
    }

    /**
     * @return ?int
     */
    public function getEndCustomerContactId(): ?int
    {
        return $this->end_customer_contact_id;
    }

    /**
     * @param ?int $end_customer_contact_id
     */
    public function setEndCustomerContactId(?int $end_customer_contact_id)
    {
        $this->end_customer_contact_id = $end_customer_contact_id;
    }

}