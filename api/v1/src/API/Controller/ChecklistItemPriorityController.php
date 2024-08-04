<?php

namespace API\Controller;

use API\Entity\ChecklistItem;
use API\Repository\ChecklistItemRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /checklistItemPriority
 */
class ChecklistItemPriorityController extends AbstractApiController
{

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;
    private ChecklistItemRepository $checklistItemRepository;

    public function __construct(
        ChecklistItemRepository $checklistItemRepository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->checklistItemRepository = $checklistItemRepository;
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "checklistItemPriority_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["checklistItems"]) && is_array($postData["checklistItems"])) {
            foreach ($postData["checklistItems"]["id"] as $key=>$id) {
                /** @var ChecklistItem $checklistItem */
                $checklistItem = $this->checklistItemRepository->find($id);

                if ($checklistItem) {
                    $checklistItem->setPriority($postData["checklistItems"]["priority"][$key]);
                    $checklistItem->setChecklistGroupId($postData["checklistItems"]["checklist_group_id"][$key]);
                    EntityManager::save($checklistItem);
                }
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

}