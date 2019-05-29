import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/articleManage',
    component: Layout,
    redirect: '/articleManage/article',
    name: 'articleManage',
    meta: { title: '文章管理', icon: 'example' },
    children: [
      {
        path: 'article',
        name: 'article',
        component: () => import('@/views/articleManage/article'),
        meta: { title: '文章', icon: 'table' }
      },
      {
        path: 'publish',
        name: 'publish',
        component: () => import('@/views/articleManage/publish'),
        meta: { title: '发布', icon: 'tree' }
      }
    ]
  },

  {
    path: '/userManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'userManage',
        component: () => import('@/views/userManage/user'),
        meta: { title: '用户管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/commentManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'commentManage',
        component: () => import('@/views/commentManage/index'),
        meta: { title: '评论管理', icon: 'link' }
      }
    ]
  },

  {
    path: '/noticeManage',
    component: Layout,
    children: [
     {
       path: 'index',
       name: 'noticeManage',
       component: () => import('@/views/noticeManage/index'),
       meta: {
         title: '通知',
         icon: 'form'
       }
     }
    ]
  },

  {
    path: '/userCenter',
    component: Layout,
    children: [{
      path: 'index',
      name: 'userCenter',
      component: () => import('@/views/userCenter/index'),
      meta: {
        title: '个人中心',
        icon: 'form'
      }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
