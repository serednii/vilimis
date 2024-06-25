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
        $i = 0;

        $types = [
            "filter"=> "=",
            "filter_not"=> "!=",
            "filter_like"=> "LIKE",
            "filter_is"=> "IS",
            "filter_is_not"=> "IS NOT",
            "filter_or_null"=> "OR_NULL",
        ];

        foreach ($types as $type => $symbol) {
            if (!empty($params[$type]) && is_array($params[$type])) {
                foreach ($params[$type] as $key => $value) {
                    $i++;

                    $key = preg_replace('/[^\w]/', '', $key);

                    if ($symbol == "OR_NULL") {
                        $name = "($key = %$i OR $key IS null)";
                    } else {
                        $name = "$key $symbol %$i";
                    }

                    if ($i == 1) {
                        $filter = [$name, $value];
                    } else {
                        $filter[0] .= " AND " . $name;
                        $filter[] = $value;
                    }
                }
            }
        }

        return $filter;
    }
}