<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import {CustomLog, RouteLog} from '@/../../common/types'; 


// Datos de ejemplo
type LogType = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const customLogs = ref<CustomLog[]>([
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'ERROR', message: 'Error al conectar con la base de datos', timestamp: new Date(Date.now() - 3600000) },
  { type: 'WARN', message: 'Espacio en disco bajo', timestamp: new Date(Date.now() - 7200000) },
  { type: 'DEBUG', message: 'Proceso de limpieza ejecutado', timestamp: new Date(Date.now() - 10800000) },
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'ERROR', message: 'Error al conectar con la base de datos', timestamp: new Date(Date.now() - 3600000) },
  { type: 'WARN', message: 'Espacio en disco bajo', timestamp: new Date(Date.now() - 7200000) },
  { type: 'DEBUG', message: 'Proceso de limpieza ejecutado', timestamp: new Date(Date.now() - 10800000) },
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'ERROR', message: 'Error al conectar con la base de datos', timestamp: new Date(Date.now() - 3600000) },
  { type: 'WARN', message: 'Espacio en disco bajo', timestamp: new Date(Date.now() - 7200000) },
  { type: 'DEBUG', message: 'Proceso de limpieza ejecutado', timestamp: new Date(Date.now() - 10800000) },
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'ERROR', message: 'Error al conectar con la base de datos', timestamp: new Date(Date.now() - 3600000) },
  { type: 'WARN', message: 'Espacio en disco bajo', timestamp: new Date(Date.now() - 7200000) },
  { type: 'DEBUG', message: 'Proceso de limpieza ejecutado', timestamp: new Date(Date.now() - 10800000) },
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'ERROR', message: 'Error al conectar con la base de datos', timestamp: new Date(Date.now() - 3600000) },
  { type: 'WARN', message: 'Espacio en disco bajo', timestamp: new Date(Date.now() - 7200000) },
  { type: 'DEBUG', message: 'Proceso de limpieza ejecutado', timestamp: new Date(Date.now() - 10800000) },
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
  { type: 'ERROR', message: 'Error al conectar con la base de datos', timestamp: new Date(Date.now() - 3600000) },
  { type: 'WARN', message: 'Espacio en disco bajo', timestamp: new Date(Date.now() - 7200000) },
  { type: 'DEBUG', message: 'Proceso de limpieza ejecutado', timestamp: new Date(Date.now() - 10800000) },
  { type: 'INFO', message: 'Sistema iniciado correctamente', timestamp: new Date() },
]);


const routeLogs = ref<RouteLog[]>([
  { ip: '192.168.1.1', method: 'GET', endpoint: '/api/users', timestamp: new Date() },
  { ip: '10.0.0.5', method: 'POST', endpoint: '/api/auth/login', body: { username: 'admin', password: '12345' },params: { page: 1, limit: 10 }, timestamp: new Date(Date.now() - 3600000) },
]);

const searchQuery = ref('');
const currentPage = ref(0);
const rowsPerPage = ref(10);
const activeTabIndex = ref(0);

// Filtrado y paginación para Custom Logs
const filteredCustomLogs = computed(() => {
  return customLogs.value.filter(log => {
    const matchesSearchQuery = log.message.toLowerCase().includes(customSearchText.value.toLowerCase()) ||
      log.type.toLowerCase().includes(customSearchText.value.toLowerCase());

    const matchesLogType = !selectedLogType.value || log.type === selectedLogType.value;

    return matchesSearchQuery && matchesLogType;
  });
});

const paginatedCustomLogs = computed(() => {
  return filteredCustomLogs.value;
});

const filteredRouteLogs = computed(() => {
  return routeLogs.value.filter(log => {
    const matchesSearchQuery =
      log.ip.includes(routeSearchText.value) ||
      log.method.toLowerCase().includes(routeSearchText.value.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(routeSearchText.value.toLowerCase());

    const matchesEndpoint =
      !selectedEndpoint.value || log.endpoint === selectedEndpoint.value;

    const matchesMethod =
      !selectedMethod.value || log.method === selectedMethod.value;

    return matchesSearchQuery && matchesEndpoint && matchesMethod;
  });
});

const paginatedRouteLogs = computed(() => {
  return filteredRouteLogs.value;
});

// Cambiar pestaña reinicia la paginación
const onTabChange = (event: { index: number }) => {
  activeTabIndex.value = event.index;
  currentPage.value = 0;
  searchQuery.value = '';
  customSearchText.value = '';
  routeSearchText.value = '';
  selectedLogType.value = null;
  selectedMethod.value = null;
  selectedEndpoint.value = null;

};

const endpoints = computed(() => {
  const uniqueEndpoints = new Set(routeLogs.value.map(log => log.endpoint));
  return Array.from(uniqueEndpoints);
});

// Filtros para Custom Logs
const customSearchText = ref('');
const selectedLogType = ref<LogType | null>(null);
const logTypes = ref<LogType[]>(['DEBUG', 'ERROR', 'INFO', 'WARN']);

// Filtros para Route Logs
const routeSearchText = ref('');
const selectedMethod = ref<HttpMethod | null>(null);
const selectedEndpoint = ref<string | null>(null);
const methods = ref<HttpMethod[]>(['GET', 'POST', 'PUT', 'DELETE']);


</script>

<template>
  <div class="logs-container">
    <h1>Logs del Sistema</h1>
    
    <div class="filters-container">
      <div v-if="activeTabIndex === 1" class="filter-group">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText 
            v-model="customSearchText" 
            placeholder="Buscar por mensaje..." 
            @input="currentPage = 0"
          />
        </span>
        
        <Dropdown 
          v-model="selectedLogType" 
          :options="logTypes" 
          placeholder="Filtrar por tipo"
          showClear
          @change="currentPage = 0"
          class="filter-dropdown"
        />
      </div>
      
      <!-- Filtros para Route Logs (visible solo en la pestaña Route) -->
      <div v-else class="filter-group">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText 
            v-model="routeSearchText" 
            placeholder="Buscar por IP..." 
            @input="currentPage = 0"
          />
        </span>
        
        <Dropdown 
          v-model="selectedMethod" 
          :options="methods" 
          placeholder="Filtrar por método"
          showClear
          @change="currentPage = 0"
          class="filter-dropdown"
        />
        
        <Dropdown 
          v-model="selectedEndpoint" 
          :options="endpoints" 
          placeholder="Filtrar por endpoint"
          showClear
          filter
          @change="currentPage = 0"
          class="filter-dropdown"
        />
      </div>
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

          <Column header="Body" field="body">
            <template #body="{data}">
              <pre v-if="data.body">{{ JSON.stringify(data.body, null, 2) }}</pre>
              <span v-else>-</span>
            </template>
          </Column>
          <Column header="Params" field="params">
            <template #body="{data}">
              <pre v-if="data.params">{{ JSON.stringify(data.params, null, 2) }}</pre>
              <span v-else>-</span>
            </template>
          </Column>
          <Column field="timestamp" header="Fecha/Hora">
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

.filters-container {
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-dropdown {
  min-width: 200px;
}

.p-input-icon-left {
  flex: 1;
  min-width: 250px;
}

/* Estilos para los badges */
.log-badge, .method-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
  text-transform: uppercase;
}

/* Colores para tipos de log */
.log-info { background-color: #2196F3; color: white; }
.log-warn { background-color: #FFC107; color: black; }
.log-error { background-color: #F44336; color: white; }
.log-debug { background-color: #9E9E9E; color: white; }

/* Colores para métodos HTTP */
.method-get { background-color: #4CAF50; color: white; }
.method-post { background-color: #2196F3; color: white; }
.method-put { background-color: #FF9800; color: white; }
.method-delete { background-color: #F44336; color: white; }

/* Estilo para JSON */
.json-pre {
  margin: 0;
  font-size: 0.8rem;
  white-space: pre-wrap;
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
  max-width: 300px;
  max-height: 150px;
  overflow: auto;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .p-input-icon-left,
  .filter-dropdown {
    width: 100%;
  }
}
</style>