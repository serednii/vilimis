<?php

namespace API\Controller;

use API\Entity\ChecklistGroup;
use API\Repository\ChecklistGroupRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /checklistGroupPriority
 */
class ChecklistGroupPriorityController extends AbstractApiController
{

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;
    private ChecklistGroupRepository $checklistGroupRepository;

    public function __construct(
        ChecklistGroupRepository $checklistGroupRepository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->checklistGroupRepository = $checklistGroupRepository;
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "checklistGroupPriority_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["checklistGroups"]) && is_array($postData["checklistGroups"])) {
            foreach ($postData["checklistGroups"]["id"] as $key=>$id) {
                /** @var ChecklistGroup $checklistGroup */
                $checklistGroup = $this->checklistGroupRepository->find($id);

                if ($checklistGroup) {
                    $checklistGroup->setPriority($postData["checklistGroups"]["priority"][$key]);
                    EntityManager::save($checklistGroup);
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