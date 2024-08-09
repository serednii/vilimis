<?php

namespace API\EventListener;

use API\Controller\LicenseController;
use API\Entity\License;
use API\Repository\LicenseRepository;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\ORM\EntityManager;

class LicenseSaveListener
{
    /**
     * @var EventManager
     */
    private $eventManager;
    private LicenseRepository $licenseRepository;
    private EntityManager $entityManager;

    public function __construct(
        EventManager $eventManager,
        LicenseRepository $licenseRepository,
        EntityManager $entityManager
    ) {
        $this->eventManager = $eventManager;
        $eventManager->attach(LicenseController::EVENT_SAVE, [$this, "afterSave"]);
        $this->licenseRepository = $licenseRepository;
        $this->entityManager = $entityManager;
    }

    public function afterSave(Event $event)
    {
        /** @var License $license */
        $license = $event->getParam("license");

        if ($license->getBeforeLicenseId()) {
            $beforeLicense = $this->licenseRepository->find($license->getBeforeLicenseId());
            $beforeLicense->setAfterLicenseId($license->getId());
            $this->entityManager->save($beforeLicense);
        }

        if ($license->getAfterLicenseId()) {
            $afterLicense = $this->licenseRepository->find($license->getAfterLicenseId());
            $afterLicense->setBeforeLicenseId($license->getId());
            $this->entityManager->save($afterLicense);
        }

        return $event;
    }
}
