<?php

namespace API\Service;

use API\Entity\Invoice;
use API\Entity\InvoiceItem;
use API\Repository\InvoiceItemRepository;
use Gephart\ORM\EntityManager;

final class InvoiceCalculatorService
{
    private EntityManager $entityManager;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }


    public function recalculateAndSave(Invoice $invoice): void
    {
        /** @var InvoiceItem[] $invoiceItems */
        $invoiceItems = $this->entityManager->getRepository(InvoiceItemRepository::class)->findBy([
            "invoice_id = %1", $invoice->getId()
        ]);

        if (empty($invoiceItems)) {
            return;
        }

        $amount = 0;
        foreach($invoiceItems as $invoiceItem) {
            $amount += $invoiceItem->getQuantity() * $invoiceItem->getPriceWithoutVat();
        }

        $invoice->setAmount($amount);
        $this->entityManager->save($invoice);
    }
}