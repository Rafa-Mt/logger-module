
import { createApp } from 'vue';
import router from './router/index';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css'; 
import 'primevue/resources/primevue.min.css'; 
import 'primeicons/primeicons.css'; 

const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.mount('#app');