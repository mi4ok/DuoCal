# DuoCal

Совместный календарь для пар и семей. PWA на PHP + Vue 3.

Версия: **0.0.0** (см. [DuoCal_Project_Plan.md](DuoCal_Project_Plan.md))

## Быстрый старт

1. Настройте веб-сервер так, чтобы document root указывал на папку `duocal/public/`.
2. Откройте в браузере **http://ваш-домен.com/install/** (или `http://localhost/install/` для локальной разработки).
3. Заполните форму: хост MySQL, имя базы, пользователь, пароль и при необходимости URL приложения. Нажмите «Установить».
4. После установки удалите папку `duocal/public/install/` с сервера.

Из консоли: `php duocal/public/install/index.php` (с флагом `--no-interactive` только миграции по существующему конфигу).

## Пуш в удалённый репозиторий

После создания репозитория на GitHub или GitLab выполните:

```bash
cd F:\DuoCal
git remote add origin https://github.com/MI4ok/DuoCal.git
git branch -M main
git push -u origin main
git push origin v0.0.0
```

(Замените URL на свой репозиторий.)
