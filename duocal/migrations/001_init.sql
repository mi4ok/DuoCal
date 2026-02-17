-- DuoCal: начальная структура БД
-- Запуск: mysql -u user -p duocal < migrations/001_init.sql

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500) DEFAULT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE couples (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invite_code VARCHAR(32) UNIQUE NOT NULL,
    anniversary_date DATE DEFAULT NULL,
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

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    is_all_day BOOLEAN DEFAULT FALSE,
    color VARCHAR(7) DEFAULT NULL,
    category ENUM('personal', 'shared', 'date_night', 'chore', 'appointment') DEFAULT 'shared',
    recurrence_rule VARCHAR(255) DEFAULT NULL,
    reminder_minutes INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(id),
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_couple_date (couple_id, start_at)
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    sender_id INT NOT NULL,
    text TEXT NOT NULL,
    event_id INT DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(id),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    INDEX idx_couple_created (couple_id, created_at)
);

CREATE TABLE todo_lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('todo', 'shopping', 'wishlist') DEFAULT 'todo',
    icon VARCHAR(10) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(id)
);

CREATE TABLE todo_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    text VARCHAR(500) NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    assigned_to INT DEFAULT NULL,
    done_by INT DEFAULT NULL,
    position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    done_at TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (list_id) REFERENCES todo_lists(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (done_by) REFERENCES users(id)
);

CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    category ENUM('calendar', 'chat', 'todos', 'relationship') NOT NULL,
    condition_type VARCHAR(50) NOT NULL,
    condition_value INT NOT NULL
);

CREATE TABLE user_achievements (
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);

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

INSERT INTO achievements (slug, title, description, icon, category, condition_type, condition_value) VALUES
('first_event', 'Первое свидание', 'Создайте первое совместное событие', '🎉', 'calendar', 'events_created', 1),
('planner_10', 'Планировщик', 'Создайте 10 совместных событий', '📅', 'calendar', 'events_created', 10),
('date_streak_4', 'Романтик', '4 свидания подряд (каждую неделю)', '💕', 'calendar', 'date_night_streak', 4),
('date_streak_12', 'Огонь страсти', '12 свиданий подряд', '🔥', 'calendar', 'date_night_streak', 12),
('first_message', 'На связи', 'Отправьте первое сообщение', '💬', 'chat', 'messages_sent', 1),
('chatterbox', 'Болтун', '100 сообщений в чате', '🗣️', 'chat', 'messages_sent', 100),
('first_todo_done', 'Помощник', 'Выполните первое дело из списка', '✅', 'todos', 'todos_completed', 1),
('todo_machine', 'Машина продуктивности', 'Выполните 50 дел', '⚡', 'todos', 'todos_completed', 50),
('together_30', 'Месяц вместе', '30 дней в приложении', '🌙', 'relationship', 'days_together', 30),
('together_365', 'Год любви', '365 дней в приложении', '💍', 'relationship', 'days_together', 365),
('sync_master', 'Синхрон', 'Оба открыли приложение в один день 7 дней подряд', '🔄', 'relationship', 'both_active_streak', 7);
