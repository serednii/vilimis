<?php

namespace API\Controller;

use API\Entity\InvoiceItem;
use API\Entity\InvoiceItemStatus;
use API\Repository\InvoiceItemRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /invoiceItems
 */
class InvoiceItemsController extends AbstractApiController
{
    const EVENT_SAVE = InvoiceItemController::EVENT_SAVE;

    /**
     * @var InvoiceItemRepository
     */
    private $invoiceItem_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;
    private EventManager $eventManager;

    public function __construct(
        InvoiceItemRepository $invoiceItem_repository,
        JsonResponseFactory   $jsonResponseFactory,
        JsonSerializator      $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->invoiceItem_repository = $invoiceItem_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "invoiceItemsPriority_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["invoice_id"]) && !empty($postData["invoice_items"]) && is_array($postData["invoice_items"])) {
            $invoiceItems = $this->invoiceItem_repository->findBy(["invoice_id = %1", $postData["invoice_id"]]);
            /** @var InvoiceItem $invoiceItem */
            foreach ($invoiceItems as $invoiceItem) {
                if (!in_array($invoiceItem->getId(), $postData["invoice_items"]["id"])) {
                    EntityManager::remove($invoiceItem);
                }
            }

            foreach ($postData["invoice_items"]["id"] as $key => $id) {
                $invoiceItem = null;
                if ($id) {
                    /** @var InvoiceItem $invoiceItem */
                    $invoiceItem = $this->invoiceItem_repository->find($id);
                }

                if (!$invoiceItem) {
                    $invoiceItem = new InvoiceItem();
                    $invoiceItem->setInvoiceId($postData["invoice_id"]);
                }

                $invoiceItem->setCode($postData["invoice_items"]["code"][$key]);
                $invoiceItem->setItem($postData["invoice_items"]["item"][$key]);
                $invoiceItem->setVat($postData["invoice_items"]["vat"][$key]);
                $invoiceItem->setQuantity($postData["invoice_items"]["quantity"][$key]);
                $invoiceItem->setUnit($postData["invoice_items"]["unit"][$key]);
                $invoiceItem->setPriceWithoutVat($postData["invoice_items"]["price_without_vat"][$key]);

                EntityManager::save($invoiceItem);
            }

            if ($invoiceItem) {
                $this->triggerSave($invoiceItem);
            }

            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Uloženo",
                "code" => 200
            ]));
        }


        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Chybí data",
            "code" => 500
        ]));
    }



    private function triggerSave(InvoiceItem $invoiceItem): InvoiceItem
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "invoiceItem" => $invoiceItem
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("invoiceItem");
    }

}