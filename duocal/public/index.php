<?php

/**
 * Точка входа DuoCal.
 * Document root должен указывать на папку public/.
 */

declare(strict_types=1);

$config = require dirname(__DIR__) . '/config.php';

if (php_sapi_name() === 'cli') {
    echo 'DuoCal — запуск только через веб-сервер (public/ как document root).' . PHP_EOL;
    exit(1);
}

header('Content-Type: text/html; charset=utf-8');

?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($config['app']['name']); ?></title>
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="assets/css/app.css">
</head>
<body>
    <div id="app">
        <p>DuoCal — загрузка…</p>
    </div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
