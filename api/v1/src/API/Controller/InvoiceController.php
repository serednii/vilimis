<?php

namespace API\Controller;

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
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /invoice
 * @Security ROLE_USER
 */
class InvoiceController extends AbstractApiController
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
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        InvoiceRepository $invoice_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        EventManager $eventManager
    )
    {
        $this->invoice_repository = $invoice_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "invoice_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $invoices = $this->invoice_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $invoices
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "invoice_single"
     * }
     */
    public function single($id)
    {
        $invoice = $this->invoice_repository->find($id);

        if (!$invoice) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $invoice
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "invoice_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["number"])) {

            if (!empty($postData["id"])) {
                $invoice = $this->invoice_repository->find($postData["id"]);


                if (!$invoice) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $invoice = new Invoice();
            }
            $this->mapEntityFromArray($invoice, $postData, $filesData);

            EntityManager::save($invoice);

            $invoice = $this->triggerSave($invoice);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "invoice" => $invoice,
                "message" => "Uloženo",
                "code" => 200
            ]));
        }


        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Chybí data",
            "code" => 500
        ]));
    }


    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "invoice_delete"
     * }
     */
    public function delete($id)
    {
        $invoice = $this->invoice_repository->find($id);
        EntityManager::remove($invoice);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "invoice_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $invoices = $this->invoice_repository->findBy($filter);

        if (is_array($invoices) && count($invoices) > 0) {
            foreach ($invoices as $invoice) {
                EntityManager::remove($invoice);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
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