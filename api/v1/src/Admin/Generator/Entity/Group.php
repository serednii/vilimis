<?php

namespace Admin\Generator\Entity;

/**
 * @ORM\Table generator_item
 * @ORM\Translation
 * @Serializable
 */
class Item
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
     * @var bool
     *
     * @ORM\Type TINYINT(1)
     * @ORM\Column required
     */
    private $required = "";

    /**
     * @var bool
     *
     * @ORM\Type TINYINT(1)
     * @ORM\Column table_show
     */
    private $table_show = "";

    /**
     * @var bool
     *
     * @ORM\Type TINYINT(1)
     * @ORM\Column readonly_in_ui
     */
    private $readonlyInUi = 0;

    /**
     * @var bool
     *
     * @ORM\Type TINYINT(1)
     * @ORM\Column hide_from_ui
     */
    private $hideFromUi = 0;

    /**
     * @var bool
     *
     * @ORM\Type TINYINT(1)
     * @ORM\Column unique
     */
    private $unique = 0;

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
     * @ORM\Column group_id
     */
    private $groupId= 1;

    /**
     * @var int
     *
     * @ORM\Type int
     * @ORM\Column sort
     */
    private $sort = 0;

    /**
     * @var string
     *
     * @ORM\Type TEXT
     * @ORM\Column options
     */
    private $options = "";

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
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType(string $type)
    {
        $this->type = $type;
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

    public function isRelation()
    {
        $repository = __DIR__ . "/../../../API/Repository/" . $this->getType() . "Repository.php";
        return file_exists($repository);
    }

    /**
     * @return bool
     */
    public function isRequired(): bool
    {
        return $this->required;
    }

    /**
     * @param bool $required
     */
    public function setRequired(bool $required)
    {
        $this->required = $required;
    }

    /**
     * @return bool
     */
    public function isTableShow(): bool
    {
        return $this->table_show;
    }

    /**
     * @param bool $table_show
     */
    public function setTableShow(bool $table_show)
    {
        $this->table_show = $table_show;
    }

    public function getReadonlyInUi(): bool|int
    {
        return $this->readonlyInUi;
    }

    public function setReadonlyInUi(bool|int $readonlyInUi): void
    {
        $this->readonlyInUi = $readonlyInUi;
    }

    public function getHideFromUi(): bool|int
    {
        return $this->hideFromUi;
    }

    public function setHideFromUi(bool|int $hideFromUi): void
    {
        $this->hideFromUi = $hideFromUi;
    }

    public function getUnique(): bool|int
    {
        return $this->unique;
    }

    public function setUnique(bool|int $unique): void
    {
        $this->unique = $unique;
    }

    public function getColumn(): int
    {
        return $this->column;
    }

    public function setColumn(int $column): void
    {
        $this->column = $column;
    }

    public function getGroupId(): int
    {
        return $this->groupId;
    }

    public function setGroupId(int $groupId): void
    {
        $this->groupId = $groupId;
    }

    public function getSort(): int
    {
        return $this->sort;
    }

    public function setSort(int $sort): void
    {
        $this->sort = $sort;
    }

    public function getOptions(): string
    {
        return $this->options;
    }

    public function setOptions(string $options): void
    {
        $this->options = $options;
    }

}