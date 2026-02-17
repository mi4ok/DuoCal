/**
 * DuoCal — интерактивный прототип в стиле «Морская свежесть».
 * Vue 3 (CDN), без сборки.
 */

const { createApp } = Vue;

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const CALENDAR_DAYS = [
    { d: 26, cur: false }, { d: 27, cur: false }, { d: 28, cur: false }, { d: 29, cur: false },
    { d: 30, cur: false }, { d: 31, cur: false }, { d: 1, cur: true },
    { d: 2, cur: true }, { d: 3, cur: true }, { d: 4, cur: true }, { d: 5, cur: true },
    { d: 6, cur: true }, { d: 7, cur: true }, { d: 8, cur: true },
    { d: 9, cur: true }, { d: 10, cur: true }, { d: 11, cur: true }, { d: 12, cur: true },
    { d: 13, cur: true }, { d: 14, cur: true }, { d: 15, cur: true },
    { d: 16, cur: true }, { d: 17, cur: true }, { d: 18, cur: true }, { d: 19, cur: true },
    { d: 20, cur: true }, { d: 21, cur: true }, { d: 22, cur: true },
    { d: 23, cur: true }, { d: 24, cur: true }, { d: 25, cur: true }, { d: 26, cur: true },
    { d: 27, cur: true }, { d: 28, cur: true }, { d: 1, cur: false },
];

const EVENTS_DATA = [
    { day: 3, title: 'Стоматолог', time: '10:00', partner: 2, icon: '🦷' },
    { day: 5, title: 'Ужин у родителей', time: '18:00', partner: 0, icon: '🍽️' },
    { day: 8, title: 'Кино: Дюна 3', time: '19:30', partner: 0, icon: '🎬' },
    { day: 10, title: 'Созвон с Петей', time: '15:00', partner: 1, icon: '📞' },
    { day: 14, title: 'День Валентина 💕', time: '19:00', partner: 0, icon: '💕' },
    { day: 17, title: 'Йога', time: '08:00', partner: 2, icon: '🧘' },
    { day: 17, title: 'Встреча с дизайнером', time: '14:00', partner: 1, icon: '💻' },
    { day: 19, title: 'Поход в бассейн', time: '11:00', partner: 0, icon: '🏊' },
    { day: 22, title: 'Поездка за город', time: '09:00', partner: 0, icon: '🚗' },
    { day: 25, title: 'ТО машины', time: '10:00', partner: 1, icon: '🔧' },
    { day: 27, title: 'День рождения Маши', time: '18:00', partner: 0, icon: '🎂' },
];

const CHAT_DATA = [
    { name: 'Аня', text: 'Привет! Во сколько завтра к маме едем?', time: '14:22', me: false, avatar: '🌸' },
    { name: 'Ты', text: 'Давай к 15, заеду за тобой после работы', time: '14:25', me: true, avatar: '🌊' },
    { name: 'Аня', text: 'Отлично! Надо ещё торт купить по дороге 🎂', time: '14:26', me: false, avatar: '🌸' },
    { name: 'Ты', text: 'Точно! Добавил в список покупок', time: '14:28', me: true, avatar: '🌊' },
    { name: 'Аня', text: 'Ты лучший 😊', time: '14:29', me: false, avatar: '🌸' },
    { name: 'Аня', text: 'Кстати, на выходных поедем за город?', time: '14:45', me: false, avatar: '🌸' },
    { name: 'Ты', text: 'Да, уже добавил в календарь на субботу!', time: '14:47', me: true, avatar: '🌊' },
];

const LISTS_DATA_INIT = [
    {
        id: 1,
        title: 'Продукты',
        type: 'shopping',
        icon: '🛒',
        items: [
            { text: 'Молоко', done: true },
            { text: 'Хлеб', done: true },
            { text: 'Торт для мамы', done: false },
            { text: 'Сыр', done: false },
            { text: 'Помидоры', done: false },
        ],
    },
    {
        id: 2,
        title: 'Дела на неделю',
        type: 'todo',
        icon: '✅',
        items: [
            { text: 'Записаться к врачу', done: true },
            { text: 'Оплатить ЖКХ', done: true },
            { text: 'Забрать посылку', done: false },
            { text: 'Позвонить в страховую', done: false },
        ],
    },
    {
        id: 3,
        title: 'Поездка за город',
        type: 'todo',
        icon: '🚗',
        items: [
            { text: 'Забронировать домик', done: false },
            { text: 'Собрать вещи', done: false },
            { text: 'Купить уголь для мангала', done: false },
        ],
    },
];

const ACHIEVEMENTS_DATA = [
    { icon: '🎯', title: 'Первый шаг', desc: 'Создали первое событие', unlocked: true },
    { icon: '🔥', title: 'Неделя вместе', desc: '7 дней стрика планирования', unlocked: true },
    { icon: '💬', title: 'На связи', desc: 'Первое сообщение в чате', unlocked: true },
    { icon: '📝', title: 'Список пошёл', desc: 'Создали первый список', unlocked: true },
    { icon: '✅', title: 'Всё сделано!', desc: 'Завершили все дела в списке', unlocked: true },
    { icon: '💕', title: 'Свидание', desc: 'Событие с тегом «свидание»', unlocked: true },
    { icon: '⚡', title: 'Месяц синхронизации', desc: '30 дней стрика', unlocked: false },
    { icon: '💯', title: 'Сотня планов', desc: '100 событий в календаре', unlocked: false },
    { icon: '🗣️', title: 'Болтуны', desc: '50 сообщений в чате', unlocked: false },
    { icon: '🎂', title: 'Годовщина', desc: '365 дней в приложении', unlocked: false },
];

const C = {
    bg: '#F4F9FB',
    bgAlt: '#E8F4F8',
    surface: '#FFFFFF',
    primary: '#2B8A9E',
    font: "'Nunito', sans-serif",
    fontDisplay: "'Fraunces', serif",
    primaryDark: '#1F6F80',
    primaryLight: '#D1EDF3',
    primaryGhost: '#E8F6FA',
    secondary: '#5FBDCF',
    accent: '#F0A050',
    accentLight: '#FFF0DC',
    text: '#1A3A4A',
    textMid: '#3D6070',
    textLight: '#6B8A96',
    textWhite: '#FFFFFF',
    border: '#D4E8EE',
    borderLight: '#E8F1F5',
    success: '#4CAF6E',
    successLight: '#E2F5E9',
    partner1: '#2B8A9E',
    partner2: '#E07A5F',
    partner2Bg: '#FDE8E2',
    shadow: '0 2px 12px rgba(43,138,158,0.08)',
    shadowLg: '0 8px 30px rgba(43,138,158,0.12)',
};

const TABS = [
    { id: 'calendar', icon: '📅', label: 'Календарь' },
    { id: 'chat', icon: '💬', label: 'Чат' },
    { id: 'lists', icon: '📝', label: 'Списки' },
    { id: 'achievements', icon: '⚡', label: 'Ачивки' },
];

function deepCloneLists() {
    return LISTS_DATA_INIT.map(list => ({
        ...list,
        items: list.items.map(item => ({ ...item })),
    }));
}

createApp({
    data() {
        return {
            C,
            tabs: TABS,
            daysOfWeek: DAYS_OF_WEEK,
            calendarDays: CALENDAR_DAYS,
            eventsData: EVENTS_DATA,
            chatData: CHAT_DATA,
            achievementsData: ACHIEVEMENTS_DATA,
            activeTab: 'calendar',
            selectedDay: 17,
            showNotif: true,
            chatMsg: '',
            lists: deepCloneLists(),
            activeListIdx: 0,
        };
    },
    computed: {
        dayEvents() {
            return this.eventsData.filter(e => e.day === this.selectedDay);
        },
        activeList() {
            return this.lists[this.activeListIdx] || this.lists[0];
        },
        listProgress() {
            const list = this.activeList;
            if (!list || !list.items.length) {
                return 0;
            }
            const done = list.items.filter(i => i.done).length;
            return (done / list.items.length) * 100;
        },
        listDoneCount() {
            return this.activeList.items.filter(i => i.done).length;
        },
        unlockedAchievements() {
            return this.achievementsData.filter(a => a.unlocked);
        },
        lockedAchievements() {
            return this.achievementsData.filter(a => !a.unlocked);
        },
    },
    methods: {
        setSelectedDay(d) {
            this.selectedDay = d;
        },
        setTab(id) {
            this.activeTab = id;
        },
        toggleItem(listIdx, itemIdx) {
            const item = this.lists[listIdx].items[itemIdx];
            item.done = !item.done;
        },
        closeNotif() {
            this.showNotif = false;
        },
        partnerLabel(partner) {
            if (partner === 0) {
                return 'вместе';
            }
            if (partner === 1) {
                return 'ты';
            }
            return 'Аня';
        },
        isToday(d, cur) {
            return d === 17 && cur;
        },
        isSelected(d, cur) {
            return d === this.selectedDay && cur;
        },
        hasEvent(day) {
            return day.cur && this.eventsData.some(e => e.day === day.d);
        },
        dayEventsFor(day) {
            return day.cur ? this.eventsData.filter(e => e.day === day.d) : [];
        },
    },
    mounted() {
        const t = setTimeout(() => {
            this.showNotif = false;
        }, 4000);
        this._notifTimer = t;
    },
    beforeUnmount() {
        if (this._notifTimer) {
            clearTimeout(this._notifTimer);
        }
    },
    template: `
<div class="duocal-app">
  <header>
    <span class="logo">DuoCal</span>
    <div class="avatar">🌸</div>
  </header>

  <div v-if="showNotif" class="duocal-toast">
    <span style="font-size: 20px">🎉</span>
    <div style="flex: 1">
      <div class="toast-title">Новая ачивка!</div>
      <div class="text-muted" style="font-size: 12px">«Свидание» — событие с тегом 💕</div>
    </div>
    <button type="button" @click="closeNotif" class="toast-close">✕</button>
  </div>

  <main>
    <!-- Calendar -->
    <div v-if="activeTab === 'calendar'" class="duocal-section">
      <div class="cal-header">
        <div>
          <h2>Февраль</h2>
          <span class="cal-year">2026</span>
        </div>
        <div class="cal-actions">
          <button type="button" class="btn-icon">‹</button>
          <button type="button" class="btn-today">Сегодня</button>
          <button type="button" class="btn-icon">›</button>
        </div>
      </div>
      <div class="cal-grid">
        <div class="cal-weekdays">
          <span v-for="d in daysOfWeek" :key="d">{{ d }}</span>
        </div>
        <div class="cal-days">
          <div v-for="(day, i) in calendarDays" :key="i"
               @click="day.cur && setSelectedDay(day.d)"
               class="cal-day"
               :class="{
                 'cal-day--other': !day.cur,
                 'cal-day--today': isToday(day.d, day.cur) && !isSelected(day.d, day.cur),
                 'cal-day--selected': isSelected(day.d, day.cur)
               }">
            {{ day.d }}
            <div v-if="hasEvent(day)" class="cal-day-dots">
              <span v-for="(e, j) in dayEventsFor(day).slice(0, 3)" :key="j" :style="!isSelected(day.d, day.cur) ? (e.partner === 0 ? { background: 'var(--accent)' } : e.partner === 1 ? { background: 'var(--partner1)' } : { background: 'var(--partner2)' }) : {}"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="cal-day-label">{{ selectedDay }} февраля {{ selectedDay === 17 ? '· сегодня' : '' }}</div>
      <div v-if="dayEvents.length === 0" class="cal-empty">
        <div class="empty-icon">🌤️</div>
        <div class="empty-text">Свободный день</div>
        <button type="button" class="btn-add-event">+ Добавить событие</button>
      </div>
      <div v-else style="display: flex; flex-direction: column; gap: 8px">
        <div v-for="(evt, i) in dayEvents" :key="i" class="cal-event" :class="'cal-event--partner' + evt.partner">
          <span class="event-icon">{{ evt.icon }}</span>
          <div style="flex: 1">
            <div class="event-title">{{ evt.title }}</div>
            <div class="event-time">{{ evt.time }}</div>
          </div>
          <span class="event-tag" :class="'tag-partner-' + evt.partner">{{ partnerLabel(evt.partner) }}</span>
        </div>
        <button type="button" class="btn-add-dashed">+ Добавить событие</button>
      </div>
      <div class="streak-bar">
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="font-size: 22px">🔥</span>
          <div>
            <div class="streak-label">12 дней</div>
            <div class="streak-sublabel">стрик планирования</div>
          </div>
        </div>
        <div class="streak-chart">
          <span v-for="i in 7" :key="i" :class="i <= 5 ? 'filled' : 'empty'"></span>
        </div>
      </div>
    </div>

    <!-- Chat -->
    <div v-if="activeTab === 'chat'" class="duocal-section duocal-section--chat">
      <div style="margin-bottom: 12px">
        <h2 class="screen-title">Чат</h2>
        <div class="chat-chips">
          <button type="button" class="chip chip--active">Общий</button>
          <button type="button" class="chip">📅 Ужин у родителей</button>
          <button type="button" class="chip">📅 Поездка</button>
        </div>
      </div>
      <div class="chat-messages">
        <div class="chat-date"><span>Сегодня</span></div>
        <div v-for="(m, i) in chatData" :key="i" class="chat-row" :class="{ 'chat-row--me': m.me }">
          <div v-if="!m.me" class="chat-avatar">{{ m.avatar }}</div>
          <div style="max-width: 75%">
            <div v-if="!m.me" class="chat-name">{{ m.name }}</div>
            <div class="chat-bubble" :class="m.me ? 'chat-bubble--me' : 'chat-bubble--them'">{{ m.text }}</div>
            <div class="chat-time" :class="{ 'chat-time--me': m.me }">{{ m.time }} {{ m.me ? '✓✓' : '' }}</div>
          </div>
        </div>
      </div>
      <div class="chat-input-wrap">
        <input v-model="chatMsg" placeholder="Написать сообщение...">
        <button type="button" class="btn-send">↑</button>
      </div>
    </div>

    <!-- Lists -->
    <div v-if="activeTab === 'lists'" class="duocal-section duocal-section--lists">
      <h2 class="screen-title">Списки</h2>
      <div class="list-tabs">
        <button v-for="(l, i) in lists" :key="l.id" type="button" class="list-tab" :class="{ 'is-active': i === activeListIdx }" @click="activeListIdx = i">{{ l.icon }} {{ l.title }}</button>
      </div>
      <div class="list-progress-wrap">
        <div class="list-progress-header">
          <span class="muted">Прогресс</span>
          <span class="value">{{ listDoneCount }}/{{ activeList.items.length }}</span>
        </div>
        <div class="list-progress-bar">
          <div class="list-progress-fill" :style="{ width: listProgress + '%' }"></div>
        </div>
      </div>
      <div class="list-items">
        <div v-for="(item, i) in activeList.items" :key="i" class="list-item" :class="{ 'is-done': item.done }" @click="toggleItem(activeListIdx, i)">
          <div class="item-check">{{ item.done ? '✓' : '' }}</div>
          <span class="item-text">{{ item.text }}</span>
        </div>
        <button type="button" class="btn-add-dashed">+ Добавить пункт</button>
      </div>
    </div>

    <!-- Achievements -->
    <div v-if="activeTab === 'achievements'" class="duocal-section duocal-section--achievements">
      <h2 class="screen-title">Достижения</h2>
      <div class="ach-streaks">
        <div class="subtitle">Ваши стрики</div>
        <div class="streaks-row">
          <div class="streak-item"><div class="icon">🔥</div><div class="count">12</div><div class="unit">дней</div><div style="font-size: 11px; opacity: 0.6; margin-top: 2px">Планирование</div></div>
          <div class="streak-item"><div class="icon">💬</div><div class="count">8</div><div class="unit">дней</div><div style="font-size: 11px; opacity: 0.6; margin-top: 2px">На связи</div></div>
          <div class="streak-item"><div class="icon">💕</div><div class="count">3</div><div class="unit">недели</div><div style="font-size: 11px; opacity: 0.6; margin-top: 2px">Вместе</div></div>
        </div>
      </div>
      <div class="ach-section-title">Разблокировано · {{ unlockedAchievements.length }}/{{ achievementsData.length }}</div>
      <div class="ach-grid">
        <div v-for="(a, i) in unlockedAchievements" :key="'u'+i" class="ach-card">
          <div class="ach-icon">{{ a.icon }}</div>
          <div><div class="ach-title">{{ a.title }}</div><div class="ach-desc">{{ a.desc }}</div></div>
        </div>
      </div>
      <div class="ach-section-title">Впереди</div>
      <div class="ach-grid">
        <div v-for="(a, i) in lockedAchievements" :key="'l'+i" class="ach-card ach-card--locked">
          <div class="ach-icon">{{ a.icon }}</div>
          <div><div class="ach-title">{{ a.title }}</div><div class="ach-desc">{{ a.desc }}</div></div>
        </div>
      </div>
    </div>
  </main>

  <nav>
    <button v-for="tab in tabs" :key="tab.id" type="button" :class="{ 'is-active': activeTab === tab.id }" @click="setTab(tab.id)">
      <div class="tab-icon">{{ tab.icon }}</div>
      <span class="tab-label">{{ tab.label }}</span>
      <div v-if="tab.id === 'chat'" class="tab-badge"></div>
    </button>
  </nav>
</div>
    `,
}).mount('#app');
