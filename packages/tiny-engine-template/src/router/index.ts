import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard/overview',
    },
    {
      path: '/dashboard/overview',
      name: 'dashboard-overview',
      component: () => import('../views/Overview.vue'),
    },
    {
      path: '/list/basic',
      name: 'list-basic',
      component: () => import('../views/BasicList.vue'),
    },
    {
      path: '/list/card',
      name: 'list-card',
      component: () => import('../views/CardList.vue'),
    },
    {
      path: '/form/basic',
      name: 'form-basic',
      component: () => import('../views/BasicForm.vue'),
    },
    {
      path: '/form/advanced',
      name: 'form-advanced',
      component: () => import('../views/AdvancedForm.vue'),
    },
    {
      path: '/form/step',
      name: 'form-step',
      component: () => import('../views/StepForm.vue'),
    },
    {
      path: '/detail/basic',
      name: 'detail-basic',
      component: () => import('../views/BasicDetail.vue'),
    },
    {
      path: '/detail/advanced',
      name: 'detail-advanced',
      component: () => import('../views/AdvancedDetail.vue'),
    },
    {
      path: '/result/success',
      name: 'result-success',
      component: () => import('../views/Success.vue'),
    },
    {
      path: '/result/fail',
      name: 'result-fail',
      component: () => import('../views/Fail.vue'),
    },
    {
      path: '/profile/center',
      name: 'profile-center',
      component: () => import('../views/PersonalCenter.vue'),
    },
    {
      path: '/profile/settings',
      name: 'profile-settings',
      component: () => import('../views/ProfileSettings.vue'),
    }
  ],
})

export default router
