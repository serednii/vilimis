<?php

namespace API\Workflow\Invoice;

use API\Controller\InvoiceItemController;
use API\Controller\TaskTimetrackController;
use API\Entity\Invoice;
use API\Entity\InvoiceItem;
use API\Repository\InvoiceRepository;
use API\Service\InvoiceCalculatorService;
use API\Service\TaskTimetrackCalculatorService;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\ORM\EntityManager;

class RecalculateAfterUpdateItemsInvoiceWorkflow
{
    /**
     * @var EventManager
     */
    private $eventManager;
    private InvoiceCalculatorService $invoiceCalculatorService;
    private EntityManager $entityManager;

    public function __construct(
        EventManager $eventManager,
        EntityManager $entityManager,
        InvoiceCalculatorService $invoiceCalculatorService
    ) {
        $this->eventManager = $eventManager;
        $this->invoiceCalculatorService = $invoiceCalculatorService;
        $this->entityManager = $entityManager;

        $eventManager->attach(InvoiceItemController::EVENT_SAVE, [$this, "afterSave"]);
    }

    public function afterSave(Event $event)
    {
        /** @var InvoiceItem $invoiceItem */
        $invoiceItem = $event->getParam("invoiceItem");

        if ($invoiceItem->getInvoiceId()) {
            /** @var Invoice $invoice */
            $invoice = $this->entityManager->getRepository(InvoiceRepository::class)->find($invoiceItem->getInvoiceId());

            if ($invoice) {
                $this->invoiceCalculatorService->recalculateAndSave($invoice);
            }
        }

        return $event;
    }
}