// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './stores';
import "./style.css";

const app = createApp(App);

app.use(store);
app.use(router);

store.dispatch('restoreAuthFromStorage');

app.mount('#app');