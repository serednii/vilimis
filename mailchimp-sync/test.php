<?php

$from_name = "Vilém IS";
$from_a = "michal@vilemis.cz";
$s = "Vilém IS - Váš účet byl aktivován";
$s = "=?utf-8?b?" . base64_encode($s) . "?=";
$to = "michal@katuscak.cz";
$body = "Dobrý den,

Byl aktivován Váš účet.

Vaše přístupové údaje:

URL instance: https://as/
Uživatelské jméno: asd
Heslo: asd

Budu velmi vděčný za jakoukoli zpětnou vazbu, děkuji.
Michal Katuščák, vilemis.cz";
$headers = "MIME-Version: 1.0\r\n";
$headers .= "From: =?utf-8?b?" . base64_encode($from_name) . "?= <" . $from_a . ">\r\n";
$headers .= "Content-Type: text/plain;charset=utf-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();
$ok = mail($to, $s, $body, $headers);
var_dump($ok);