<?php

namespace API\Service;

use API\Configuration\DiskConfiguration;

final class DiskSpaceService
{

    private DiskConfiguration $configuration;

    public function __construct(DiskConfiguration $configuration)
    {
        $this->configuration = $configuration;
    }
    public function getDirectorySize($path = false){
        if (!$path) {
            $path = $this->configuration->getUploadDirectory();
        }

        $bytestotal = 0;
        $path = realpath($path);
        if($path!==false && $path!='' && file_exists($path)){
            foreach(new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path, \FilesystemIterator::SKIP_DOTS)) as $object){
                $bytestotal += $object->getSize();
            }
        }
        return $bytestotal;
    }

    public function getDirectorySizeInMb($path = false)
    {
        $bytes = $this->getDirectorySize($path);
        return round($bytes / 1024 / 1024);
    }

    public function getQuotaInMb()
    {
        return $this->configuration->get("disk_quote_in_mb");
    }

    public function getPercentUsage()
    {
        return (100 / $this->getQuotaInMb() * $this->getDirectorySizeInMb());
    }
}