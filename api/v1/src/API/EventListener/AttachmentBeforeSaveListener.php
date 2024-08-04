<?php

namespace API\EventListener;

use API\Controller\AttachmentController;
use API\Service\DiskSpaceService;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;

class AttachmentBeforeSaveListener
{
    /**
     * @var EventManager
     */
    private $eventManager;
    private DiskSpaceService $diskSpaceService;

    public function __construct(
        EventManager $eventManager,
        DiskSpaceService $diskSpaceService
    ) {
        $this->eventManager = $eventManager;
        $eventManager->attach(AttachmentController::EVENT_BEFORE_SAVE, [$this, "beforeSave"]);
        $this->diskSpaceService = $diskSpaceService;
    }

    public function beforeSave(Event $event)
    {
        if ($this->diskSpaceService->getPercentUsage() > 100) {
            throw new \Exception("Překročil jste limit diskového prostoru.");
        }

        return $event;
    }
}
