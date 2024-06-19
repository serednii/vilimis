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

                if ($i == 1) {
                    $filter = [addslashes($key) . " = %".$i, $value];
                } else {
                    $filter[0] .= " AND ".addslashes($key) . " = %".$i;
                    $filter[] = $value;
                }
            }
        }

        return $filter;
    }
}