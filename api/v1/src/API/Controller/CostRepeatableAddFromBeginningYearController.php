<?php

namespace API\Controller;

use API\Entity\CostRepeatable;
use API\Repository\CostRepeatableRepository;
use API\Service\CostService;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /costRepeatableAddFromBeginningYear
 * @Security ROLE_USER
 */
class CostRepeatableAddFromBeginningYearController extends AbstractApiController
{

    /**
     * @var CostRepeatableRepository
     */
    private $costRepeatable_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;
    private CostService $costService;


    public function __construct(
        CostRepeatableRepository $costRepeatable_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        CostService $costService
    )
    {
        $this->costRepeatable_repository = $costRepeatable_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->costService = $costService;
    }

    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "costRepeatableAddFromBeginningYearController_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();

        if (!empty($postData["id"])) {

            $costRepeatable = $this->costRepeatable_repository->find($postData["id"]);


            if (!$costRepeatable) {
                return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                    "message" => "Nenalezeno: $postData[id]",
                    "code" => 404
                ]));
            }


            try {
                $from = date("Y")."-01-01";
                $count = $this->costService->generateFromRepeatable($costRepeatable, $from);
            } catch (\Exception $exception) {
                return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                    "message" => $exception->getMessage(),
                    "code" => 500
                ]));
            }

            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Dogenerováno nákladů: $count",
                "code" => 200
            ]));
        }


        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Chybí data",
            "code" => 500
        ]));
    }
}