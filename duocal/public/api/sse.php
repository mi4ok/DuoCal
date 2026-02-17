<?php

/**
 * Server-Sent Events — realtime (чат, календарь).
 * Реализация: Неделя 3.
 */

declare(strict_types=1);

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');

echo "event: ping\ndata: {\"time\": " . time() . "}\n\n";
