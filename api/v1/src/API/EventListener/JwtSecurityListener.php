<?php

namespace API\EventListener;

use Admin\Security\Provider\DBProvider;
use API\Repository\UserRepository;
use API\Response\JsonResponse;
use API\Service\JsonSerializator;
use API\Service\JwtService;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\Request;
use Gephart\Routing\Router;
use Gephart\Security\Authenticator\Authenticator;
use Gephart\Security\Configuration\SecurityConfiguration;
use Gephart\Security\SecurityReader;

class JwtSecurityListener
{

    /**
     * @var Authenticator
     */
    private $authenticator;

    /**
     * @var SecurityReader
     */
    private $security_reader;

    /**
     * @var SecurityConfiguration
     */
    private $security_configuration;

    /**
     * @var Router
     */
    private $router;

    /**
     * @var EventManager
     */
    private $event_manager;

    /**
     * @var JsonResponse
     */
    private  $jsonResponse;

    /**
     * @var JwtService
     */
    private $jwtService;

    /**
     * @var DBProvider
     */
    private $DBProvider;

    /**
     * @var UserRepository
     */
    private $userRepository;

    public function __construct(
        EventManager $event_manager,
        Authenticator $authenticator,
        SecurityReader $security_reader,
        SecurityConfiguration $security_configuration,
        Router $router,
        JsonResponse $jsonResponse,
        JwtService $jwtService,
        DBProvider $DBProvider,
        UserRepository $userRepository
    ) {
        $this->authenticator = $authenticator;
        $this->security_reader = $security_reader;
        $this->security_configuration = $security_configuration;
        $this->router = $router;

        $event_manager->attach(Router::BEFORE_CALL_EVENT, [$this, "beforeCall"]);
        $this->event_manager = $event_manager;
        $this->jsonResponse = $jsonResponse;
        $this->jwtService = $jwtService;
        $this->DBProvider = $DBProvider;
        $this->userRepository = $userRepository;
    }

    public function beforeCall(Event $event)
    {
        $controller = $event->getParam("controller");
        $action = $event->getParam("action");

        $must_have_role = $this->security_reader->getMustHaveRole($controller, $action);

        try {
            if (!empty($must_have_role)) {

                $headers = Request::getHeaders();
                if (!isset($headers['authorization']) && !isset($headers['authorization'][0])) {
                    if (!empty($headers["content-type"])
                        && !empty($headers["content-type"][0])
                        && strpos($headers["content-type"][0], "/json") !== false) {
                        $this->jsonResponse->render([
                            "message" => "Neoprávněný přístup. Chybí JWT token v hlavičce"
                        ], 403);
                    } else {
                        $this->jsonResponse->render([
                            "message" => "Chybí autorizační token"
                        ], 403);
                    }
                    return false;
                }

                $jwt = str_replace("Bearer ", "", $headers["authorization"][0]);

                if ($payload = $this->jwtService->validate($jwt)) {
                    $user = $this->userRepository->find($payload["id"]);

                    if (!$user) {
                        $this->jsonResponse->render([
                            "message" => "Uživatel dle JWT nebyl nalezen"
                        ], 401);
                    }

                    $this->DBProvider->getUserFromExternal($user);
                } else {
                    $this->jsonResponse->render([
                        "message" => "Ověření nebylo provedeno."
                    ], 403);
                }
            }
        } catch (\Exception $exception) {
            $this->jsonResponse->render([
                "message" => $exception->getMessage()
            ], 403);
        }
    }
}
