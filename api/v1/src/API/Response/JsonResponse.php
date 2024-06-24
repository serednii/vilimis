<?php

namespace API\Response;

use API\Service\JsonSerializator;

final class JsonResponse {
    /**
     * @var JsonSerializator
     */
    private  $jsonSerializator;

    public function __construct(JsonSerializator $jsonSerializator)
    {
        $this->jsonSerializator = $jsonSerializator;
    }
    public function render(array $data, $code = 200)
    {
        http_response_code($code);

        if (empty($data["code"])) {
            $data["code"] = $code;
        }

        echo json_encode($this->jsonSerializator->serialize($data));
        exit;
    }
}