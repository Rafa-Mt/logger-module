<script setup lang="ts">
import { ref, computed } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import {CustomLog, RouteLog} from '@/../../common/types'; 


// Datos de ejemplo
const customLogs = ref<CustomLog[]>([
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'ERROR', message: 'Error al conectar con la base de datos', timestamp: new Date(Date.now() - 3600000) },
  { type: 'WARN', message: 'Espacio en disco bajo', timestamp: new Date(Date.now() - 7200000) },
  { type: 'DEBUG', message: 'Proceso de limpieza ejecutado', timestamp: new Date(Date.now() - 10800000) },
]);

const routeLogs = ref<RouteLog[]>([
  { ip: '192.168.1.1', method: 'GET', endpoint: '/api/users', timestamp: new Date() },
  { ip: '10.0.0.5', method: 'POST', endpoint: '/api/auth/login', body: { username: 'admin', password: '12345' },params: { page: 1, limit: 10 }, timestamp: new Date(Date.now() - 3600000) },
  { ip: '172.16.0.3', method: 'GET', endpoint: '/api/products', params: { page: 1, limit: 10 }, timestamp: new Date(Date.now() - 7200000) },
  { ip: '192.168.1.15', method: 'DELETE', endpoint: '/api/users/5', timestamp: new Date(Date.now() - 10800000) },
]);

const searchQuery = ref('');
const currentPage = ref(1);
const rowsPerPage = ref(10);

// Filtrado y paginación para Custom Logs
const filteredCustomLogs = computed(() => {
  return customLogs.value.filter(log => 
    log.message.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    log.type.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedCustomLogs = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return filteredCustomLogs.value.slice(start, start + rowsPerPage.value);
});

// Filtrado y paginación para Route Logs
const filteredRouteLogs = computed(() => {
  const x = routeLogs.value.filter(log => 
    log.ip.includes(searchQuery.value) ||
    log.method.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    log.endpoint.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  console.log(x);
  return x;

});

const paginatedRouteLogs = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return filteredRouteLogs.value.slice(start, start + rowsPerPage.value);
});

// Cambiar pestaña reinicia la paginación
const onTabChange = () => {
  currentPage.value = 1;
};
</script>

<template>
  <div class="logs-container">
    <h1>Logs del Sistema</h1>
    
    <div class="search-container">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText 
          v-model="searchQuery" 
          placeholder="Buscar logs..." 
          @input="currentPage "
        />
      </span>
    </div>

    <TabView @tab-change="onTabChange">


      <TabPanel header="Route Logs" :value="0">
        <DataTable 
          :value="paginatedRouteLogs" 
          :paginator="true" 
          :rows="rowsPerPage"
          v-model:first="currentPage"
        >
          <Column field="ip" header="IP"  />

          <Column field="method" header="Método" >
            <template #body="{data}">
              <span :class="'method-badge method-' + data.method.toLowerCase()">
                {{ data.method }}
              </span>
            </template>
          </Column>

          <Column field="endpoint" header="Endpoint" />
          <Column field="endpoint" header="Endpoint" />
          <Column field="endpoint" header="Endpoint" />
          <Column field="endpoint" header="Endpoint" />

          <Column header="Body" v-if="false">
            <template #body="{data}">
              <pre v-if="data.body">{{ JSON.stringify(data.body, null, 2) }}</pre>
              <span v-else>-</span>
            </template>
          </Column>
          <Column header="Params">
            <template #body="{data}">
              <pre v-if="data.params">{{ JSON.stringify(data.params, null, 2) }}</pre>
              <span v-else>-</span>
            </template>
          </Column>
          <Column field="timestamp" header="Fecha/Hora" :sortable="true">
            <template #body="{data}">
              {{ data.timestamp.toLocaleString() }}
            </template>
          </Column>
        </DataTable>
      </TabPanel>
      <TabPanel header="Custom Logs" :value="1">
        <DataTable 
          :value="paginatedCustomLogs" 
          :paginator="true" 
          :rows="rowsPerPage"
          :totalRecords="filteredCustomLogs.length"
          v-model:first="currentPage"
        >
          <Column field="type" header="Tipo" >
            <template #body="{data}">
              <span :class="'log-badge log-' + data.type.toLowerCase()">
                {{ data.type }}
              </span>
            </template>
          </Column>
          <Column field="message" header="Mensaje" />
          <Column field="timestamp" header="Fecha/Hora" >
            <template #body="{data}">
              {{ data.timestamp.toLocaleString() }}
            </template>
          </Column>
        </DataTable>
      </TabPanel>
    </TabView>
  </div>
</template>

<style scoped>
.logs-container {
  padding: 1rem;
}

.search-container {
  margin-bottom: 1rem;
  max-width: 400px;
}

/* Estilos para los badges de tipo de log */
.log-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.log-info {
  background-color: #2196F3;
  color: white;
}

.log-warn {
  background-color: #FFC107;
  color: black;
}

.log-error {
  background-color: #F44336;
  color: white;
}

.log-debug {
  background-color: #9E9E9E;
  color: white;
}

/* Estilos para los badges de método HTTP */
.method-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
}

.method-get {
  background-color: #4CAF50;
  color: white;
}

.method-post {
  background-color: #2196F3;
  color: white;
}

.method-put {
  background-color: #FF9800;
  color: white;
}

.method-delete {
  background-color: #F44336;
  color: white;
}

.method-patch {
  background-color: #9C27B0;
  color: white;
}

/* Mejoras para la tabla */
:deep(.p-datatable) {
  font-size: 0.9rem;
}

:deep(.p-datatable .p-column-header-content) {
  font-weight: bold;
}

/* Ocultar columnas Body y Params por defecto */
:deep(.p-datatable .p-datatable-thead > tr > th:nth-child(4)),
:deep(.p-datatable .p-datatable-tbody > tr > td:nth-child(4)),
:deep(.p-datatable .p-datatable-thead > tr > th:nth-child(5)),
:deep(.p-datatable .p-datatable-tbody > tr > td:nth-child(5)) {
  display: none;
}
</style>