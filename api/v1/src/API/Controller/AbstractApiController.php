<?php

namespace API\Controller;

use Gephart\Framework\Facade\Request;

abstract class AbstractApiController {
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