<?php

namespace API\Configuration;

use Gephart\Configuration\Configuration;

class DiskConfiguration
{
    const DEFAULT_UPLOAD_DIR = __DIR__ . "/../../../web/upload";

    /**
     * @var array
     */
    private $diskConfiguration;

    /**
     * @var string
     */
    private $directory;

    public function __construct(Configuration $configuration)
    {
        $defaultDiskConfiguration = [
            "upload_dir" => self::DEFAULT_UPLOAD_DIR,
            "disk_quote_in_mb" => "50"
        ];

        try {
            $diskConfiguration = $configuration->get("disk");

            if (!is_array($diskConfiguration)) {
                $diskConfiguration = $defaultDiskConfiguration;
            }
        } catch (\Exception $e) {
            $diskConfiguration = $defaultDiskConfiguration;
        }

        $this->diskConfiguration = $diskConfiguration;

        $this->directory = $configuration->getDirectory();
    }

    public function get(string $key)
    {
        return isset($this->diskConfiguration[$key]) ? $this->diskConfiguration[$key] : false;
    }

    public function getDirectory(): string
    {
        return $this->directory;
    }

    public function getUploadDirectory()
    {
        $uploadDir = $this->get("upload_dir");

        return $this->getDirectory() . "/../" . $uploadDir;
    }
}
