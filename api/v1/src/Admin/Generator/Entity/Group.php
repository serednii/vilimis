<?php

namespace Admin\Generator\Entity;

/**
 * @ORM\Table generator_group
 * @ORM\Translation
 * @Serializable
 */
class Group
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
     * @ORM\Translatable
     */
    private $name = "";

    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column slug
     */
    private $slug = "";

    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column type
     */
    private $type = "";

    /**
     * @var int
     *
     * @ORM\Type int
     * @ORM\Column column
     */
    private $column = 1;

    /**
     * @var int
     *
     * @ORM\Type int
     * @ORM\Column sort
     */
    private $sort = 0;

    /**
     * @var int
     *
     * @ORM\Type int
     * @ORM\Column module_id
     */
    private $module_id = "";

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
    public function getSlug(): string
    {
        return $this->slug;
    }

    /**
     * @return string
     */
    public function getSlugInCamel(): string
    {
        return str_replace("_", "", ucwords($this->getSlug(), "_"));
    }

    /**
     * @return string
     */
    public function getSlugPlural(): string
    {
        return $this->getSlug()."s";
    }

    /**
     * @param string $slug
     */
    public function setSlug(string $slug)
    {
        $this->slug = $slug;
    }

    /**
     * @return int
     */
    public function getModuleId(): int
    {
        return $this->module_id;
    }

    /**
     * @param int $module_id
     */
    public function setModuleId(int $module_id)
    {
        $this->module_id = $module_id;
    }

    public function getColumn(): int
    {
        return $this->column;
    }

    public function setColumn(int $column): void
    {
        $this->column = $column;
    }

    public function getSort(): int
    {
        return $this->sort;
    }

    public function setSort(int $sort): void
    {
        $this->sort = $sort;
    }

}