// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import "./style.css";

const app = createApp(App);

app.use(store);
app.use(router);

console.log('[main.js] Dispatching restoreAuthFromStorage...');
store.dispatch('restoreAuthFromStorage');

app.mount('#app');
console.log('[main.js] App mounted.');
