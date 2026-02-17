# DuoCal

Совместный календарь для пар и семей. PWA на PHP + Vue 3.

Версия: **0.0.0** (см. [DuoCal_Project_Plan.md](DuoCal_Project_Plan.md))

## Быстрый старт

1. Создайте БД и выполните миграцию:
   ```bash
   mysql -u user -p -e "CREATE DATABASE duocal CHARACTER SET utf8mb4;"
   mysql -u user -p duocal < duocal/migrations/001_init.sql
   ```
2. Скопируйте `duocal/config.local.example.php` в `duocal/config.local.php` и укажите доступ к БД.
3. Настройте веб-сервер так, чтобы document root указывал на папку `duocal/public/`.

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
