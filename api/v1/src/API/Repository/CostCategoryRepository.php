<?php

namespace API\Repository;

use API\Entity\CostCategory;
use Gephart\ORM\EntityManager;

class CostCategoryRepository
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
        $this->entity_class = CostCategory::class;
        $this->entity_manager = $entity_manager;
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