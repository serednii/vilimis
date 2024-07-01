<?php

namespace API\Controller\Controller\Entity;

use Admin\Facade\AdminResponse;
use Admin\Generator\Repository\GroupRepository;
use Admin\Generator\Repository\ItemRepository;
use Admin\Generator\Repository\ModuleRepository;
use Admin\Generator\Service\StatusProvider;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @xxxSecurity ROLE_ADMIN
 * @RoutePrefix /entity/list
 */
class ListEntityController
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
    private GroupRepository $groupRepository;

    public function __construct(
        JsonResponseFactory $jsonResponseFactory,
        ModuleRepository $moduleRepository,
        ItemRepository $itemRepository,
        GroupRepository $groupRepository,
        StatusProvider $status_provider,
        JsonSerializator $jsonSerializator
    ) {
        $this->module_repository = $moduleRepository;
        $this->status_provider = $status_provider;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->itemRepository = $itemRepository;
        $this->groupRepository = $groupRepository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "entity_list"
     * }
     */
    public function index()
    {
        $modules = $this->module_repository->findBy([], ["ORDER BY" => "sort ASC"]);
        $modules_status = $this->status_provider->getModulesStatus($modules);
        $items = $this->itemRepository->findBy([], ["ORDER BY" => "sort ASC"]);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "modules" => $modules,
            "modules_status" => $modules_status,
            "items" => $items
        ]));
    }
}
