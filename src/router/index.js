import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: resolve => require(['@/views/Home'], resolve),
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/Home',
      redirect: {
        path: '/'
      }
    },
    {
      path: '/Main',
      redirect: {
        path: '/'
      }
    },
    {
      path: '/Test1',
      name: 'Test1',
      component: resolve => require(['@/views/Test'], resolve),
      meta: {
        title: '测试页面1'
      }
    },
    {
      path: '/Test2',
      name: 'Test2',
      component: resolve => require(['@/views/Test2'], resolve),
      meta: {
        title: '测试页面2'
      }
    },
    {
      path: '/404',
      name: 'NotFound',
      component: resolve => require(['@/views/NotFound'], resolve),
      meta: {
        title: '404'
      }
    },
    {
      path: '*',
      redirect: {
        path: '/404'
      }
    }
  ]
})
