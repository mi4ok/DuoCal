<?php

/**
 * Конфигурация DuoCal.
 * Скопируйте в config.local.php и задайте свои значения (config.local.php не коммитить).
 */

$config = [
    'app' => [
        'name' => 'DuoCal',
        'env' => 'development',
        'debug' => true,
        'url' => 'http://localhost',
    ],
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'dbname' => 'duocal',
        'charset' => 'utf8mb4',
        'user' => 'root',
        'password' => '',
    ],
    'auth' => [
        'jwt_secret' => 'change-me-in-production',
        'jwt_ttl_hours' => 168,
    ],
];

if (file_exists(__DIR__ . '/config.local.php')) {
    $local = require __DIR__ . '/config.local.php';
    $config = array_replace_recursive($config, $local);
}

return $config;
