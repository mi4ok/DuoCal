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
        partnerTagStyle(partner) {
            if (partner === 0) {
                return { background: C.accentLight, color: C.accent };
            }
            if (partner === 1) {
                return { background: C.primaryGhost, color: C.primary };
            }
            return { background: C.partner2Bg, color: C.partner2 };
        },
        partnerTagFullStyle(partner) {
            return {
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '8px',
                fontWeight: 600,
                ...this.partnerTagStyle(partner),
            };
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
        btnIconStyle() {
            return {
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid ' + C.borderLight,
                background: C.surface,
                color: C.textMid,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
            };
        },
        btnTodayStyle() {
            return {
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid ' + C.borderLight,
                background: C.primary,
                color: C.textWhite,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
            };
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
<div class="duocal-app" :style="{ minHeight: '100vh', background: C.bg, fontFamily: C.font, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }">
  <div class="duocal-phone" :style="{
    width: '390px', minHeight: '720px', background: C.bg, borderRadius: '36px',
    border: '3px solid ' + C.border, boxShadow: C.shadowLg + ', 0 0 0 1px ' + C.borderLight,
    overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative'
  }">
    <!-- Status bar -->
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px 6px', fontSize: '13px', fontWeight: 600 }">
      <span :style="{ color: C.text }">9:41</span>
      <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
        <span :style="{ fontFamily: C.fontDisplay, fontWeight: 600, color: C.primary, fontSize: '15px' }">DuoCal</span>
        <span style="font-size: 14px">🌊</span>
      </div>
      <div :style="{ width: '28px', height: '28px', borderRadius: '50%', background: C.partner2 + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }">🌸</div>
    </div>

    <!-- Toast -->
    <div v-if="showNotif" class="duocal-toast" :style="{
      position: 'absolute', top: '56px', left: '16px', right: '16px', background: C.surface, borderRadius: '14px', padding: '12px 16px',
      boxShadow: C.shadowLg, border: '1px solid ' + C.borderLight, display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10
    }">
      <span style="font-size: 20px">🎉</span>
      <div style="flex: 1">
        <div :style="{ fontSize: '13px', fontWeight: 700, color: C.text }">Новая ачивка!</div>
        <div :style="{ fontSize: '12px', color: C.textLight }">«Свидание» — событие с тегом 💕</div>
      </div>
      <button @click="closeNotif" :style="{ background: 'none', border: 'none', color: C.textLight, fontSize: '16px', cursor: 'pointer', padding: '4px' }">✕</button>
    </div>

    <!-- Content -->
    <div :style="{ flex: 1, padding: '12px 18px 8px', overflowY: 'auto' }">
      <!-- Calendar -->
      <div v-if="activeTab === 'calendar'" style="display: flex; flex-direction: column; gap: 14px">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>
            <h2 :style="{ fontFamily: C.fontDisplay, fontSize: '24px', fontWeight: 600, color: C.text, margin: 0 }">Февраль</h2>
            <span :style="{ fontSize: '13px', color: C.textLight }">2026</span>
          </div>
          <div style="display: flex; gap: 6px">
            <button :style="btnIconStyle()">‹</button>
            <button :style="btnTodayStyle()">Сегодня</button>
            <button :style="btnIconStyle()">›</button>
          </div>
        </div>
        <div :style="{ background: C.surface, borderRadius: '16px', padding: '16px', boxShadow: C.shadow, border: '1px solid ' + C.borderLight }">
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center">
            <div v-for="d in daysOfWeek" :key="d" :style="{ fontSize: '12px', color: C.textLight, padding: '6px 0', fontWeight: 700 }">{{ d }}</div>
            <div v-for="(day, i) in calendarDays" :key="i"
                 @click="day.cur && setSelectedDay(day.d)"
                 :style="{
                   padding: '6px 2px 4px', borderRadius: '10px', fontSize: '14px',
                   fontWeight: (isToday(day.d, day.cur) || isSelected(day.d, day.cur)) ? 700 : 500,
                   color: !day.cur ? C.border : isSelected(day.d, day.cur) ? C.textWhite : isToday(day.d, day.cur) ? C.primary : C.text,
                   background: isSelected(day.d, day.cur) ? C.primary : (isToday(day.d, day.cur) && !isSelected(day.d, day.cur)) ? C.primaryGhost : 'transparent',
                   cursor: day.cur ? 'pointer' : 'default', transition: 'all 0.15s ease'
                 }">
              {{ day.d }}
              <div v-if="hasEvent(day) && !isSelected(day.d, day.cur)" style="display: flex; gap: 2px; justify-content: center; margin-top: 2px">
                <div v-for="(e, j) in dayEventsFor(day).slice(0, 3)" :key="j" :style="{ width: '5px', height: '5px', borderRadius: '50%', background: e.partner === 0 ? C.accent : e.partner === 1 ? C.partner1 : C.partner2 }"></div>
              </div>
              <div v-if="isSelected(day.d, day.cur) && hasEvent(day)" style="display: flex; gap: 2px; justify-content: center; margin-top: 2px">
                <div v-for="(_, j) in dayEventsFor(day).slice(0, 3)" :key="j" :style="{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.7)' }"></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div :style="{ fontSize: '13px', color: C.textLight, marginBottom: '8px', fontWeight: 600 }">{{ selectedDay }} февраля {{ selectedDay === 17 ? '· сегодня' : '' }}</div>
          <div v-if="dayEvents.length === 0" :style="{ background: C.surface, borderRadius: '14px', padding: '24px', textAlign: 'center', border: '1px solid ' + C.borderLight }">
            <div style="font-size: 28px; margin-bottom: 6px">🌤️</div>
            <div :style="{ color: C.textLight, fontSize: '14px' }">Свободный день</div>
            <button :style="{ marginTop: '10px', padding: '8px 16px', borderRadius: '10px', background: C.primaryLight, color: C.primary, border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }">+ Добавить событие</button>
          </div>
          <div v-else style="display: flex; flex-direction: column; gap: 8px">
            <div v-for="(evt, i) in dayEvents" :key="i"
                 :style="{ background: C.surface, borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: C.shadow, border: '1px solid ' + C.borderLight, cursor: 'pointer', borderLeft: '4px solid ' + (evt.partner === 0 ? C.accent : evt.partner === 1 ? C.partner1 : C.partner2) }">
              <span style="font-size: 22px">{{ evt.icon }}</span>
              <div style="flex: 1">
                <div :style="{ fontSize: '14px', fontWeight: 600, color: C.text }">{{ evt.title }}</div>
                <div :style="{ fontSize: '12px', color: C.textLight }">{{ evt.time }}</div>
              </div>
              <div :style="partnerTagFullStyle(evt.partner)">{{ partnerLabel(evt.partner) }}</div>
            </div>
            <button :style="{ padding: '12px', borderRadius: '14px', border: '2px dashed ' + C.border, background: 'transparent', color: C.textLight, fontSize: '14px', cursor: 'pointer', fontWeight: 500 }">+ Добавить событие</button>
          </div>
        </div>
        <div :style="{ background: 'linear-gradient(135deg, ' + C.primary + ', ' + C.secondary + ')', borderRadius: '14px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: C.textWhite }">
          <div style="display: flex; align-items: center; gap: 8px">
            <span style="font-size: 22px">🔥</span>
            <div>
              <div style="font-size: 16px; font-weight: 700">12 дней</div>
              <div style="font-size: 11px; opacity: 0.85">стрик планирования</div>
            </div>
          </div>
          <div style="display: flex; gap: 3px">
            <div v-for="i in 7" :key="i" :style="{ width: '8px', height: '22px', borderRadius: '4px', background: i <= 5 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)' }"></div>
          </div>
        </div>
      </div>

      <!-- Chat -->
      <div v-if="activeTab === 'chat'" style="display: flex; flex-direction: column; height: 100%">
        <div style="margin-bottom: 12px">
          <h2 :style="{ fontFamily: C.fontDisplay, fontSize: '22px', fontWeight: 600, color: C.text, margin: 0 }">Чат</h2>
          <div style="display: flex; gap: 8px; margin-top: 8px">
            <button :style="{ padding: '8px 14px', borderRadius: '10px', background: C.primary, color: C.textWhite, border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }">Общий</button>
            <button :style="{ padding: '8px 14px', borderRadius: '10px', background: C.bgAlt, color: C.textMid, border: '1px solid ' + C.borderLight, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }">📅 Ужин у родителей</button>
            <button :style="{ padding: '8px 14px', borderRadius: '10px', background: C.bgAlt, color: C.textMid, border: '1px solid ' + C.borderLight, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }">📅 Поездка</button>
          </div>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; padding-right: 4px">
          <div style="text-align: center; font-size: 12px; color: C.textLight; padding: 8px 0"><span :style="{ background: C.bgAlt, padding: '4px 12px', borderRadius: '10px' }">Сегодня</span></div>
          <div v-for="(m, i) in chatData" :key="i" :style="{ display: 'flex', flexDirection: m.me ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end' }">
            <div v-if="!m.me" :style="{ width: '32px', height: '32px', borderRadius: '50%', background: C.partner2 + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }">{{ m.avatar }}</div>
            <div style="max-width: 75%">
              <div v-if="!m.me" :style="{ fontSize: '11px', color: C.partner2, fontWeight: 600, marginBottom: '2px', marginLeft: '4px' }">{{ m.name }}</div>
              <div :style="{ background: m.me ? C.primary : C.surface, color: m.me ? C.textWhite : C.text, padding: '10px 14px', fontSize: '14px', lineHeight: 1.45, borderRadius: m.me ? '14px 14px 4px 14px' : '14px 14px 14px 4px', boxShadow: m.me ? 'none' : C.shadow, border: m.me ? 'none' : '1px solid ' + C.borderLight }">{{ m.text }}</div>
              <div :style="{ fontSize: '10px', color: C.textLight, marginTop: '3px', textAlign: m.me ? 'right' : 'left', paddingInline: '4px' }">{{ m.time }} {{ m.me ? '✓✓' : '' }}</div>
            </div>
          </div>
        </div>
        <div :style="{ display: 'flex', gap: '8px', marginTop: '12px', background: C.surface, borderRadius: '14px', padding: '6px', boxShadow: C.shadow, border: '1px solid ' + C.borderLight }">
          <input v-model="chatMsg" placeholder="Написать сообщение..." :style="{ flex: 1, border: 'none', outline: 'none', padding: '10px 12px', fontSize: '14px', color: C.text, background: 'transparent', borderRadius: '10px' }">
          <button :style="{ width: '40px', height: '40px', borderRadius: '10px', background: C.primary, border: 'none', color: C.textWhite, fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }">↑</button>
        </div>
      </div>

      <!-- Lists -->
      <div v-if="activeTab === 'lists'" style="display: flex; flex-direction: column; gap: 14px">
        <h2 :style="{ fontFamily: C.fontDisplay, fontSize: '22px', fontWeight: 600, color: C.text, margin: 0 }">Списки</h2>
        <div style="display: flex; gap: 8px; overflow-x: auto">
          <button v-for="(l, i) in lists" :key="l.id" @click="activeListIdx = i"
                  :style="{ padding: '8px 14px', borderRadius: '10px', background: i === activeListIdx ? C.primary : C.surface, color: i === activeListIdx ? C.textWhite : C.text, border: i === activeListIdx ? '1px solid ' + C.primary : '1px solid ' + C.borderLight, boxShadow: i === activeListIdx ? C.shadow : 'none', whiteSpace: 'nowrap', cursor: 'pointer', fontWeight: 600 }">{{ l.icon }} {{ l.title }}</button>
        </div>
        <div :style="{ background: C.surface, borderRadius: '14px', padding: '16px', boxShadow: C.shadow, border: '1px solid ' + C.borderLight }">
          <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }">
            <span :style="{ fontSize: '13px', color: C.textLight }">Прогресс</span>
            <span :style="{ fontSize: '13px', fontWeight: 700, color: C.primary }">{{ listDoneCount }}/{{ activeList.items.length }}</span>
          </div>
          <div :style="{ height: '8px', borderRadius: '4px', background: C.bgAlt, overflow: 'hidden' }">
            <div :style="{ height: '100%', borderRadius: '4px', width: listProgress + '%', background: 'linear-gradient(90deg, ' + C.primary + ', ' + C.secondary + ')', transition: 'width 0.4s ease' }"></div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px">
          <div v-for="(item, i) in activeList.items" :key="i" @click="toggleItem(activeListIdx, i)"
               :style="{ background: C.surface, borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: C.shadow, border: '1px solid ' + C.borderLight, cursor: 'pointer', transition: 'all 0.2s', opacity: item.done ? 0.65 : 1 }">
            <div :style="{ width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0, border: item.done ? 'none' : '2px solid ' + C.border, background: item.done ? C.success : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textWhite, fontSize: '13px', fontWeight: 700 }">{{ item.done ? '✓' : '' }}</div>
            <span :style="{ fontSize: '14px', color: item.done ? C.textLight : C.text, textDecoration: item.done ? 'line-through' : 'none', fontWeight: 500 }">{{ item.text }}</span>
          </div>
          <button :style="{ padding: '14px', borderRadius: '12px', border: '2px dashed ' + C.border, background: 'transparent', color: C.textLight, fontSize: '14px', cursor: 'pointer', fontWeight: 500 }">+ Добавить пункт</button>
        </div>
      </div>

      <!-- Achievements -->
      <div v-if="activeTab === 'achievements'" style="display: flex; flex-direction: column; gap: 16px">
        <h2 :style="{ fontFamily: C.fontDisplay, fontSize: '22px', fontWeight: 600, color: C.text, margin: 0 }">Достижения</h2>
        <div :style="{ background: 'linear-gradient(135deg, ' + C.primary + ', ' + C.primaryDark + ')', borderRadius: '16px', padding: '20px', color: C.textWhite }">
          <div :style="{ fontSize: '13px', opacity: 0.85, marginBottom: '12px', fontWeight: 600 }">Ваши стрики</div>
          <div style="display: flex; justify-content: space-between">
            <div style="text-align: center"><div style="font-size: 26px; margin-bottom: 4px">🔥</div><div style="font-size: 22px; font-weight: 800">12</div><div style="font-size: 11px; opacity: 0.8">дней</div><div style="font-size: 11px; opacity: 0.6; margin-top: 2px">Планирование</div></div>
            <div style="text-align: center"><div style="font-size: 26px; margin-bottom: 4px">💬</div><div style="font-size: 22px; font-weight: 800">8</div><div style="font-size: 11px; opacity: 0.8">дней</div><div style="font-size: 11px; opacity: 0.6; margin-top: 2px">На связи</div></div>
            <div style="text-align: center"><div style="font-size: 26px; margin-bottom: 4px">💕</div><div style="font-size: 22px; font-weight: 800">3</div><div style="font-size: 11px; opacity: 0.8">недели</div><div style="font-size: 11px; opacity: 0.6; margin-top: 2px">Вместе</div></div>
          </div>
        </div>
        <div>
          <div :style="{ fontSize: '13px', color: C.textLight, fontWeight: 600, marginBottom: '8px' }">Разблокировано · {{ unlockedAchievements.length }}/{{ achievementsData.length }}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
            <div v-for="(a, i) in unlockedAchievements" :key="'u'+i" :style="{ background: C.surface, borderRadius: '14px', padding: '14px', boxShadow: C.shadow, border: '1px solid ' + C.borderLight, display: 'flex', gap: '10px', alignItems: 'center' }">
              <div :style="{ width: '42px', height: '42px', borderRadius: '12px', background: C.primaryGhost, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }">{{ a.icon }}</div>
              <div><div :style="{ fontSize: '13px', fontWeight: 700, color: C.text }">{{ a.title }}</div><div :style="{ fontSize: '11px', color: C.textLight }">{{ a.desc }}</div></div>
            </div>
          </div>
        </div>
        <div>
          <div :style="{ fontSize: '13px', color: C.textLight, fontWeight: 600, marginBottom: '8px' }">Впереди</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
            <div v-for="(a, i) in lockedAchievements" :key="'l'+i" :style="{ background: C.bgAlt, borderRadius: '14px', padding: '14px', border: '1px solid ' + C.borderLight, display: 'flex', gap: '10px', alignItems: 'center', opacity: 0.6 }">
              <div :style="{ width: '42px', height: '42px', borderRadius: '12px', background: C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0, filter: 'grayscale(1)' }">{{ a.icon }}</div>
              <div><div :style="{ fontSize: '13px', fontWeight: 700, color: C.textMid }">{{ a.title }}</div><div :style="{ fontSize: '11px', color: C.textLight }">{{ a.desc }}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom nav -->
    <div :style="{ display: 'flex', justifyContent: 'space-around', padding: '8px 12px 18px', background: C.surface, borderTop: '1px solid ' + C.borderLight }">
      <button v-for="tab in tabs" :key="tab.id" @click="setTab(tab.id)"
              :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: '12px', transition: 'all 0.2s', position: 'relative' }">
        <div :style="{ fontSize: '20px', padding: '4px 14px', borderRadius: '10px', background: activeTab === tab.id ? C.primaryGhost : 'transparent' }">{{ tab.icon }}</div>
        <span :style="{ fontSize: '11px', fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? C.primary : C.textLight }">{{ tab.label }}</span>
        <div v-if="tab.id === 'chat'" :style="{ position: 'absolute', marginTop: '-18px', marginLeft: '18px', width: '8px', height: '8px', borderRadius: '50%', background: C.partner2, border: '2px solid ' + C.surface }"></div>
      </button>
    </div>
  </div>
</div>
    `,
}).mount('#app');
