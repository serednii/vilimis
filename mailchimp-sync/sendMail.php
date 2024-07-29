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

$result = $mysqli->query("SELECT * FROM instance where passed = 1")->fetch_all(MYSQLI_ASSOC);

foreach ($result as $row) {
    $from_name = "Vilém IS";
    $from_a = "michal@vilemis.cz";
    $s = "Vilém IS - Váš účet byl aktivován";
    $s = "=?utf-8?b?" . base64_encode($s) . "?=";
    $to = $row["email"];
    $body = "Dobrý den,

Byl aktivován Váš účet.

Vaše přístupové údaje:

URL instance: https://$row[instance]/

Uživatelské jméno: $row[email]
Heslo: $row[password]

Budu velmi vděčný za jakoukoli zpětnou vazbu, děkuji.
Michal Katuščák, vilemis.cz";
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "From: =?utf-8?b?" . base64_encode($from_name) . "?= <" . $from_a . ">\r\n";
    $headers .= "Content-Type: text/plain;charset=utf-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    $ok = mail($to, $s, $body, $headers);

    if ($ok) {
        $mysqli->query("
                    UPDATE `instance` SET
                        `passed` = '2' WHERE `email` = '$row[email]';
                    ");

        if ($response->members) {
            foreach ($response->members as $member) {
                if ($member->email_address == $row["email"]) {

                    $mailchimp->lists->updateListMemberTags("30a7366873", $member->id, [
                        "tags" => [[
                            "name" => "Má instanci", "status" => "active",
                        ], [
                            "name" => "Bude mít instanci", "status" => "inactive",
                        ], [
                            "name" => "Zpracováno automaticky", "status" => "active",
                        ]]
                    ]);
                }
            }
        }
    }
}