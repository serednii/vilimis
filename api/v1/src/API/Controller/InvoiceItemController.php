<?php

namespace API\Controller;

use API\Entity\InvoiceItem;
use API\Repository\InvoiceItemRepository;
use API\Repository\InvoiceRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /invoiceItem
 * @Security ROLE_USER
 */
class InvoiceItemController extends AbstractApiController
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
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        InvoiceItemRepository $invoiceItem_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
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
     *  "rule": "/list",
     *  "name": "invoiceItem_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $invoiceItems = $this->invoiceItem_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $invoiceItems
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "invoiceItem_single"
     * }
     */
    public function single($id)
    {
        $invoiceItem = $this->invoiceItem_repository->find($id);

        if (!$invoiceItem) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $invoiceItem
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "invoiceItem_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["invoice_id"])) {

            if (!empty($postData["id"])) {
                $invoiceItem = $this->invoiceItem_repository->find($postData["id"]);


                if (!$invoiceItem) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $invoiceItem = new InvoiceItem();
            }
            $this->mapEntityFromArray($invoiceItem, $postData, $filesData);

            EntityManager::save($invoiceItem);

            $invoiceItem = $this->triggerSave($invoiceItem);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "invoiceItem" => $invoiceItem,
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
     *  "name": "invoiceItem_delete"
     * }
     */
    public function delete($id)
    {
        $invoiceItem = $this->invoiceItem_repository->find($id);
        EntityManager::remove($invoiceItem);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "invoiceItem_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $invoiceItems = $this->invoiceItem_repository->findBy($filter);

        if (is_array($invoiceItems) && count($invoiceItems) > 0) {
            foreach ($invoiceItems as $invoiceItem) {
                EntityManager::remove($invoiceItem);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
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