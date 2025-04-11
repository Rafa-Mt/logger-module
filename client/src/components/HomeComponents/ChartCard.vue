<script setup lang="ts">
import { defineProps } from 'vue';
import Card from 'primevue/card';


</script>

<template>
  <Card>
    <!-- Título pequeño arriba a la derecha -->
    <template #title>
      <div class="card-title">
        DDD
      </div>
    </template>

    <!-- Contenido del gráfico -->
    <template #content>
      <div class="chart-container">
        <!-- Aquí puedes insertar un gráfico o cualquier contenido -->
        <slot />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.card-title {
  text-align: left;
  font-size: 0.9rem;
  color: rgb(236, 219, 219);
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 1rem;
}
</style>