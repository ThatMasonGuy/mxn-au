// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './stores';
import "./style.css";
import VueECharts from 'vue-echarts'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, ScatterChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

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
])

const app = createApp(App);

app.use(store);
app.use(router);
app.component('v-chart', VueECharts)

store.dispatch('restoreAuthFromStorage');

app.mount('#app');