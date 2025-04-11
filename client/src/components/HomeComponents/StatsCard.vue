<script setup lang="ts">
import { defineProps } from 'vue';
import Card from 'primevue/card';

// Definir las propiedades que el componente recibirá
defineProps({
  title: {
    type: String,
    required: true,
  },
  stat: {
    type:  Number || String ,
    default: '0',
    required: true,
  },
});
</script>

<template>
  <Card class="custom-card">

    <template #title>
      <div class="card-title">
        {{ title }}
      </div>
    </template>

    <template #content>
      <div class="card-stat">
        {{ stat }}
      </div>
    </template>

  </Card>
</template>

<style scoped>
.card-title {
  text-align: left;
  font-size: 1rem;
  color: rgb(236, 219, 219);
}

.card-stat {
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
}

.custom-card {
  background-color: #2c3e50;
  border-radius: 8px; 
}
</style>