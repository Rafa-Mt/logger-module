import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import LogsPage from '@/views/LogsPage.vue';

const routes = [
  { path: '/', component: HomePage, name: 'Home' },
  { path: '/logs', component: LogsPage, name: 'Logs' },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;