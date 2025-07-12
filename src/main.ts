import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { getI18n } from './stores/language';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(getI18n());

app.mount('#app');
