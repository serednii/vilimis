<?php

namespace API\Controller;

use API\Entity\Web;
use API\Repository\WebRepository;
use API\Repository\ClientRepository;
use API\Repository\EndCustomerRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /web
 */
class WebController extends AbstractApiController
{
    /**
     * @var WebRepository
     */
    private $web_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    public function __construct(
        WebRepository $web_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->web_repository = $web_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "web_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $webs = $this->web_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $webs
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "web_single"
     * }
     */
    public function single($id)
    {
        $web = $this->web_repository->find($id);

        if (!$web) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $web
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "web_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $web = $this->web_repository->find($postData["id"]);


                if (!$web) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $web = new Web();
            }
            $this->mapEntityFromArray($web, $postData, $filesData);

            EntityManager::save($web);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "web" => $web,
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
     *  "name": "web_delete"
     * }
     */
    public function delete($id)
    {
        $web = $this->web_repository->find($id);
        EntityManager::remove($web);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(Web $web, array $data, array $files) {
        $web->setName($data["name"]);
        $web->setUrl($data["url"]);
        $web->setParentWebId(!empty($data["parent_web_id"]) ? (int) $data["parent_web_id"] : null);
        $web->setAccesses($data["accesses"]);
        $web->setClientId(!empty($data["client_id"]) ? (int) $data["client_id"] : null);
        $web->setEndCustomerId(!empty($data["end_customer_id"]) ? (int) $data["end_customer_id"] : null);
    }

}