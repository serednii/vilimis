<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\InvoiceItem;
use API\Repository\InvoiceItemRepository;
use API\Repository\InvoiceRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/invoiceItem
 */
class InvoiceItemController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var InvoiceItemRepository
     */
    private $invoiceItem_repository;

    /**
     * @var InvoiceRepository
     */
    private $invoice_id_repository;


    public function __construct(
        InvoiceRepository $invoice_id_repository,
        EventManager $eventManager,
        InvoiceItemRepository $invoiceItem_repository
    )
    {
        $this->invoice_id_repository = $invoice_id_repository;
        $this->eventManager = $eventManager;
        $this->invoiceItem_repository = $invoiceItem_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_invoiceItem"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["invoice_id"])) {
            $invoiceItem = new InvoiceItem();
            $this->mapEntityFromArray($invoiceItem, $postData, $filesData);

            EntityManager::save($invoiceItem);

            Router::redirectTo("admin_invoiceItem");
        }

        $invoice_ids = $this->invoice_id_repository->findBy([],["ORDER BY" => "id"]);
        $invoiceItems = $this->invoiceItem_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/invoiceItem/index.html.twig", [
            "invoice_ids" => $invoice_ids,
            "invoiceItems" => $invoiceItems
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_invoiceItem_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["invoice_id"])) {
            $invoiceItem = $this->invoiceItem_repository->find($id);
            $this->mapEntityFromArray($invoiceItem, $postData, $filesData);

            EntityManager::save($invoiceItem);
            $invoiceItem = $this->triggerSave($invoiceItem);

            Router::redirectTo("admin_invoiceItem_edit", ["id"=>$invoiceItem->getId()]);
        }

        $invoice_ids = $this->invoice_id_repository->findBy([],["ORDER BY" => "id"]);
        $invoiceItem = $this->invoiceItem_repository->find($id);

        return AdminResponse::createResponse("admin/invoiceItem/edit.html.twig", [
            "invoice_ids" => $invoice_ids,
            "invoiceItem" => $invoiceItem
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_invoiceItem_delete"
     * }
     */
    public function delete($id)
    {
        $invoiceItem = $this->invoiceItem_repository->find($id);
        EntityManager::remove($invoiceItem);

        Router::redirectTo("admin_invoiceItem");
    }

    private function mapEntityFromArray(InvoiceItem $invoiceItem, array $data, array $files) {
        $invoiceItem->setInvoiceId(!empty($data["invoice_id"]) ? (int) $data["invoice_id"] : null);
        $invoiceItem->setCode($data["code"]);
        $invoiceItem->setItem($data["item"]);
        $invoiceItem->setVat(isset($data["vat"]) ? (float) $data["vat"] : 0);
        $invoiceItem->setQuantity(isset($data["quantity"]) ? (float) $data["quantity"] : 0);
        $invoiceItem->setUnit($data["unit"]);
        $invoiceItem->setPriceWithoutVat(isset($data["price_without_vat"]) ? (float) $data["price_without_vat"] : 0);
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