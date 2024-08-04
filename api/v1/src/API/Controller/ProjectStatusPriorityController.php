<?php

namespace API\Controller;

use API\Entity\ProjectStatus;
use API\Repository\ProjectStatusRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /projectStatusPriority
 */
class ProjectStatusPriorityController extends AbstractApiController
{

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;
    private ProjectStatusRepository $projectStatusRepository;

    public function __construct(
        ProjectStatusRepository $projectStatusRepository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->projectStatusRepository = $projectStatusRepository;
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "projectStatusPriority_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["projectStatuses"]) && is_array($postData["projectStatuses"])) {
            foreach ($postData["projectStatuses"]["id"] as $key=>$id) {
                /** @var ProjectStatus $projectStatus */
                $projectStatus = $this->projectStatusRepository->find($id);

                if ($projectStatus) {
                    $projectStatus->setPriority($postData["projectStatuses"]["priority"][$key]);
                    EntityManager::save($projectStatus);
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