<?php

namespace API\Service;

use Gephart\Annotation\Reader;

final class JsonSerializator
{
    /**
     * @var Reader
     */
    private $annotationReader;

    public function __construct(Reader $annotationReader)
    {
        $this->annotationReader = $annotationReader;
    }

    public function serialize($data)
    {
        $maxDepth = 20;
        $actualDepth = 0;

        return $this->process($data, $actualDepth, $maxDepth);
    }

    private function process($data, $actualDepth, $maxDepth)
    {
        if ($actualDepth > $maxDepth) {
            return $data;
        }

        foreach ($data as $key => $value) {
            $data[$key] = $this->serializeValue($value);

            if (is_array($data[$key])) {
                $data[$key] = $this->process($data[$key], $actualDepth + 1, $maxDepth);
            }
        }

        return $data;
    }

    private function serializeValue($value)
    {
        if (!is_object($value)) {
            return $value;
        }

        $class = get_class($value);

        if (!class_exists($class)) {
            return $value;
        }

        $annotations = $this->annotationReader->getAll($class);

        if (!in_array("Serializable", array_keys($annotations))) {
            return $value;
        }

        $classReflection = new \ReflectionClass($class);
        $propertiesReflection = $classReflection->getMethods();

        $data = [];
        foreach ($propertiesReflection as $reflectionProperty) {
            $name = $reflectionProperty->getName();

            if (strpos($name, "get") !== false) {
                $property = substr($name, 3);
                $data[lcfirst($property)] = $value->$name();
            }

            if (strpos($name, "is") !== false) {
                $property = substr($name, 2);
                $data[lcfirst($property)] = $value->$name();
            }
        }

        return $data;
    }
}