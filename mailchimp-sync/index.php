#!/usr/bin/env php
<?php
include 'vendor/autoload.php';

$mailchimp = new MailchimpMarketing\ApiClient();
$mailchimp->setConfig([
    'apiKey' => 'f8f6ba139c528651e6eb9065446943ca-us14',
    'server' => 'us14'
]);

$response = $mailchimp->lists->getListMembersInfo("30a7366873");


$mysqli = new mysqli("localhost", "user_instance", "324566úů.ščř", "instance");

if ($response->members) {
    foreach ($response->members as $member) {

            $ma_instanci = false;
            if ($member->tags) {
                foreach ($member->tags as $tag) {
                    if ($tag->name == "Má instanci") {
                        $ma_instanci = true;
                    } elseif ($tag->name == "Bude mít instanci") {
                        $ma_instanci = true;
                    }
                };
            }

            if (!$ma_instanci) {
                $em = addslashes($member->email_address);
                $mysqli->query("
                INSERT INTO `instance` SET
                    `email` = '$em',
                    `password` = '',
                    `created` = now(),
                    `instance` = '',
                    `passed` = '0';
                ");

                $response = $mailchimp->lists->updateListMemberTags("30a7366873", $member->id, [
                    "tags"=> [[
                        "name"=> "Bude mít instanci", "status"=> "active",
                    ],[
                        "name"=> "Zpracováno automaticky", "status"=> "active",
                    ]]
                ]);
            }
        }
}

print_r($response);