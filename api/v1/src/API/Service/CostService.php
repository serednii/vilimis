<?php

namespace API\Service;

use API\Entity\Cost;
use API\Entity\CostRepeatable;
use API\Repository\CostRepository;
use Gephart\ORM\EntityManager;

final class CostService
{
    private EntityManager $entityManager;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function generateFromRepeatable(CostRepeatable $costRepeatable, $from = null)
    {
        if (!$from) {
            $from = date("Y-m-d", time()-28*24*60*60); // 28 dní zpětně defaultně

            if ($costRepeatable->getFirstDayOfAccounting()) { // Pokud je zadáno datum od, tak použít to
                $from = $costRepeatable->getFirstDayOfAccounting()->format("Y-m-d");
            }
        }

        $year = substr($from, 0, 4);

        $fromMonth = substr($from, 5, 2);
        $toMonth = date("m");

        if ($fromMonth > $toMonth) {
            throw new \Exception("Měsíc OD je větší mež měsíc DO");
        }

        $dayOfAccounting = $costRepeatable->getDayOfAccounting();
        if ($dayOfAccounting < 10) {
            $dayOfAccounting = "0" . $dayOfAccounting;
        }

        /** @var CostRepository $costRepository */
        $costRepository = $this->entityManager->getRepository(CostRepository::class);
        $count = 0;
        for ($month = $fromMonth; $month <= $toMonth; $month++) {
            if ($month < 10) {
                $month = "0" . (int)$month;
            }
            $dateOfAccounting = $year . "-" . $month . "-" . $dayOfAccounting;
            $existingCosts = $costRepository->findBy(["day_of_accounting = %1 AND cost_repeatable_id = %2", $dateOfAccounting, $costRepeatable->getId()]);
            if (count($existingCosts) > 0) {
                continue;
            }

            $cost = new Cost();
            $cost->setDayOfAccounting(new \DateTime($dateOfAccounting));
            $cost->setName($costRepeatable->getName());
            $cost->setDescription($costRepeatable->getDescription());
            $cost->setCostCategoryId($costRepeatable->getCostCategoryId());
            $cost->setCostRepeatableId($costRepeatable->getId());
            $cost->setAmount($costRepeatable->getAmount());

            $this->entityManager->save($cost);
            $count++;
        }

        return $count;
    }
}