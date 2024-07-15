<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\EndCustomerContact;
use API\Repository\EndCustomerContactRepository;
use API\Repository\EndCustomerRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/endCustomerContact
 */
class EndCustomerContactController
{
    const EVENT_SAVE = __CLASS__ . "::EVENT_SAVE";

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var EndCustomerContactRepository
     */
    private $endCustomerContact_repository;

    /**
     * @var EndCustomerRepository
     */
    private $end_customer_id_repository;


    public function __construct(
        EndCustomerRepository $end_customer_id_repository,
        EventManager $eventManager,
        EndCustomerContactRepository $endCustomerContact_repository
    )
    {
        $this->end_customer_id_repository = $end_customer_id_repository;
        $this->eventManager = $eventManager;
        $this->endCustomerContact_repository = $endCustomerContact_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_endCustomerContact"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $endCustomerContact = new EndCustomerContact();
            $this->mapEntityFromArray($endCustomerContact, $postData, $filesData);

            EntityManager::save($endCustomerContact);

            Router::redirectTo("admin_endCustomerContact");
        }

        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $endCustomerContacts = $this->endCustomerContact_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/endCustomerContact/index.html.twig", [
            "end_customer_ids" => $end_customer_ids,
            "endCustomerContacts" => $endCustomerContacts
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_endCustomerContact_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["name"])) {
            $endCustomerContact = $this->endCustomerContact_repository->find($id);
            $this->mapEntityFromArray($endCustomerContact, $postData, $filesData);

            EntityManager::save($endCustomerContact);
            $endCustomerContact = $this->triggerSave($endCustomerContact);

            Router::redirectTo("admin_endCustomerContact_edit", ["id"=>$endCustomerContact->getId()]);
        }

        $end_customer_ids = $this->end_customer_id_repository->findBy([],["ORDER BY" => "id"]);
        $endCustomerContact = $this->endCustomerContact_repository->find($id);

        return AdminResponse::createResponse("admin/endCustomerContact/edit.html.twig", [
            "end_customer_ids" => $end_customer_ids,
            "endCustomerContact" => $endCustomerContact
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_endCustomerContact_delete"
     * }
     */
    public function delete($id)
    {
        $endCustomerContact = $this->endCustomerContact_repository->find($id);
        EntityManager::remove($endCustomerContact);

        Router::redirectTo("admin_endCustomerContact");
    }

    private function mapEntityFromArray(EndCustomerContact $endCustomerContact, array $data, array $files) {
        $endCustomerContact->setName($data["name"]);
        $endCustomerContact->setSurname($data["surname"]);
        $endCustomerContact->setPosition($data["position"]);
        $endCustomerContact->setEndCustomerId(!empty($data["end_customer_id"]) ? (int) $data["end_customer_id"] : null);
        $endCustomerContact->setPhone($data["phone"]);
        $endCustomerContact->setEmail($data["email"]);
        if (!empty($files["photo"]) && $files["photo"] instanceof UploadedFileInterface) {
            $endCustomerContact->setPhoto($this->uploadFile($files["photo"]));
        }
        if (isset($data["photo_delete"])) {
            $endCustomerContact->setPhoto("");
        }
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


    private function triggerSave(EndCustomerContact $endCustomerContact): EndCustomerContact
    {
        $event = new Event();
        $event->setName(self::EVENT_SAVE);
        $event->setParams([
            "endCustomerContact" => $endCustomerContact
        ]);

        $this->eventManager->trigger($event);

        return $event->getParam("endCustomerContact");
    }
}