<?php

/**
 * Утилиты DuoCal.
 */

declare(strict_types=1);

/**
 * @param mixed $data
 */
function jsonResponse($data, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
}

/**
 * @return array<string, string>
 */
function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}
