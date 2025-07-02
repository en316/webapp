import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import Home from '@/views/Home/index.vue'
import Chat from '@/views/Chat.vue'
import Main from '@/views/Main.vue'

export const constantRoutes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/chat', component: Chat },
  { path: '/main', component: Main },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

export default router