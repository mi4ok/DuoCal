# 📅 DuoCal — Совместный календарь для пар и семей

## Концепция

**DuoCal** — PWA-приложение для совместного планирования жизни пары. Фокус: красота, простота, и фишки, которых нет у конкурентов (геймификация отношений, совместные списки, встроенный чат).

**Отстройка от конкурентов:**
- Cupla, OurCal, TimeTree — нативные приложения, требуют установки из App Store
- Google Calendar — холодный, корпоративный, без «душевности»
- **DuoCal** — работает из браузера, ставится на домашний экран, не требует App Store, и заточен на пары с элементами геймификации

---

## Стек технологий

| Компонент | Технология | Почему |
|-----------|-----------|--------|
| **Backend** | Чистый PHP 8.x | Работает на любом хостинге, никаких зависимостей |
| **База данных** | MySQL / MariaDB | Проверено временем, есть везде |
| **Frontend** | Vue 3 (CDN) + Vanilla CSS | Реактивность без сборщиков, просто `<script>` |
| **Realtime** | SSE (Server-Sent Events) | Обновления в реальном времени без WebSocket-сервера |
| **PWA** | Service Worker + manifest.json | Установка на домашний экран, офлайн-кэш |
| **Хостинг** | Любой shared-хостинг с PHP + MySQL | От $0 до $3-5/мес |

### Почему Vue 3 через CDN

```html
<!-- Всё что нужно — одна строка -->
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
```

- Не нужен npm, webpack, node.js
- Работает прямо в PHP-шаблонах
- Реактивные обновления для календаря (drag-and-drop, мгновенные изменения)
- Компоненты можно описывать прямо в HTML

---

## Архитектура

```
duocal/
├── public/                  # Document root (nginx/apache)
│   ├── index.php           # Точка входа
│   ├── manifest.json       # PWA манифест
│   ├── sw.js               # Service Worker
│   ├── assets/
│   │   ├── css/
│   │   │   └── app.css     # Стили
│   │   ├── js/
│   │   │   ├── app.js      # Главный Vue-компонент
│   │   │   ├── calendar.js # Компонент календаря
│   │   │   ├── chat.js     # Компонент чата
│   │   │   ├── todos.js    # Списки дел
│   │   │   └── gamify.js   # Геймификация
│   │   └── icons/          # PWA иконки
│   └── api/                # REST API endpoints
│       ├── auth.php
│       ├── events.php
│       ├── chat.php
│       ├── todos.php
│       ├── achievements.php
│       └── sse.php         # Server-Sent Events для realtime
├── src/
│   ├── Database.php        # PDO обёртка
│   ├── Auth.php            # Авторизация (JWT или сессии)
│   ├── Router.php          # Простой роутер для API
│   ├── EventModel.php      # Модель событий
│   ├── ChatModel.php       # Модель чата
│   ├── TodoModel.php       # Модель списков
│   ├── AchievementModel.php # Модель достижений
│   └── helpers.php         # Утилиты
├── migrations/
│   └── 001_init.sql        # Структура БД
└── config.php              # Конфигурация
```

---

## Структура базы данных

### Пользователи и пары

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500) DEFAULT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',  -- цвет пользователя в календаре
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE couples (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invite_code VARCHAR(32) UNIQUE NOT NULL,
    anniversary_date DATE DEFAULT NULL,     -- дата начала отношений
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE couple_members (
    couple_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('owner', 'member') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (couple_id, user_id),
    FOREIGN KEY (couple_id) REFERENCES couples(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Календарь событий

```sql
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    is_all_day BOOLEAN DEFAULT FALSE,
    color VARCHAR(7) DEFAULT NULL,       -- переопределение цвета
    category ENUM('personal', 'shared', 'date_night', 'chore', 'appointment') DEFAULT 'shared',
    recurrence_rule VARCHAR(255) DEFAULT NULL,  -- iCal RRULE формат
    reminder_minutes INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(id),
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_couple_date (couple_id, start_at)
);
```

### Чат

```sql
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    sender_id INT NOT NULL,
    text TEXT NOT NULL,
    event_id INT DEFAULT NULL,           -- привязка к событию (опционально)
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(id),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    INDEX idx_couple_created (couple_id, created_at)
);
```

### Списки дел / покупок

```sql
CREATE TABLE todo_lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('todo', 'shopping', 'wishlist') DEFAULT 'todo',
    icon VARCHAR(10) DEFAULT '📝',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(id)
);

CREATE TABLE todo_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    text VARCHAR(500) NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    assigned_to INT DEFAULT NULL,        -- кому назначено
    done_by INT DEFAULT NULL,            -- кто выполнил
    position INT DEFAULT 0,              -- порядок сортировки
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    done_at TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (list_id) REFERENCES todo_lists(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (done_by) REFERENCES users(id)
);
```

### Геймификация

```sql
-- Достижения (справочник)
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    category ENUM('calendar', 'chat', 'todos', 'relationship') NOT NULL,
    condition_type VARCHAR(50) NOT NULL,  -- тип проверки
    condition_value INT NOT NULL           -- пороговое значение
);

-- Разблокированные достижения
CREATE TABLE user_achievements (
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);

-- Стрики
CREATE TABLE streaks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    type ENUM('date_night', 'planning', 'chat', 'todos') NOT NULL,
    current_count INT DEFAULT 0,
    best_count INT DEFAULT 0,
    last_activity_date DATE DEFAULT NULL,
    FOREIGN KEY (couple_id) REFERENCES couples(id),
    UNIQUE KEY (couple_id, type)
);
```

### Примеры достижений

```sql
INSERT INTO achievements (slug, title, description, icon, category, condition_type, condition_value) VALUES
-- Календарь
('first_event', 'Первое свидание', 'Создайте первое совместное событие', '🎉', 'calendar', 'events_created', 1),
('planner_10', 'Планировщик', 'Создайте 10 совместных событий', '📅', 'calendar', 'events_created', 10),
('date_streak_4', 'Романтик', '4 свидания подряд (каждую неделю)', '💕', 'calendar', 'date_night_streak', 4),
('date_streak_12', 'Огонь страсти', '12 свиданий подряд', '🔥', 'calendar', 'date_night_streak', 12),

-- Чат
('first_message', 'На связи', 'Отправьте первое сообщение', '💬', 'chat', 'messages_sent', 1),
('chatterbox', 'Болтун', '100 сообщений в чате', '🗣️', 'chat', 'messages_sent', 100),

-- Списки
('first_todo_done', 'Помощник', 'Выполните первое дело из списка', '✅', 'todos', 'todos_completed', 1),
('todo_machine', 'Машина продуктивности', 'Выполните 50 дел', '⚡', 'todos', 'todos_completed', 50),

-- Отношения
('together_30', 'Месяц вместе', '30 дней в приложении', '🌙', 'relationship', 'days_together', 30),
('together_365', 'Год любви', '365 дней в приложении', '💍', 'relationship', 'days_together', 365),
('sync_master', 'Синхрон', 'Оба открыли приложение в один день 7 дней подряд', '🔄', 'relationship', 'both_active_streak', 7);
```

---

## Фичи MVP (v1.0)

### 🗓️ Календарь
- Месячный и недельный вид
- Цветовая кодировка: события партнёра / мои / совместные
- Создание/редактирование событий с категориями
- Напоминания (push-уведомления через Service Worker)
- Быстрое создание: «свидание», «дело», «встреча»

### 💬 Чат
- Простой мессенджер между партнёрами
- Привязка сообщений к событиям («обсудим ужин в пятницу?»)
- Realtime через SSE (Server-Sent Events)
- Непрочитанные сообщения (бейдж)

### ✅ Списки
- Список дел, покупок, вишлист
- Назначение дел партнёру
- Галочка «выполнено» с отметкой кто сделал
- Drag-and-drop сортировка

### 🏆 Геймификация
- Достижения с красивыми анимациями разблокировки
- Стрики: свидания, ежедневное планирование, общение
- Профиль пары с общей «статистикой отношений»
- Уровень пары (растёт от активности)

### 📱 PWA
- Установка на домашний экран (iOS / Android)
- Офлайн-доступ к последним событиям
- Push-уведомления о напоминаниях и сообщениях

---

## Роадмап: 4 недели до MVP

### Неделя 1: Фундамент
**~2 часа в день**

- [x] День 1-2: Настройка проекта, структура файлов, конфиг
- [x] День 3-4: База данных (миграции), модели (Database.php, Auth.php)
- [ ] День 5-6: Регистрация, авторизация, создание пары по инвайт-коду
- [ ] День 7: PWA манифест + Service Worker (базовый)

**Результат:** Можно зарегистрироваться, залогиниться, создать пару и пригласить партнёра.

### Неделя 2: Календарь
- [ ] День 1-2: API событий (CRUD — create, read, update, delete)
- [ ] День 3-4: Vue-компонент календаря (месячный вид)
- [ ] День 5-6: Создание/редактирование событий (модальное окно)
- [ ] День 7: Цветовая кодировка + категории

**Результат:** Рабочий совместный календарь — можно создавать события и видеть события партнёра.

### Неделя 3: Чат + Списки
- [ ] День 1-2: API чата + Vue-компонент
- [ ] День 3: SSE для realtime обновлений (чат + календарь)
- [ ] День 4-5: API списков + Vue-компонент
- [ ] День 6-7: Назначение дел, отметка выполнения

**Результат:** Полноценное общение + совместные списки.

### Неделя 4: Геймификация + Полировка
- [ ] День 1-2: Система достижений (проверка условий, разблокировка)
- [ ] День 3: Стрики (логика подсчёта)
- [ ] День 4: Профиль пары со статистикой
- [ ] День 5-6: Push-уведомления, офлайн-режим
- [ ] День 7: Тестирование, багфиксы, деплой

**Результат:** Готовый MVP для первых пользователей!

---

## Бесплатный / дешёвый хостинг

| Вариант | PHP | MySQL | SSL | Цена |
|---------|-----|-------|-----|------|
| **InfinityFree** | ✅ 8.x | ✅ | ✅ | Бесплатно |
| **000webhost** | ✅ | ✅ | ✅ | Бесплатно |
| **Beget** (RU) | ✅ 8.x | ✅ | ✅ | Бесплатно (тестовый) |
| **TimeWeb** (RU) | ✅ | ✅ | ✅ | ~150 руб/мес |
| **DigitalOcean** | ✅ | ✅ | ✅ | $4/мес (VPS) |

**Рекомендация для старта:** Beget (бесплатный тестовый хостинг) или InfinityFree. Когда пойдут первые пользователи — переехать на VPS.

---

## Монетизация (v2.0+)

| Фича | Бесплатно | Премиум ($2-3/мес) |
|-------|-----------|--------------------|
| Совместный календарь | ✅ | ✅ |
| Чат | ✅ | ✅ |
| 1 список дел | ✅ | ✅ |
| Безлимитные списки | ❌ | ✅ |
| Все достижения | Базовые | Все + эксклюзивные |
| Темы оформления | 1 | 10+ |
| Экспорт в Google Calendar | ❌ | ✅ |
| Напоминания через Telegram | ❌ | ✅ |
| Приоритетная поддержка | ❌ | ✅ |

---

## Где искать первых пользователей

1. **Reddit:** r/relationships, r/couples, r/productivity
2. **Product Hunt:** запуск MVP
3. **Telegram-каналы:** каналы про отношения, продуктивность
4. **TikTok / Reels:** короткие видео «как мы планируем жизнь вместе» (виральный потенциал)
5. **Пары вокруг тебя:** друзья, знакомые — первые тестировщики

---

## Следующие шаги прямо сейчас

1. **Создать репозиторий** (GitHub/GitLab)
2. **Развернуть базовую структуру проекта**
3. **Настроить БД** (запустить миграцию)
4. **Начать с auth** — регистрация + инвайт-код для пары

Готов помочь с кодом на любом этапе! 🚀
