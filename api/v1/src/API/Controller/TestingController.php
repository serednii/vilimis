<?php

namespace API\Controller;

use API\Entity\Testing;
use API\Repository\TestingRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /testing
 */
class TestingController extends AbstractApiController
{
    /**
     * @var TestingRepository
     */
    private $testing_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;


    public function __construct(
        TestingRepository $testing_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->testing_repository = $testing_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "testing_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $testings = $this->testing_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $testings
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "testing_single"
     * }
     */
    public function single($id)
    {
        $testing = $this->testing_repository->find($id);

        if (!$testing) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $testing
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "testing_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $testing = $this->testing_repository->find($postData["id"]);


                if (!$testing) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $testing = new Testing();
            }
            $this->mapEntityFromArray($testing, $postData, $filesData);

            EntityManager::save($testing);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "testing" => $testing,
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
     *  "name": "testing_delete"
     * }
     */
    public function delete($id)
    {
        $testing = $this->testing_repository->find($id);
        EntityManager::remove($testing);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }


    /**
     * @Route {
     *  "rule": "/deleteByFilter",
     *  "name": "testing_deleteByFilter"
     * }
     */
    public function deleteByFilter()
    {
        $filter = $this->parseRequestFilter();

        $testings = $this->testing_repository->findBy($filter);

        if (is_array($testings) && count($testings) > 0) {
            foreach ($testings as $testing) {
                EntityManager::remove($testing);
            }
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(Testing $testing, array $data, array $files) {
        $testing->setName($data["name"]);
        $testing->setDalsi($data["dalsi"]);
    }

}