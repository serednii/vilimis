<?php

namespace API\Controller\Controller\Entity;

use Admin\Facade\AdminResponse;
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
 * @RoutePrefix /entity/delete
 */
class DeleteEntityController
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
     *  "name": "entity_delete"
     * }
     */
    public function index()
    {
        $data = $this->request->getBody();
        $data = json_decode($data->getContents());

        try {
            $module = $this->module_repository->find($data->id);
            $this->entityManager->remove($module);

            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Entita {$module->getName()} smazána}",
                "code" => 400
            ]));
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 400
            ]));
        }
    }
}
