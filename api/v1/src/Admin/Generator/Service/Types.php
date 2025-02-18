<?php

namespace Admin\Generator\Service;

use Admin\Generator\Type\ArrayType;
use Admin\Generator\Type\BoolType;
use Admin\Generator\Type\DateTimeType;
use Admin\Generator\Type\DateType;
use Admin\Generator\Type\FileType;
use Admin\Generator\Type\FloatType;
use Admin\Generator\Type\ImageType;
use Admin\Generator\Type\IntType;
use Admin\Generator\Type\PasswordType;
use Admin\Generator\Type\TextareaType;
use Admin\Generator\Type\TextType;
use Admin\Generator\Type\TypeInterface;
use Admin\Generator\Type\WysiwygType;
use Gephart\Collections\Collection;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;

class Types
{
    const HOOK_EVENT = __CLASS__ . "::HOOK_EVENT";

    /**
     * @var Collection|TypeInterface[]
     */
    private $types;

    public function __construct(EventManager $eventManager)
    {
        $this->eventManager = $eventManager;

        $this->types = new Collection(TypeInterface::class);

        $this->triggerHook([
            IntType::class,
            FloatType::class,
            BoolType::class,
            DateType::class,
            DateTimeType::class,
            FileType::class,
            ImageType::class,
            TextareaType::class,
            WysiwygType::class,
            ArrayType::class,
            TextType::class,
            PasswordType::class
        ]);
    }

    public function getTypes(): Collection
    {
        return $this->types;
    }

    private function triggerHook(array $types = []): Collection
    {
        $event = new Event();
        $event->setName(self::HOOK_EVENT);
        $event->setParams([
            "types" => $types
        ]);

        $this->eventManager->trigger($event);

        $typeNames = $event->getParam("types");

        foreach ($typeNames as $typeName) {
            $this->types->add(new $typeName);
        }

        $this->types = $this->types->sort(function(TypeInterface $left, TypeInterface $right){
            return $right->getPriority() <=> $left->getPriority();
        });

        return $this->types;
    }

}