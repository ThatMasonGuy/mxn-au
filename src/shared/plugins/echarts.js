import { defineAsyncComponent } from 'vue'

const VChart = defineAsyncComponent(async () => {
  const [vueEcharts, core, charts, components, renderers] = await Promise.all([
    import('vue-echarts'),
    import('echarts/core'),
    import('echarts/charts'),
    import('echarts/components'),
    import('echarts/renderers'),
  ])

  core.use([
    components.TitleComponent,
    components.TooltipComponent,
    components.GridComponent,
    components.LegendComponent,
    components.DatasetComponent,
    charts.BarChart,
    charts.LineChart,
    charts.ScatterChart,
    charts.PieChart,
    renderers.CanvasRenderer,
  ])

  return vueEcharts.default ?? vueEcharts
})

export default {
  install(app) {
    app.component('v-chart', VChart)
  },
}
