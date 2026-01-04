<template>
  <div class="h-64">
    <Doughnut
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const chartData = computed(() => ({
  labels: props.data.labels || [],
  datasets: [
    {
      data: props.data.data || [],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',   // green - pre-service
        'rgba(59, 130, 246, 0.8)',  // blue - in-service
        'rgba(239, 68, 68, 0.8)',   // red - terminated
        'rgba(156, 163, 175, 0.8)', // gray - other
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
        'rgb(239, 68, 68)',
        'rgb(156, 163, 175)',
      ],
      borderWidth: 2,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
}
</script>

