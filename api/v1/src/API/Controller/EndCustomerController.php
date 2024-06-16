<?php

namespace API\Controller;

use API\Entity\EndCustomer;
use API\Repository\EndCustomerRepository;
use API\Repository\ClientRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /endCustomer
 */
class EndCustomerController
{
    /**
     * @var EndCustomerRepository
     */
    private $endCustomer_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    public function __construct(
        EndCustomerRepository $endCustomer_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->endCustomer_repository = $endCustomer_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "endCustomer_list"
     * }
     */
    public function index()
    {
        $endCustomers = $this->endCustomer_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $endCustomers
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "endCustomer_single"
     * }
     */
    public function single($id)
    {
        $endCustomer = $this->endCustomer_repository->find($id);

        if (!$endCustomer) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $endCustomer
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "endCustomer_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {

            if (!empty($postData["id"])) {
                $endCustomer = $this->endCustomer_repository->find($postData["id"]);


                if (!$endCustomer) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $endCustomer = new EndCustomer();
            }
            $this->mapEntityFromArray($endCustomer, $postData, $filesData);

            EntityManager::save($endCustomer);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "endCustomer" => $endCustomer,
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
     *  "name": "endCustomer_delete"
     * }
     */
    public function delete($id)
    {
        $endCustomer = $this->endCustomer_repository->find($id);
        EntityManager::remove($endCustomer);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(EndCustomer $endCustomer, array $data, array $files) {
        $endCustomer->setName($data["name"]);
        $endCustomer->setWeb($data["web"]);
        $endCustomer->setClientId(!empty($data["client_id"]) ? (int) $data["client_id"] : null);
        if (!empty($files["logo"]) && $files["logo"] instanceof UploadedFileInterface) {
            $endCustomer->setLogo($this->uploadFile($files["logo"]));
        }
        if (isset($data["logo_delete"])) {
            $endCustomer->setLogo("");
        }
        $endCustomer->setIc($data["ic"]);
        $endCustomer->setAddress($data["address"]);
    }

    private function uploadFile(UploadedFileInterface $file): string
    {
        $client_filename = $file->getClientFilename();
        $filename = md5($client_filename.time()) . "." . substr($client_filename, -4);
        $dir1 = substr($filename, 0, 2);
        $dir2 = substr($filename, 2, 2);
        $upload_dir = __DIR__ . "/../../../web/upload";
        $target = $upload_dir . "/" . $dir1 . "/" . $dir2 . "/" . $filename;

        if (!is_dir($upload_dir . "/" . $dir1)) {
            @mkdir($upload_dir . "/" . $dir1);
            @chmod($upload_dir . "/" . $dir1, 0777);
        }

        if (!is_dir($upload_dir . "/" . $dir1 . "/" . $dir2)) {
            @mkdir($upload_dir . "/" . $dir1 . "/" . $dir2);
            @chmod($upload_dir . "/" . $dir1 . "/" . $dir2, 0777);
        }

        if ($file->moveTo($target)) {
            @chmod($target, 0777);
            return $dir1 . "/" . $dir2 . "/" . $filename;
        }

        return "";
    }

}