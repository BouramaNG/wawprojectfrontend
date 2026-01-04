import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/Layout.vue'
import { requireAuth, requireGuest, checkRoutePermission } from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Auth/Login.vue'),
      beforeEnter: requireGuest,
    },
    {
      path: '/partner/set-password',
      name: 'partner.set-password',
      component: () => import('@/views/Auth/SetPassword.vue'),
    },
    {
      path: '/admin/set-password',
      name: 'admin.set-password',
      component: () => import('@/views/Auth/AdminSetPassword.vue'),
    },
    {
      path: '/partner/forgot-password',
      name: 'partner.forgot-password',
      component: () => import('@/views/Auth/ForgotPassword.vue'),
    },
    {
      path: '/partner/reset-password',
      name: 'partner.reset-password',
      component: () => import('@/views/Auth/ResetPassword.vue'),
    },
    {
      path: '/',
      component: Layout,
      beforeEnter: requireAuth,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'templates',
          name: 'templates',
          component: () => import('@/views/Templates/Index.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'templates/create',
          name: 'templates.create',
          component: () => import('@/views/Templates/Create.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'templates/:id',
          name: 'templates.show',
          component: () => import('@/views/Templates/Show.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'packages',
          name: 'packages',
          component: () => import('@/views/Packages/Index.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'packages/create',
          name: 'packages.create',
          component: () => import('@/views/Packages/Create.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'packages/:id',
          name: 'packages.show',
          component: () => import('@/views/Packages/Show.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'esims',
          name: 'esims',
          component: () => import('@/views/Esims/Index.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'esims/:id',
          name: 'esims.show',
          component: () => import('@/views/Esims/Show.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'prices',
          name: 'prices',
          component: () => import('@/views/Prices/Index.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'partners',
          name: 'partners',
          component: () => import('@/views/Partners/Index.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'partners/create',
          name: 'partners.create',
          component: () => import('@/views/Partners/Create.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'partners/:id',
          name: 'partners.show',
          component: () => import('@/views/Partners/Show.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'api-documentation',
          name: 'api-documentation',
          component: () => import('@/views/Partners/ApiDocumentation.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'partners/api-docs',
          name: 'partners.api-docs',
          component: () => import('@/views/Partners/ApiDocs.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/Orders/Index.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'orders/:id',
          name: 'orders.show',
          component: () => import('@/views/Orders/Show.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'roles',
          name: 'roles',
          component: () => import('@/views/Roles/Index.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/Users/Index.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'activities',
          name: 'activities',
          component: () => import('@/views/Activities/Index.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/Profile/Index.vue'),
          beforeEnter: checkRoutePermission,
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/Settings/Index.vue'),
          beforeEnter: checkRoutePermission,
        },
      ],
    },
  ],
})

export default router

