<?php

namespace API\Service;

use API\Entity\Project;
use API\Entity\Task;
use API\Entity\TaskTimetrack;
use API\Repository\ProjectRepository;
use API\Repository\TaskRepository;
use API\Repository\TaskTimetrackRepository;
use Gephart\Annotation\Reader;
use Gephart\ORM\EntityManager;

final class TaskTimetrackCalculatorService
{
    private EntityManager $entityManager;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function recalculateAndSaveSpendingTimeOnTask(TaskTimetrack $taskTimetrack): void
    {
        $taskId = $taskTimetrack->getTaskId();

        if (!$taskId) {
            return;
        }

        /** @var TaskRepository $taskRepository */
        $taskRepository = $this->entityManager->getRepository(TaskRepository::class);

        /** @var TaskTimetrackRepository $repository */
        $repository = $this->entityManager->getRepository(TaskTimetrackRepository::class);
        $taskTimetracks = $repository->findBy([
            "task_id = %1", $taskId
        ]);

        if (empty($taskTimetracks)) {
            return;
        }

        $spendingSeconds = 0;

        /** @var TaskTimetrack $taskTimetrack */
        foreach ($taskTimetracks as $taskTimetrack) {
            if (!$taskTimetrack->getDatetimeStart() || !$taskTimetrack->getDatetimeStop()) {
                continue;
            }

            $spendingSeconds += abs($taskTimetrack->getDatetimeStart()->getTimestamp() - $taskTimetrack->getDatetimeStop()->getTimestamp());
        }

        /** @var Task $task */
        $task = $taskRepository->find($taskId);

        if ($task) {
            $task->setSpendingTime($spendingSeconds);
            $this->entityManager->save($task);

            $projectId = $task->getProjectId();
            if (!$projectId) {
                return;
            }

            /** @var Project $project */
            $project = $this->entityManager->getRepository(ProjectRepository::class)->find($projectId);

            if (!$project) {
                return;
            }

            $tasks = $taskRepository->findBy(["project_id = %1", $projectId]);

            if (empty($tasks)) {
                return;
            }

            $spendingSeconds = 0;

            /** @var Task $task */
            foreach ($tasks as $task) {
                $spendingSeconds += $task->getSpendingTime();
            }

            $project->setSpendingTime($spendingSeconds);
            $this->entityManager->save($project);
        }
    }
}