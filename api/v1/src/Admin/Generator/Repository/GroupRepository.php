<?php

namespace Admin\Generator\Repository;

use Admin\Generator\Entity\Group;
use Gephart\ORM\EntityManager;

class GroupRepository
{

    /**
     * @var EntityManager
     */
    private $entity_manager;

    /**
     * @var string
     */
    private $entity_class;

    public function __construct(EntityManager $entity_manager)
    {
        $this->entity_class = Group::class;
        $this->entity_manager = $entity_manager;

        try {
            $this->entity_manager->syncTable($this->entity_class);
        } catch (\Exception $e) {
        }
    }

    public function findBy(array $find_by = [], array $params = [])
    {
        return $this->entity_manager->findBy($this->entity_class, $find_by, $params);
    }

    public function find(int $id)
    {
        $result = $this->findBy(["id = %1", $id]);

        if (is_array($result) && !empty($result[0])) {
            return $result[0];
        }

        return null;
    }
}
