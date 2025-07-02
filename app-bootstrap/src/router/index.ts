import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import Home from '@/views/Home/index.vue'

export const constantRoutes: RouteRecordRaw[] = [
  { path: '/', component: Home },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

export default router