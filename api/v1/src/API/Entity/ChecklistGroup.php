<?php

namespace API\Entity;


/**
 * @ORM\Table checklistgroup
 * @Serializable
 */
class ChecklistGroup
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
     * @var bool
     *
     * @ORM\Type INT(9)
     * @ORM\Column priority
     */
    private $priority = false;
    
    /**
     * @var bool
     *
     * @ORM\Type TINYINT(1)
     * @ORM\Column done
     */
    private $done = false;
    
    /**
     * @var ?int
     *
     * @ORM\Type INT(6) UNSIGNED
     * @ORM\Column checklist_id
     */
    private $checklist_id = null;


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
     * @return bool
     */
    public function isDone(): bool
    {
        return $this->done;
    }

    /**
     * @param bool $done
     */
    public function setDone(bool $done)
    {
        $this->done = $done;
    }

    /**
     * @return ?int
     */
    public function getChecklistId(): ?int
    {
        return $this->checklist_id;
    }

    /**
     * @param ?int $checklist_id
     */
    public function setChecklistId(?int $checklist_id)
    {
        $this->checklist_id = $checklist_id;
    }

}