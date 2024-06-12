<?php

namespace API\Controller\Controller\Entity;

use Admin\Facade\AdminResponse;
use Admin\Generator\Entity\Item;
use Admin\Generator\Entity\Module;
use Admin\Generator\Repository\ItemRepository;
use Admin\Generator\Repository\ModuleRepository;
use Admin\Generator\Service\StatusProvider;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;
use Gephart\Http\Request;
use Gephart\ORM\EntityManager;
use Psr\Http\Message\ServerRequestInterface;

/**
 * @xxxSecurity ROLE_ADMIN
 * @RoutePrefix /entity/items-edit
 */
class ItemsEditEntityController
{
    /**
     * @var ModuleRepository
     */
    private $module_repository;

    /**
     * @var StatusProvider
     */
    private $status_provider;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    /**
     * @var ItemRepository
     */
    private $itemRepository;

    private ServerRequestInterface $request;

    private EntityManager $entityManager;

    public function __construct(
        JsonResponseFactory $jsonResponseFactory,
        ModuleRepository $moduleRepository,
        ItemRepository $itemRepository,
        StatusProvider $status_provider,
        JsonSerializator $jsonSerializator,
        ServerRequestInterface $request,
        EntityManager $entityManager
    ) {
        $this->module_repository = $moduleRepository;
        $this->status_provider = $status_provider;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->itemRepository = $itemRepository;
        $this->request = $request;
        $this->entityManager = $entityManager;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "entity_items_edit"
     * }
     */
    public function index()
    {
        $data = $this->request->getBody();
        $data = json_decode($data->getContents());

        for ($i=0;$i<$data->count;$i++) {
            $id = $data->{"id[$i]"};
            if (strpos($id, "new-") === false) {
                $item = $this->itemRepository->find($id);
            } else {
                $item = new Item();
                $item->setModuleId($data->moduleId);
            }

            $item->setName($data->{"name[$i]"});
            $item->setSlug($data->{"slug[$i]"});
            $item->setSort($data->{"sort[$i]"});
            $item->setType($data->{"type[$i]"});

            $this->entityManager->save($item);
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $data,
            "message" => "Nastavení položek entity uloženo",
            "code" => 200
        ]));
    }
}
