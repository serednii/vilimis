<?php

namespace API\Entity;


/**
 * @ORM\Table sessionclientcontact
 * @Serializable
 */
class SessionClientContact
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
     * @ORM\Column client_contact_id
     */
    private $client_contact_id = null;


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
    public function getClientContactId(): ?int
    {
        return $this->client_contact_id;
    }

    /**
     * @param ?int $client_contact_id
     */
    public function setClientContactId(?int $client_contact_id)
    {
        $this->client_contact_id = $client_contact_id;
    }

}