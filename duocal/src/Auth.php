<?php

/**
 * Авторизация через JWT (без внешних зависимостей).
 */

declare(strict_types=1);

class Auth {

    /**
     * Создаёт JWT для пользователя.
     *
     * @param int $userId
     * @param array<string, mixed>|null $config секция auth из конфига (jwt_secret, jwt_ttl_hours)
     * @return string
     */
    public static function createToken(int $userId, ?array $config = null): string {
        if ($config === null) {
            $full = require __DIR__ . '/../config.php';
            $config = $full['auth'] ?? [];
        }
        $secret = (string) ($config['jwt_secret'] ?? '');
        $ttlHours = (int) ($config['jwt_ttl_hours'] ?? 168);
        $payload = [
            'user_id' => $userId,
            'iat' => time(),
            'exp' => time() + $ttlHours * 3600,
        ];
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $headerB64 = self::base64UrlEncode(json_encode($header));
        $payloadB64 = self::base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('sha256', $headerB64 . '.' . $payloadB64, $secret, true);
        $signatureB64 = self::base64UrlEncode($signature);
        return $headerB64 . '.' . $payloadB64 . '.' . $signatureB64;
    }

    /**
     * Читает JWT из заголовка Authorization или из $_GET['token'] (для отладки).
     *
     * @return string|null
     */
    public static function getTokenFromRequest(): ?string {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if ($header !== '' && stripos($header, 'Bearer ') === 0) {
            return trim(substr($header, 7));
        }
        return isset($_GET['token']) ? (string) $_GET['token'] : null;
    }

    /**
     * Проверяет токен и возвращает user_id или null.
     *
     * @param string|null $token Bearer-токен или строка токена
     * @return int|null
     */
    public static function getUserIdFromToken(?string $token): ?int {
        if ($token === null || $token === '') {
            return null;
        }
        $token = trim($token);
        if (strpos($token, 'Bearer ') === 0) {
            $token = substr($token, 7);
        }
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        $full = require __DIR__ . '/../config.php';
        $config = $full['auth'] ?? [];
        $secret = (string) ($config['jwt_secret'] ?? '');
        $payloadJson = self::base64UrlDecode($parts[1]);
        if ($payloadJson === null) {
            return null;
        }
        $payload = json_decode($payloadJson, true);
        if (!is_array($payload) || !isset($payload['user_id']) || !isset($payload['exp'])) {
            return null;
        }
        $expectedSig = self::base64UrlEncode(
            hash_hmac('sha256', $parts[0] . '.' . $parts[1], $secret, true)
        );
        if (!hash_equals($expectedSig, $parts[2])) {
            return null;
        }
        if ((int) $payload['exp'] < time()) {
            return null;
        }
        return (int) $payload['user_id'];
    }

    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): ?string {
        $remainder = strlen($data) % 4;
        if ($remainder > 0) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        $decoded = base64_decode(strtr($data, '-_', '+/'), true);
        return $decoded !== false ? $decoded : null;
    }
}
