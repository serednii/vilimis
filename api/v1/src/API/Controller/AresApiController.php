<?php

namespace API\Controller;

use API\Service\AresService;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /ares
 */
class AresApiController {
    private AresService $aresService;
    private JsonResponseFactory $jsonResponseFactory;
    private JsonSerializator $jsonSerializator;

    public function __construct(AresService $aresService,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator)
    {
        $this->aresService = $aresService;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
    }

    /**
     * @Route {
     *  "rule": "/find/{ico}",
     *  "name": "ares_find",
     *   "requirements": {
     *       "ico": "[0-9 ]+"
     *   }
     * }
     */
    public function find($ico)
    {
        $data = $this->aresService->getByIco($ico);

        if (!empty($data["kod"])) {
            if ($data["kod"] == "CHYBA_VSTUPU" || $data["kod"] == "OBECNA_CHYBA" || $data["kod"] == "NENALEZENO") {
                return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                    "message" => str_replace("|", "\n", $data["popis"]),
                    "code" => 500
                ]));
            }
        }


        $name = !empty($data["obchodniJmeno"]) ? $data["obchodniJmeno"] :"";
        $address = !empty($data["sidlo"]) ? $data["sidlo"]["textovaAdresa"] : "";
        $dic = !empty($data["dic"]) ? $data["dic"] : "";

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "data" => [
                "name" => $name,
                "address" => $address,
                "dic" => $dic
            ],
            "message" => "Nalezeno",
            "code" => 200
        ]));
    }
}