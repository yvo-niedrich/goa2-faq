import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

import { default as en } from '@/translation/en.json';
import { default as de } from '@/translation/de.json';

import App from './App.vue';
import router from './router';
import { useLanguageStore } from './stores/language';

const app = createApp(App);

app.use(createPinia());
app.use(router);

const { language } = useLanguageStore();
app.use(createI18n({ locale: language, fallbackLocale: 'en', messages: { en, de } }));

// await router.isReady();
app.mount('#app');
