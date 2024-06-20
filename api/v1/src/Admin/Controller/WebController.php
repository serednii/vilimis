<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Web;
use API\Repository\WebRepository;
use API\Repository\ClientRepository;
use API\Repository\EndCustomerRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/web
 */
class WebController
{
    /**
     * @var WebRepository
     */
    private $web_repository;

    /**
     * @var WebRepository
     */
    private $parent_web_id_repository;

    /**
     * @var ClientRepository
     */
    private $client_id_repository;

    /**
     * @var EndCustomerRepository
     */
    private $end_customer_id_repository;


    public function __construct(
        WebRepository $parent_web_id_repository,
        ClientRepository $client_id_repository,
        EndCustomerRepository $end_customer_id_repository,
        WebRepository $web_repository
    )
    {
        $this->parent_web_id_repository = $parent_web_id_repository;
        $this->client_id_repository = $client_id_repository;
        $this->end_customer_id_repository = $end_customer_id_repository;
        $this->web_repository = $web_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_web"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $web = new Web();
            $this->mapEntityFromArray($web, $postData, $filesData);

            EntityManager::save($web);

            Router::redirectTo("admin_web");
        }

        $parent_web_ids = $this->parent_web_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $webs = $this->web_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/web/index.html.twig", [
            "parent_web_ids" => $parent_web_ids,
            "client_ids" => $client_ids,
            "end_customer_ids" => $end_customer_ids,
            "webs" => $webs
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_web_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $web = $this->web_repository->find($id);
            $this->mapEntityFromArray($web, $postData, $filesData);

            EntityManager::save($web);

            Router::redirectTo("admin_web_edit", ["id"=>$web->getId()]);
        }

        $parent_web_ids = $this->parent_web_id_repository->findBy([],["ORDER BY" => "id"]);
        $client_ids = $this->client_id_repository->findBy([],["ORDER BY" => "id"]);
        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $web = $this->web_repository->find($id);

        return AdminResponse::createResponse("admin/web/edit.html.twig", [
            "parent_web_ids" => $parent_web_ids,
            "client_ids" => $client_ids,
            "end_customer_ids" => $end_customer_ids,
            "web" => $web
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_web_delete"
     * }
     */
    public function delete($id)
    {
        $web = $this->web_repository->find($id);
        EntityManager::remove($web);

        Router::redirectTo("admin_web");
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