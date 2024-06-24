<?php

namespace API\Controller;

use API\Entity\User;
use Gephart\Framework\Facade\Request;

abstract class AbstractApiController {
    /** @var ?User */
    protected $user = null;

    protected function processJwtLogin()
    {

    }

    protected function parseRequestFilter()
    {
        $params = Request::getQueryParams();

        $filter = [];
        if (!empty($params["filter"]) && is_array($params["filter"])) {
            $i = 0;
            foreach ($params["filter"] as $key => $value) {
                $i++;

                $name = preg_replace('/[^\w]/', '', $key) . " = %".$i;
                if ($i == 1) {
                    $filter = [$name, $value];
                } else {
                    $filter[0] .= " AND ".$name;
                    $filter[] = $value;
                }
            }
        }

        return $filter;
    }
}