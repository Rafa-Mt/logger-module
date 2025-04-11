<script setup lang="ts">
import CarouselStats from '@/components/HomeComponents/CarouselStats.vue';
import RecentLogs from '@/components/HomeComponents/RecentLogs.vue';
import ChartCard from '@/components/HomeComponents/CustomChart.vue';
import { onMounted, ref } from 'vue';
import { socket } from '@/socket';

const stats = ref<{title: string, stat: unknown}[]>([]);

socket.on('stats', (data) => {
  stats.value = Object.entries(data).map(([title, stat]) => ({ title, stat }));
  console.log('Received stats:', stats.value);
}); 

const mockLogs = ref<Array<{ id: number, message: string, timestamp: string, type: string }>>([]);

const chartData = ref({
  title: 'Logs by Type',
  data: [] as number[],
  labels: [] as string[]
});

onMounted(async () => {
  try {
    const chartResponse = await fetch('http://localhost:4586/chart');
    if (!chartResponse.ok) {
      throw new Error('Error fetching chart data');
    }
    const chartResult = await chartResponse.json();
    // Esperamos que el endpoint retorne: { types: [...], counts: [...] }
    chartData.value = {
      title: 'Logs by Type',
      labels: chartResult.types,
      data: chartResult.counts
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }

  try {
    const logsResponse = await fetch('http://localhost:4586/logs/custom');
    if (!logsResponse.ok) {
      throw new Error('Error fetching custom logs');
    }
    const logsResult = await logsResponse.json();
    mockLogs.value = logsResult.customLogs;
    console.log('Received custom logs:', mockLogs.value);
    console.log('Received custom logs:', typeof(mockLogs.value[0]?.timestamp));
  } catch (error) {
    console.error('Error fetching custom logs:', error);
  }
});
</script>

<template>
  <div class="grid-container">
    <!-- <h1 class="title">Home</h1> -->
    
    <div class="carousel-section">
      <CarouselStats :stats="stats" />
    </div>
    
    <div class="chart-section">
      <ChartCard v-bind="chartData"/>
    </div>
    
    <div class="logs-section">
      <RecentLogs :logs="mockLogs" />
    </div>
  </div>
</template>

<style scoped>
body {
  overflow: hidden;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Dos columnas de igual ancho */
  grid-template-rows: auto 20vh 50vh; /* Título, carrusel, área inferior */
  gap: 1rem;
  height: 10vh;
  padding: 1rem;
  box-sizing: border-box;
}

.title {
  grid-column: 1 / -1; 
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.carousel-section {
  grid-column: 1 / -1; 
  grid-row: 2;
  height: 100%;
}

.chart-section {
  grid-column: 1;
  grid-row: 3;
  height: 100%;
  overflow: hidden;
}

.logs-section {
  grid-column: 2;
  grid-row: 3;
  height: 100%;
  overflow: hidden;
}

.carousel-section,
.chart-section,
.logs-section {
  background: rgb(24, 24, 24);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}
</style>