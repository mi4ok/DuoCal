<?php

/**
 * PDO-обёртка для доступа к БД.
 */

declare(strict_types=1);

class Database {

    /** @var PDO|null */
    private static $instance = null;

    /**
     * Возвращает подключение к БД. При вызове без аргументов загружает config из duocal/config.php.
     *
     * @param array<string, mixed>|null $dbConfig секция db из конфига (host, port, dbname, user, password, charset)
     * @return PDO
     */
    public static function get(?array $dbConfig = null): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }
        if ($dbConfig === null) {
            $config = require __DIR__ . '/../config.php';
            $dbConfig = $config['db'] ?? [];
        }
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $dbConfig['host'] ?? 'localhost',
            $dbConfig['port'] ?? 3306,
            $dbConfig['dbname'] ?? '',
            $dbConfig['charset'] ?? 'utf8mb4'
        );
        self::$instance = new PDO(
            $dsn,
            $dbConfig['user'] ?? '',
            $dbConfig['password'] ?? '',
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
        return self::$instance;
    }

    /**
     * @param array<string, mixed> $config секция db из конфига
     * @return PDO
     */
    public static function getConnection(array $config): PDO {
        return self::get($config);
    }

    public static function reset(): void {
        self::$instance = null;
    }
}
