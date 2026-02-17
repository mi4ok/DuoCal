<?php

/**
 * Авторизация (JWT или сессии).
 * Реализация: Неделя 1, День 5-6.
 */

declare(strict_types=1);

class Auth {

    /**
     * Проверка токена и возврат user_id или null.
     *
     * @param string|null $token
     * @return int|null
     */
    public static function getUserIdFromToken(?string $token): ?int {
        return null;
    }
}
