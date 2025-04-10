import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AboutPage from '@/views/AboutPage.vue';

const routes = [
  { path: '/', component: HomePage, name: 'Home' },
  { path: '/about', component: AboutPage, name: 'About' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;