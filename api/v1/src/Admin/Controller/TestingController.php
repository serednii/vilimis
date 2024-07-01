<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Testing;
use API\Repository\TestingRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/testing
 */
class TestingController
{
    /**
     * @var TestingRepository
     */
    private $testing_repository;


    public function __construct(
        TestingRepository $testing_repository
    )
    {
        $this->testing_repository = $testing_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_testing"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $testing = new Testing();
            $this->mapEntityFromArray($testing, $postData, $filesData);

            EntityManager::save($testing);

            Router::redirectTo("admin_testing");
        }

        $testings = $this->testing_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/testing/index.html.twig", [
            "testings" => $testings
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_testing_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $testing = $this->testing_repository->find($id);
            $this->mapEntityFromArray($testing, $postData, $filesData);

            EntityManager::save($testing);

            Router::redirectTo("admin_testing_edit", ["id"=>$testing->getId()]);
        }

        $testing = $this->testing_repository->find($id);

        return AdminResponse::createResponse("admin/testing/edit.html.twig", [
            "testing" => $testing
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_testing_delete"
     * }
     */
    public function delete($id)
    {
        $testing = $this->testing_repository->find($id);
        EntityManager::remove($testing);

        Router::redirectTo("admin_testing");
    }

    private function mapEntityFromArray(Testing $testing, array $data, array $files) {
        $testing->setName($data["name"]);
        $testing->setDalsi($data["dalsi"]);
    }

}