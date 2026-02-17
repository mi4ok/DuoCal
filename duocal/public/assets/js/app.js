/**
 * Главный Vue-компонент DuoCal.
 */

const { createApp } = Vue;

createApp({
    data() {
        return {
            loaded: false,
        };
    },
    mounted() {
        this.loaded = true;
    },
    template: `
        <div id="app-root">
            <p v-if="loaded">DuoCal — приложение загружено.</p>
        </div>
    `,
}).mount('#app');
