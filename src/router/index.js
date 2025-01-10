import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { routeInfo as _ } from '@/route-info'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    { path: '/sandbox', name: 'sandbox', component: () => import('../views/SandboxView.vue') },
    ...Object.keys(_).map(key => {
      const { name, path, description, category, componentName } = _[key];
      return {
        name,
        path: path || `/${name.toLowerCase().replace(/\s+/g, '-')}`,
        description: description,
        category: category || '0. General',
        component: () => import(`../views/${componentName}.vue`)
      }
    })
  ]
})

export default router
