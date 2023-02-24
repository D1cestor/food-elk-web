<template>
  <!-- Renders a Bar chart using Vue Chart.js library, with data, options, and other settings as props -->
  <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
    :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
</template>

<script>
import { Bar } from 'vue-chartjs' // import the Bar component from Vue Chart.js library
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js' // import various Chart.js components to use in the chart

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale) // register the imported Chart.js components with the Chart.js library

export default {
  name: 'BarChart', // name of the component
  components: { Bar }, // use the imported Bar component
  props: {
    chartData: { // an object containing the data for the chart to display, with default data provided
      type: Object,
      default(rawProps) {
        return {
          labels: ['January', 'February', 'March'],
          datasets: [{ data: [40, 20, 12] }]
        }
      }
    },
    chartId: { // the id of the chart element, with a default value
      type: String,
      default: 'bar-chart-comparison'
    },
    datasetIdKey: { // the key used to identify the datasets in the chart, with a default value
      type: String,
      default: 'label'
    },
    width: { // the width of the chart, with a default value
      type: Number,
      default: 400
    },
    height: { // the height of the chart, with a default value
      type: Number,
      default: 400
    },
    cssClasses: { // additional CSS classes to apply to the chart element, with a default value
      default: '',
      type: String
    },
    styles: { // additional styles to apply to the chart element, with a default value
      type: Object,
      default: () => { }
    },
    plugins: { // an array of Chart.js plugins to use, with a default value
      type: Array,
      default: () => []
    }
  },
  data() { // the data function for the component
    return {
      chartOptions: { // the default options for the chart
        responsive: true
      }
    }
  },
}
</script>
