<?php

namespace API\Entity;

/**
 * @ORM\Table taskTimetrack
 * @Serializable
 */
class TaskTimetrack
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
     * @ORM\Column task_id
     */
    private $task_id = null;

    /**
     * @var \DateTime
     *
     * @ORM\Type DATETIME
     * @ORM\Column datetime_start
     */
    private $datetime_start = "";
    
    /**
     * @var \DateTime
     *
     * @ORM\Type DATETIME
     * @ORM\Column datetime_stop
     */
    private $datetime_stop = "";
    

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
    public function getTaskId(): ?int
    {
        return $this->task_id;
    }

    /**
     * @param ?int $task_id
     */
    public function setTaskId(?int $task_id)
    {
        $this->task_id = $task_id;
    }

    /**
     * @return \DateTime
     */
    public function getDatetimeStart(): \DateTime
    {
        return $this->datetime_start;
    }

    /**
     * @param \DateTime $datetime_start
     */
    public function setDatetimeStart(\DateTime $datetime_start)
    {
        $this->datetime_start = $datetime_start;
    }

    /**
     * @return \DateTime
     */
    public function getDatetimeStop(): \DateTime
    {
        return $this->datetime_stop;
    }

    /**
     * @param \DateTime $datetime_stop
     */
    public function setDatetimeStop(\DateTime $datetime_stop)
    {
        $this->datetime_stop = $datetime_stop;
    }

}