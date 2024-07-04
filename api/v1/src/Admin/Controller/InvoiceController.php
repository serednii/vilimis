<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Invoice;
use API\Repository\InvoiceRepository;
use API\Repository\UserRepository;
use API\Repository\ClientRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/invoice
 */
class InvoiceController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var InvoiceRepository
     */
    private $invoice_repository;

    /**
     * @var UserRepository
     */
    private $user_id_repository;

    /**
     * @var ClientRepository
     */
    private $client_id_repository;


    public function __construct(
        UserRepository $user_id_repository,
        ClientRepository $client_id_repository,
        EventManager $eventManager,
        InvoiceRepository $invoice_repository
    )
    {
        $this->user_id_repository = $user_id_repository;
        $this->client_id_repository = $client_id_repository;
        $this->eventManager = $eventManager;
        $this->invoice_repository = $invoice_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_invoice"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["number"])) {
            $invoice = new Invoice();
            $this->mapEntityFromArray($invoice, $postData, $filesData);

            EntityManager::save($invoice);

            Router::redirectTo("admin_invoice");
        }

        $user_ids = $this->user_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $invoices = $this->invoice_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/invoice/index.html.twig", [
            "user_ids" => $user_ids,
            "client_ids" => $client_ids,
            "invoices" => $invoices
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_invoice_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["number"])) {
            $invoice = $this->invoice_repository->find($id);
            $this->mapEntityFromArray($invoice, $postData, $filesData);

            EntityManager::save($invoice);
            $invoice = $this->triggerSave($invoice);

            Router::redirectTo("admin_invoice_edit", ["id"=>$invoice->getId()]);
        }

        $user_ids = $this->user_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $invoice = $this->invoice_repository->find($id);

        return AdminResponse::createResponse("admin/invoice/edit.html.twig", [
            "user_ids" => $user_ids,
            "client_ids" => $client_ids,
            "invoice" => $invoice
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_invoice_delete"
     * }
     */
    public function delete($id)
    {
        $invoice = $this->invoice_repository->find($id);
        EntityManager::remove($invoice);

        Router::redirectTo("admin_invoice");
    }

    private function mapEntityFromArray(Invoice $invoice, array $data, array $files) {
        $invoice->setNumber(isset($data["number"]) ? (int) $data["number"] : 0);
        $invoice->setUserId(!empty($data["user_id"]) ? (int) $data["user_id"] : null);
        $invoice->setClientId(!empty($data["client_id"]) ? (int) $data["client_id"] : null);
        $invoice->setCreatedDate(!empty($data["created_date"]) ? new \DateTime($data["created_date"]) : null);
        $invoice->setDueDate(!empty($data["due_date"]) ? new \DateTime($data["due_date"]) : null);
        $invoice->setDutyDate(!empty($data["duty_date"]) ? new \DateTime($data["duty_date"]) : null);
        $invoice->setPayed((bool) isset($data["payed"]) ? $data["payed"] : false);
        $invoice->setFormOfPayment($data["form_of_payment"]);
        $invoice->setInvoiceType($data["invoice_type"]);
        $invoice->setVariableSymbol($data["variable_symbol"]);
        $invoice->setSpecificSymbol($data["specific_symbol"]);
        $invoice->setConstantSymbol($data["constant_symbol"]);
        $invoice->setAmount(isset($data["amount"]) ? (float) $data["amount"] : 0);
    }


    private function triggerSave(Invoice $invoice): Invoice
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "invoice" => $invoice
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("invoice");
    }
}