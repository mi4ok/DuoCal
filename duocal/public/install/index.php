<?php

/**
 * Инсталлятор DuoCal (веб и консоль).
 * Веб: http://your-domain.com/install/
 * Консоль: php duocal/public/install/index.php [--no-interactive]
 * После установки удалите папку install/ для безопасности.
 */

declare(strict_types=1);

$publicDir = __DIR__ . '/..';
$baseDir = $publicDir . '/..';
$configPath = $baseDir . '/config.local.php';
$migrationsDir = $baseDir . '/migrations';

if (php_sapi_name() === 'cli') {
    duocal_runCliInstall($baseDir, $configPath, $migrationsDir, $argv ?? []);
    exit(0);
}

header('Content-Type: text/html; charset=utf-8');

if (!function_exists('duocal_runMigrations')) {
    function duocal_runMigrations(PDO $pdo, string $migrationsDir): array {
    $messages = [];
    $files = glob($migrationsDir . '/*.sql');
    if ($files === false) {
        $files = [];
    }
    sort($files);
    foreach ($files as $file) {
        $name = basename($file);
        $sql = file_get_contents($file);
        if ($sql === false) {
            $messages[] = "Пропуск {$name}: не удалось прочитать файл.";
            continue;
        }
        $sql = preg_replace('/^--.*$/m', '', $sql);
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            fn($s) => $s !== ''
        );
        foreach ($statements as $statement) {
            if ($statement === '') {
                continue;
            }
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'already exists') !== false ||
                    strpos($e->getMessage(), 'Duplicate') !== false) {
                    continue;
                }
                throw $e;
            }
        }
        $messages[] = "Применена миграция: {$name}";
    }
    return $messages;
    }
}

if (!function_exists('duocal_escapePhpString')) {
    function duocal_escapePhpString(string $s): string {
        return addcslashes($s, "\\'");
    }
}

if (!function_exists('duocal_readLine')) {
    function duocal_readLine(string $prompt, string $default = ''): string {
        $suffix = $default !== '' ? " [{$default}]" : '';
        echo $prompt . $suffix . ': ';
        $line = fgets(STDIN);
        if ($line === false) {
            return $default;
        }
        $value = trim($line);
        return $value !== '' ? $value : $default;
    }
}

if (!function_exists('duocal_runCliInstall')) {
/**
 * Инсталляция из консоли.
 *
 * @param string[] $argv
 */
function duocal_runCliInstall(string $baseDir, string $configPath, string $migrationsDir, array $argv): void {
    echo "DuoCal — инсталлятор" . PHP_EOL;
    echo str_repeat('=', 40) . PHP_EOL;

    $interactive = !in_array('--no-interactive', $argv, true);

    if ($interactive && !file_exists($configPath)) {
        echo "Локальный конфиг не найден. Введите параметры подключения к MySQL." . PHP_EOL . PHP_EOL;
        $db = [
            'host' => duocal_readLine('Хост', 'localhost'),
            'port' => (int) duocal_readLine('Порт', '3306'),
            'dbname' => duocal_readLine('Имя базы данных', 'duocal'),
            'charset' => 'utf8mb4',
            'user' => duocal_readLine('Пользователь MySQL', 'root'),
            'password' => duocal_readLine('Пароль MySQL', ''),
        ];
        $appUrl = duocal_readLine('URL приложения (например http://localhost)', 'http://localhost');
        $jwtSecret = bin2hex(random_bytes(32));
        $configContent = '<?php' . "\n\nreturn [\n" .
            "    'app' => [\n        'url' => '" . duocal_escapePhpString($appUrl) . "',\n    ],\n" .
            "    'db' => [\n        'host' => '" . duocal_escapePhpString($db['host']) . "',\n        'port' => {$db['port']},\n        'dbname' => '" .
            duocal_escapePhpString($db['dbname']) . "',\n        'charset' => '{$db['charset']}',\n        'user' => '" . duocal_escapePhpString($db['user']) . "',\n        'password' => '" .
            duocal_escapePhpString($db['password']) . "',\n    ],\n" .
            "    'auth' => [\n        'jwt_secret' => '" . duocal_escapePhpString($jwtSecret) . "',\n    ],\n];\n";
        if (!file_put_contents($configPath, $configContent)) {
            die('Ошибка: не удалось записать config.local.php' . PHP_EOL);
        }
        echo "Создан файл config.local.php" . PHP_EOL;
    } else {
        $pathToLoad = file_exists($configPath) ? $configPath : $baseDir . '/config.php';
        if (!file_exists($pathToLoad)) {
            die('Ошибка: не найден config.local.php или config.php. Запустите без --no-interactive.' . PHP_EOL);
        }
        $fullConfig = require $pathToLoad;
        $db = $fullConfig['db'] ?? [];
        if (empty($db['dbname']) || empty($db['user'])) {
            die('Ошибка: в конфиге заданы не все параметры db (dbname, user).' . PHP_EOL);
        }
    }

    $pathToLoad = file_exists($configPath) ? $configPath : $baseDir . '/config.php';
    $fullConfig = require $pathToLoad;
    $db = $fullConfig['db'] ?? [];
    $host = $db['host'] ?? 'localhost';
    $port = $db['port'] ?? 3306;
    $dbname = $db['dbname'] ?? 'duocal';
    $user = $db['user'] ?? 'root';
    $password = $db['password'] ?? '';
    $charset = $db['charset'] ?? 'utf8mb4';

    $dsnWithoutDb = "mysql:host={$host};port={$port};charset={$charset}";
    $pdo = new PDO($dsnWithoutDb, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . str_replace('`', '``', $dbname) . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "База данных: {$dbname} (создана или уже существует)" . PHP_EOL;
    $pdo->exec("USE `" . str_replace('`', '``', $dbname) . "`");

    $files = glob($migrationsDir . '/*.sql');
    if ($files === false) {
        $files = [];
    }
    sort($files);
    foreach ($files as $file) {
        $name = basename($file);
        $sql = file_get_contents($file);
        if ($sql === false) {
            echo "Пропуск {$name}: не удалось прочитать файл." . PHP_EOL;
            continue;
        }
        $sql = preg_replace('/^--.*$/m', '', $sql);
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            fn($s) => $s !== ''
        );
        foreach ($statements as $statement) {
            if ($statement === '') {
                continue;
            }
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'already exists') !== false ||
                    strpos($e->getMessage(), 'Duplicate') !== false) {
                    continue;
                }
                echo "Ошибка в {$name}: " . $e->getMessage() . PHP_EOL;
                exit(1);
            }
        }
        echo "Миграция применена: {$name}" . PHP_EOL;
    }
    echo PHP_EOL . "Готово. Document root веб-сервера укажите на папку duocal/public/" . PHP_EOL;
    }
}

$step = $_POST['step'] ?? 'form';
$error = '';
$successMessages = [];

$suggestedAppUrl = '';
if (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] !== '') {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $suggestedAppUrl = $scheme . '://' . $_SERVER['HTTP_HOST'];
}

if (file_exists($configPath)) {
    $fullConfig = require $configPath;
    $db = $fullConfig['db'] ?? [];
    if (!empty($db['dbname']) && !empty($db['user'])) {
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                $db['host'] ?? 'localhost',
                $db['port'] ?? 3306,
                $db['dbname'],
                $db['charset'] ?? 'utf8mb4'
            );
            $pdo = new PDO($dsn, $db['user'], $db['password'] ?? '', [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);
            $pdo->query('SELECT 1 FROM users LIMIT 1');
            $alreadyInstalled = true;
        } catch (Throwable $e) {
            $alreadyInstalled = false;
        }
    } else {
        $alreadyInstalled = false;
    }
} else {
    $alreadyInstalled = false;
}

if ($alreadyInstalled) {
    $step = 'done';
}

if ($step === 'install' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $host = trim((string) ($_POST['db_host'] ?? ''));
    $port = (int) ($_POST['db_port'] ?? 3306);
    $dbname = trim((string) ($_POST['db_name'] ?? ''));
    $user = trim((string) ($_POST['db_user'] ?? ''));
    $password = (string) ($_POST['db_password'] ?? '');
    $appUrl = trim((string) ($_POST['app_url'] ?? ''));

    if ($host === '' || $dbname === '' || $user === '') {
        $error = 'Заполните хост, имя базы и пользователя.';
        $step = 'form';
    } else {
        $dsnWithoutDb = "mysql:host=" . str_replace(';', '', $host) . ";port={$port};charset=utf8mb4";
        try {
            $pdo = new PDO($dsnWithoutDb, $user, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . str_replace('`', '``', $dbname) . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $pdo->exec("USE `" . str_replace('`', '``', $dbname) . "`");
            $successMessages = duocal_runMigrations($pdo, $migrationsDir);

            $jwtSecret = bin2hex(random_bytes(32));
            $configContent = '<?php' . "\n\nreturn [\n" .
                "    'app' => [\n        'url' => '" . duocal_escapePhpString($appUrl !== '' ? $appUrl : 'http://localhost') . "',\n    ],\n" .
                "    'db' => [\n        'host' => '" . duocal_escapePhpString($host) . "',\n        'port' => {$port},\n        'dbname' => '" .
                duocal_escapePhpString($dbname) . "',\n        'charset' => 'utf8mb4',\n        'user' => '" . duocal_escapePhpString($user) . "',\n        'password' => '" .
                duocal_escapePhpString($password) . "',\n    ],\n" .
                "    'auth' => [\n        'jwt_secret' => '" . duocal_escapePhpString($jwtSecret) . "',\n    ],\n];\n";
            if (!file_put_contents($configPath, $configContent)) {
                $error = 'Не удалось записать config.local.php. Проверьте права на папку duocal/.';
                $step = 'form';
            } else {
                $step = 'done';
            }
        } catch (PDOException $e) {
            $error = 'Ошибка MySQL: ' . htmlspecialchars($e->getMessage());
            $step = 'form';
        }
    }
}

?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Установка DuoCal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/app.css">
    <style>
        * { box-sizing: border-box; }
        body { font-family: var(--font); max-width: 420px; margin: 2rem auto; padding: 0 1rem; }
        h1 { font-family: var(--font-display); font-size: 1.5rem; color: var(--text); }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.25rem; font-weight: 500; color: var(--text); }
        input { width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: var(--radius-sm); }
        button { padding: 0.6rem 1.2rem; background: var(--primary); color: var(--surface); border: none; border-radius: var(--radius-sm); cursor: pointer; font-weight: 600; }
        button:hover { background: var(--secondary); }
        .error { color: #b91c1c; margin-bottom: 1rem; }
        .success { color: var(--success); margin-bottom: 1rem; }
        .msg { font-size: 0.9rem; margin: 0.25rem 0; }
        a { color: var(--primary); }
    </style>
</head>
<body>
    <h1>Установка DuoCal</h1>

    <?php if ($error !== ''): ?>
        <p class="error"><?php echo htmlspecialchars($error); ?></p>
    <?php endif; ?>

    <?php if ($step === 'form'): ?>
        <form method="post" action="">
            <input type="hidden" name="step" value="install">
            <div class="form-group">
                <label for="db_host">Хост MySQL</label>
                <input id="db_host" name="db_host" type="text" value="localhost" required>
            </div>
            <div class="form-group">
                <label for="db_port">Порт</label>
                <input id="db_port" name="db_port" type="number" value="3306">
            </div>
            <div class="form-group">
                <label for="db_name">Имя базы данных</label>
                <input id="db_name" name="db_name" type="text" value="duocal" required>
            </div>
            <div class="form-group">
                <label for="db_user">Пользователь MySQL</label>
                <input id="db_user" name="db_user" type="text" required>
            </div>
            <div class="form-group">
                <label for="db_password">Пароль MySQL</label>
                <input id="db_password" name="db_password" type="password">
            </div>
            <div class="form-group">
                <label for="app_url">URL приложения</label>
                <input id="app_url" name="app_url" type="url" value="<?php echo htmlspecialchars($suggestedAppUrl); ?>" placeholder="https://domain.com">
            </div>
            <button type="submit">Установить</button>
        </form>
    <?php elseif ($step === 'done'): ?>
        <?php foreach ($successMessages as $msg): ?>
            <p class="msg success"><?php echo htmlspecialchars($msg); ?></p>
        <?php endforeach; ?>
        <p class="success"><strong>Готово.</strong> DuoCal установлен.</p>
        <?php if ($alreadyInstalled): ?>
            <p>Приложение уже было установлено ранее.</p>
        <?php endif; ?>
        <p><a href="../">Перейти в приложение</a></p>
        <p style="margin-top: 1.5rem; font-size: 0.9rem; color: #64748b;">
            Для безопасности удалите папку <code>install</code> с сервера.
        </p>
    <?php endif; ?>
</body>
</html>
