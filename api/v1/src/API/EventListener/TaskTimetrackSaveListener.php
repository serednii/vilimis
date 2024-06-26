<?php

namespace API\EventListener;

use API\Controller\TaskTimetrackController;
use API\Service\TaskTimetrackCalculatorService;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;

class TaskTimetrackSaveListener
{
    /**
     * @var EventManager
     */
    private $eventManager;
    private TaskTimetrackCalculatorService $taskTimetrackCalculatorService;

    public function __construct(
        EventManager $eventManager,
        TaskTimetrackCalculatorService $taskTimetrackCalculatorService
    ) {
        $this->eventManager = $eventManager;
        $eventManager->attach(TaskTimetrackController::EVENT_SAVE, [$this, "afterSave"]);
        $eventManager->attach(\Admin\Controller\TaskTimetrackController::EVENT_SAVE, [$this, "afterSave"]);
        $this->taskTimetrackCalculatorService = $taskTimetrackCalculatorService;
    }

    public function afterSave(Event $event)
    {
        $taskTimetrack = $event->getParam("taskTimetrack");

        $this->taskTimetrackCalculatorService->recalculateAndSaveSpendingTimeOnTask($taskTimetrack);

        return $event;
    }
}
