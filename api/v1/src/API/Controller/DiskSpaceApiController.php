<?php

namespace API\Controller;

use API\Entity\Comment;
use API\Repository\CommentRepository;
use API\Service\DiskSpaceService;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /disk-space
 * @Security ROLE_USER
 */
class DiskSpaceApiController extends AbstractApiController
{

    private DiskSpaceService $diskSpaceService;
    private JsonResponseFactory $jsonResponseFactory;
    private JsonSerializator $jsonSerializator;

    public function __construct(
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        DiskSpaceService $diskSpaceService
    )
    {
        $this->diskSpaceService = $diskSpaceService;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/",
     *  "name": "disk_space"
     * }
     */
    public function index()
    {
        $usedSpaceInMb = $this->diskSpaceService->getDirectorySizeInMb();
        $usedPercent = $this->diskSpaceService->getPercentUsage();
        $quota = $this->diskSpaceService->getQuotaInMb();

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "usedSpaceInMb" => $usedSpaceInMb,
            "quotaInMb" => $quota,
            "usedPercent" => $usedPercent,
            "code" => 200
        ]));
    }
}