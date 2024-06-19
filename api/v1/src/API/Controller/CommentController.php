<?php

namespace API\Controller;

use API\Entity\Comment;
use API\Repository\CommentRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /comment
 */
class CommentController extends AbstractApiController
{
    /**
     * @var CommentRepository
     */
    private $comment_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    public function __construct(
        CommentRepository $comment_repository,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator
    )
    {
        $this->comment_repository = $comment_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/list",
     *  "name": "comment_list"
     * }
     */
    public function index()
    {
        try {
            $filter = $this->parseRequestFilter();

            $params = [];
            $params["ORDER BY"] = !empty($_GET["order"])?$_GET["order"]:"id DESC";
            $params["LIMIT"] = !empty($_GET["limit"])?$_GET["limit"]:"1000";

            $comments = $this->comment_repository->findBy($filter, $params);
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $comments
        ]));
    }

    /**
     * @Route {
     *  "rule": "/single/{id}",
     *  "name": "comment_single"
     * }
     */
    public function single($id)
    {
        $comment = $this->comment_repository->find($id);

        if (!$comment) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => $comment
        ]));
    }


    /**
     * @Route {
     *  "rule": "/save",
     *  "name": "comment_save"
     * }
     */
    public function save()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["description"])) {

            if (!empty($postData["id"])) {
                $comment = $this->comment_repository->find($postData["id"]);


                if (!$comment) {
                    return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                        "message" => "Nenalezeno: $postData[id]",
                        "code" => 404
                    ]));
                }
            } else {
                $comment = new Comment();
            }
            $this->mapEntityFromArray($comment, $postData, $filesData);

            EntityManager::save($comment);


            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "comment" => $comment,
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
     *  "name": "comment_delete"
     * }
     */
    public function delete($id)
    {
        $comment = $this->comment_repository->find($id);
        EntityManager::remove($comment);

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "message" => "Smazáno",
            "code" => 200
        ]));
    }

    private function mapEntityFromArray(Comment $comment, array $data, array $files) {
        $comment->setDescription($data["description"]);
        $comment->setEntity($data["entity"]);
        $comment->setEntityId($data["entity_id"]);
        $comment->setCreated(!empty($data["created"]) ? new \DateTime($data["created"]) : null);
    }

}