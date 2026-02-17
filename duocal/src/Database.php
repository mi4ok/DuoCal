<?php

/**
 * PDO-обёртка для доступа к БД.
 * Реализация: Неделя 1, День 3-4.
 */

declare(strict_types=1);

class Database {

    /** @var PDO|null */
    private static $instance = null;

    /**
     * @return PDO
     */
    public static function getConnection(array $config): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $config['host'],
            $config['port'] ?? 3306,
            $config['dbname'],
            $config['charset'] ?? 'utf8mb4'
        );
        self::$instance = new PDO($dsn, $config['user'], $config['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        return self::$instance;
    }

    public static function reset(): void {
        self::$instance = null;
    }
}
