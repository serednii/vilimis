<?php

namespace API\Controller;

use Admin\Security\Provider\DBProvider;
use API\Entity\User;
use API\Repository\UserRepository;
use API\Service\JsonSerializator;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Response\JsonResponseFactory;
use Gephart\Http\Stream;
use Gephart\Security\Configuration\SecurityConfiguration;


/**
 * @RoutePrefix /jwt
 */
final class JWTController
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
        $this->security_configuration = $security_configuration;
        $this->provider = $provider;
    }

    /**
     * @Route {
     *  "rule": "/create",
     *  "name": "jwt_create"
     * }
     */
    public function create()
    {
        $securityProvider = $this->security_configuration->get("provider")["Admin\Security\Provider\DBProvider"];
        $credentials = Request::getParsedBody();

        if (empty($credentials["username"])) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Chybí uživatelské jméno",
                "code" => 500
            ]), 500);
        }

        if (empty($credentials["password"])) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Chybí heslo",
                "code" => 500
            ]), 500);
        }

        $user = null;

        try {
            if ($this->provider->authorise($credentials["username"], $credentials["password"])) {
                /** @var User $user */
                $user = $this->provider->getUser();
            }
        } catch (\Exception $exception) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => $exception->getMessage(),
                "code" => 500
            ]), 500);
        }

        if (!$user) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nastala chyba při přihlašování",
                "code" => 500
            ]), 500);
        }

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

        $jwt = $header . "." . $payload . "." . $signature;

        return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
            "jwt" => $jwt,
            "code" => 200
        ]));
    }

    private function base64URLEncode(string $text): string
    {

        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($text));
    }
}