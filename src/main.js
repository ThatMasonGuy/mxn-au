// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { initAuth } from '@/utils/authInit'

import 'flag-icons/css/flag-icons.min.css'
import "./style.css";
import VueECharts from 'vue-echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, ScatterChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  BarChart,
  LineChart,
  ScatterChart,
  PieChart,
  CanvasRenderer
]);

const app = createApp(App);
app.component('v-chart', VueECharts);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

(async () => {
  await initAuth(router)

  app.use(router)
  app.mount('#app')
})()