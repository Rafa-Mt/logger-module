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
  font-size: 1.5rem;
  color: rgb(236, 219, 219);
}

.card-stat {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 4rem;
  font-weight: bold;
}

.custom-card {
  border: 2px solid #818181; /* Cambia el color y grosor del borde según sea necesario */
  border-radius: 8px; /* Opcional: redondear las esquinas */
}
</style>