import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

import { default as en } from '@/translation/en.json';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createI18n({ locale: 'en', fallbackLocale: 'en', messages: { en } }));

await router.isReady();
app.mount('#app');
