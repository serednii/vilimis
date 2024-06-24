<?php

namespace API\Service;

use Admin\Security\Provider\DBProvider;
use API\Entity\User;
use API\Repository\UserRepository;
use API\Service\JsonSerializator;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Response\JsonResponseFactory;
use Gephart\Security\Configuration\SecurityConfiguration;
use Gephart\Security\Entity\UserInterface;


final class JwtService
{
    /**
     * @var UserRepository
     */
    private $user_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    /**
     * @var DBProvider
     */
    private $provider;

    /**
     * @var SecurityConfiguration
     */
    private SecurityConfiguration $security_configuration;

    public function __construct(
        UserRepository $user_repository,
        SecurityConfiguration $security_configuration,
        JsonResponseFactory $jsonResponseFactory,
        JsonSerializator $jsonSerializator,
        DBProvider $provider
    )
    {
        $this->user_repository = $user_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->provider = $provider;
        $this->security_configuration = $security_configuration;
    }

    public function generate(User $user)
    {
        $securityProvider = $this->security_configuration->get("provider")["Admin\Security\Provider\DBProvider"];

        $header = json_encode([
            "alg" => "HS256",
            "typ" => "JWT"
        ]);
        $header = $this->base64urlEncode($header);

        $payload = json_encode([
            "id" => $user->getId(),
            "name" => $user->getUsername()
        ]);

        $payload = $this->base64urlEncode($payload);

        $signature = hash_hmac("sha256", $header . "." . $payload, $securityProvider["salt"], true);
        $signature = $this->base64urlEncode($signature);

        return $header . "." . $payload . "." . $signature;
    }

    public function validate($jwt)
    {
        $securityProvider = $this->security_configuration->get("provider")["Admin\Security\Provider\DBProvider"];

        $tks = \explode('.', $jwt);
        if (\count($tks) !== 3) {
            throw new \Exception('Špatné JWT');
        }

        list($header, $payload, $signature) = $tks;
        $signature = $this->base64urlDecode($signature);

        $hash = \hash_hmac("sha256", $header.".".$payload, $securityProvider["salt"], true);

        if (hash_equals($hash, $signature)) {
            return json_decode($this->base64URLDecode($payload), true);
        }
        return false;
    }

    private function base64URLEncode(string $text): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($text));
    }

    private function base64URLDecode(string $text): string
    {
        $remainder = strlen($text) % 4;
        if ($remainder) {
            $padlen = 4 - $remainder;
            $text .= str_repeat('=', $padlen);
        }
        $text = \strtr($text, '-_', '+/');
        return base64_decode($text);
    }
}