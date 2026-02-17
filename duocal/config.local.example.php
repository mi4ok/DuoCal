<?php

/**
 * Пример локального конфига.
 * Скопируйте в config.local.php и задайте свои значения.
 */

return [
    'app' => [
        'env' => 'production',
        'debug' => false,
        'url' => 'https://your-domain.com',
    ],
    'db' => [
        'host' => 'localhost',
        'dbname' => 'duocal',
        'user' => 'your_user',
        'password' => 'your_password',
    ],
    'auth' => [
        'jwt_secret' => 'random-long-secret-key',
    ],
];
