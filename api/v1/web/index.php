<?php

use Gephart\Framework\Kernel;
use Gephart\Http\RequestFactory;


// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
    // you want to allow, and if so:
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}
/*
SELECT table_schema "DB Name",
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) "DB Size in MB"
FROM information_schema.tables
GROUP BY table_schema
 */
include_once __DIR__ . "/../vendor/autoload.php";

error_reporting(E_ALL ^ E_DEPRECATED);

$request = (new RequestFactory())->createFromGlobals();

error_reporting(E_ALL ^ E_DEPRECATED);
$kernel = new Kernel($request);

$kernel->registerServices([
    \Admin\EventListener\MenuListener::class,
    \Admin\EventListener\UserListener::class,
    \API\EventListener\JwtSecurityListener::class,
    \API\EventListener\TaskTimetrackSaveListener::class,
    \API\Workflow\Invoice\RecalculateAfterUpdateItemsInvoiceWorkflow::class,
]);


error_reporting(E_ALL ^ E_DEPRECATED);
//ini_set("display_error", 0);

$response = $kernel->run();

error_reporting(E_ALL ^ E_DEPRECATED);
echo $kernel->render($response);