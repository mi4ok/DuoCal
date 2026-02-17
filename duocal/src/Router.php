<?php

/**
 * Простой роутер для API (метод + путь).
 * Реализация: по мере добавления API.
 */

declare(strict_types=1);

class Router {

    /** @var array<string, callable> */
    private $routes = [];

    /**
     * @param string $method GET|POST|PUT|DELETE
     * @param string $path
     * @param callable $handler
     */
    public function add(string $method, string $path, callable $handler): void {
        $key = $method . ' ' . $path;
        $this->routes[$key] = $handler;
    }

    /**
     * @return mixed
     */
    public function dispatch(string $method, string $path) {
        $key = $method . ' ' . $path;
        if (isset($this->routes[$key])) {
            return ($this->routes[$key])();
        }
        return null;
    }
}
