<template>
  <div class="card">
    <Chart 
      type="pie" 
      :data="chartData" 
      :options="chartOptions" 
      :style="{ width: chartWidth, height: chartHeight }"
    />
  </div>
</template>
  
<script setup lang="ts">
  import { ref, onMounted, watch, defineProps } from 'vue';
  import Chart from 'primevue/chart';
  
  const chartData = ref();
  const chartOptions = ref();
  const props = defineProps<{
    title: string;
    data: number[];
    labels: string[];
  }>();
  
  onMounted(() => {
    chartData.value = setChartData(props.labels, props.data);
    chartOptions.value = setChartOptions();
  });
  
  watch(
    () => props.data,
    (newData: number[]) => {
      chartData.value.datasets[0].data = newData;
    },
    { deep: true }
  );

  const chartWidth = ref('100%');
  const chartHeight = ref('90%');
  
  const setChartData = (labels: string[], data: number[]) => {
    return {
      labels,
      datasets: [
        {
          label: props.title,
          data,
          backgroundColor: [
            'rgba(100, 181, 246, 0.3)',
            'rgba(77, 182, 172, 0.3)',
            'rgba(255, 213, 79, 0.3)',
            'rgba(239, 83, 80, 0.3)',
          ],
          borderColor: ['#64B5F6', '#4DB6AC', '#FFD54F', '#EF5350'],
          borderWidth: 2,
        },
      ],
    };
  };
  const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
  
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };
  };
</script>

<style scoped>
.card {
  width: 100%;
  height: 100%;
  background-color: var(--surface-a);
  border-radius: 0.5rem;
  box-shadow: var(--box-shadow);
  margin: auto;
  display: flex;
  align-items: center;
}
</style>