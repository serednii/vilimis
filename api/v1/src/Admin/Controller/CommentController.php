<?php

namespace Admin\Controller;

use Admin\Facade\AdminResponse;
use API\Entity\Comment;
use API\Repository\CommentRepository;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;

/**
 * @Security ROLE_ADMIN
 * @RoutePrefix /admin/comment
 */
class CommentController
{
    /**
     * @var CommentRepository
     */
    private $comment_repository;


    public function __construct(
        CommentRepository $comment_repository
    )
    {
        $this->comment_repository = $comment_repository;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "admin_comment"
     * }
     */
    public function index()
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["description"])) {
            $comment = new Comment();
            $this->mapEntityFromArray($comment, $postData, $filesData);

            EntityManager::save($comment);

            Router::redirectTo("admin_comment");
        }

        $comments = $this->comment_repository->findBy([], [
            "ORDER BY" => "id DESC"
        ]);

        return AdminResponse::createResponse("admin/comment/index.html.twig", [
            "comments" => $comments
        ]);
    }

    /**
     * @Route {
     *  "rule": "/edit/{id}",
     *  "name": "admin_comment_edit"
     * }
     */
    public function edit($id)
    {
        $postData = Request::getParsedBody();
        $filesData = Request::getUploadedFiles();

        if (!empty($postData["description"])) {
            $comment = $this->comment_repository->find($id);
            $this->mapEntityFromArray($comment, $postData, $filesData);

            EntityManager::save($comment);

            Router::redirectTo("admin_comment_edit", ["id"=>$comment->getId()]);
        }

        $comment = $this->comment_repository->find($id);

        return AdminResponse::createResponse("admin/comment/edit.html.twig", [
            "comment" => $comment
        ]);
    }

    /**
     * @Route {
     *  "rule": "/delete/{id}",
     *  "name": "admin_comment_delete"
     * }
     */
    public function delete($id)
    {
        $comment = $this->comment_repository->find($id);
        EntityManager::remove($comment);

        Router::redirectTo("admin_comment");
    }

    private function mapEntityFromArray(Comment $comment, array $data, array $files) {
        $comment->setDescription($data["description"]);
        $comment->setEntity($data["entity"]);
        $comment->setEntityId($data["entity_id"]);
        $comment->setCreated(!empty($data["created"]) ? new \DateTime($data["created"]) : null);
    }

}