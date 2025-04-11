<script setup lang="ts">
import { defineProps } from 'vue';
import Carousel from 'primevue/carousel';
import StatsCard from './StatsCard.vue';

// Definir las propiedades que el componente recibirá
defineProps({
  stats: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<template>
  <Carousel 
    :value="stats" 
    :numVisible="3" 
    :numScroll="1" 
    :circular="true" 
    :showIndicators="false" 
    class="carousel-stats"
  >
    <template #item="slotProps">
        <StatsCard :title="slotProps.data.title" :stat="slotProps.data.stat" />
    </template>
  </Carousel>
</template>

<style scoped>
.carousel-stats ::v-deep(.p-carousel-item) {
  padding: 0 15px; 
}
</style>