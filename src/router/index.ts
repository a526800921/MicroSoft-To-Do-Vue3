import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/main/Index.vue'),
      redirect: '/oneday',
      children: [
        {
          path: '/oneday',
          name: 'oneday',
          component: () => import(`@/views/oneday/Index.vue`)
        },
        {
          path: '/important',
          name: 'important',
          component: () => import(`@/views/important/Index.vue`)
        },
        {
          path: '/plan',
          name: 'plan',
          component: () => import(`@/views/plan/Index.vue`)
        },
        {
          path: '/all',
          name: 'all',
          component: () => import(`@/views/all/Index.vue`)
        },
        {
          path: '/custom/:id',
          name: 'custom',
          component: () => import(`@/views/custom/Index.vue`)
        },
        {
          path: '/search',
          name: 'search',
          component: () => import(`@/views/search/Index.vue`)
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(`@/views/login/Index.vue`)
    }
  ]
})

export default router
