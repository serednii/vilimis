<?php

namespace API\Service;

final class AresService
{
    private $api = "https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/";

    public function getByIco($ico)
    {
        $ico = preg_replace('/\s+/', '', $ico);

        $url = $this->api . "/ekonomicke-subjekty/" . $ico;
        $ch = curl_init( $url );
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, true);
    }
}