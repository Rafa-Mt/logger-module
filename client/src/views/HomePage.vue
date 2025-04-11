<script setup lang="ts">
import CarouselStats from '@/components/HomeComponents/CarouselStats.vue';
import RecentLogs from '@/components/HomeComponents/RecentLogs.vue';
import ChartCard2 from '@/components/HomeComponents/ChartCard.vue';

const stats = [
  { title: 'Stat 1', stat: 100 },
  { title: 'Stat 2', stat: 200 },
  { title: 'Stat 3', stat: 300 },
  { title: 'Stat 4', stat: 400 },
  { title: 'Stat 5', stat: 500 },
  { title: 'Stat 6', stat: 600 },
];

const mockLogs = [
  {
    type: 'INFO',
    time: '2025-04-10 12:34:56',
    message: 'User logged in successfully.',
  },
  {
    type: 'ERROR',
    time: '2025-04-10 12:35:10',
    message: 'Failed to fetch user data.',
  },
];
</script>

<template>
  <div class="grid-container">
    <h1 class="title">Home</h1>
    
    <div class="carousel-section">
      <CarouselStats :stats="stats" />
    </div>
    
    <div class="chart-section">
      <ChartCard />
    </div>
    
    <div class="logs-section">
      <RecentLogs :logs="mockLogs" />
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Dos columnas de igual ancho */
  grid-template-rows: auto 20vh 65vh; /* Título, carrusel, área inferior */
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