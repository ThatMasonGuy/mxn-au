// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import "./style.css";
import echartsPlugin from '@/shared/plugins/echarts';

const app = createApp(App);
app.use(echartsPlugin);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(router);
app.mount('#app');
