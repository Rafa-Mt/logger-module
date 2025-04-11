<script setup lang="ts">
import { computed, defineProps } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const props = defineProps({
  logs: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value: Array<{ type: string; time: string; message: string }>) => {
      return value.every(
        (item) =>
          typeof item.type === 'string' &&
          typeof item.time === 'string' &&
          typeof item.message === 'string'
      );
    },
  },
});
  
  const limitedLogs = computed(() => props.logs.slice(0, 10));
</script>

<template>
  <DataTable 
    :value="limitedLogs" 
    class="recent-logs-table" 
    :scrollable="true"
    scrollHeight="flex"
  >
    <!-- Columna Type - Ancho fijo pequeño -->
    <Column field="type" header="Type" headerStyle="width: 10%" bodyStyle="width: 100px">
      <template #body="{data}">
        <span class="text-ellipsis" style="width: 100px; display: inline-block">
          {{ data.type }}
        </span>
      </template>
    </Column>
    
    <!-- Columna Time - Ancho fijo mediano -->
    <Column field="time" header="Time" headerStyle="width: 30%" bodyStyle="width: 150px">
      <template #body="{data}">
        <span class="text-ellipsis" style="width: 150px; display: inline-block">
          {{ data.time }}
        </span>
      </template>
    </Column>
    
    <!-- Columna Message - Ancho flexible pero con máximo y truncado -->
    <Column field="message" header="Message" headerStyle="width: 60%" bodyStyle="min-width: 200px">
      <template #body="{data}">
        <span class="text-ellipsis" style="max-width: 400px; display: inline-block">
          {{ data.message }}
        </span>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.recent-logs-table {
  width: 100%;
}

/* Estilo para el texto truncado */
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Opcional: Asegurar que las celdas no se expandan */
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  overflow: hidden;
}
</style>