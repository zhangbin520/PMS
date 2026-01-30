import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/screen',
    component: () => import('../views/visualization/RiDPage/screenPage'),
    hidden: true
  },
  {
    path: '/RidPage',
    component: () => import('../views/visualization/OEE/RidPage'),
    hidden: true
  },
  {
    path: '/wePage',
    component: () => import('../views/visualization/OEE/wePage'),
    hidden: true
  },
  {
    path: '/edmPage',
    component: () => import('../views/visualization/OEE/edmPage'),
    hidden: true
  },
  {
    path: '/mPage',
    component: () => import('../views/visualization/OEE/mPage'),
    hidden: true
  },
  {
    path: '/cncPage',
    component: () => import('../views/visualization/OEE/cncPage'),
    hidden: true
  },
  {
    path: '/WE',
    component: () => import('../views/visualization/RiDPage/WE'),
    hidden: true
  },
  {
    path: '/EDM',
    component: () => import('../views/visualization/RiDPage/EDM'),
    hidden: true
  },
  {
    path: '/M',
    component: () => import('../views/visualization/RiDPage/M'),
    hidden: true
  },
  {
    path: '/CNC',
    component: () => import('../views/visualization/RiDPage/CNC'),
    hidden: true
  },
  {
    path: '/recordOrder',
    component: () => import('../views/visualization/recordVisualization/recordOrder/index'),
    hidden: true
  },
  {
    path: '/show',
    component: () => import('../views/visualization/show/index'),
    hidden: true
  },
  {
    path: '/OrderProdPlan',
    component: () => import('../views/visualization/RiDPage/OrderProdPlan'),
    hidden: true
  },
  {
    path: '/OrderProdPlanSchedule',
    component: () => import('../views/visualization/RiDPage/OrderProdPlanSchedule'),
    hidden: true
  },


  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/eleContactFormA/2DView',
    component: () => import('../views/viewDrawings/eleContactFormA/2DView'),
    hidden: true
  },
  {
    path: '/eleContactFormA/3DView',
    component: () => import('../views/viewDrawings/eleContactFormA/3DView'),
    hidden: true
  },
  {
    path: '/eleContactFormB/2DView',
    component: () => import('../views/viewDrawings/eleContactFormB/2DView'),
    hidden: true
  },
  {
    path: '/eleContactFormB/3DView',
    component: () => import('../views/viewDrawings/eleContactFormB/3DView'),
    hidden: true
  },
  {
    path: '/eleContactFormC/2DView',
    component: () => import('../views/viewDrawings/eleContactFormC/2DView'),
    hidden: true
  },
  {
    path: '/eleContactFormC/3DView',
    component: () => import('../views/viewDrawings/eleContactFormC/3DView'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '修改密码', icon: 'user' }
      }
    ]
  },
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('../views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  },
  {
    path: '/order/orderbom-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'productorder/index',
        component: () => import('../views/order/orderbom/productorder/index'),
        name: 'Productorder',
        meta: { title: '编辑BOM明细', activeMenu: '/order/orderbom',keepAlive:true }
      }
    ]
  },
  {
    path: '/order/orderbom-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'productorder/process',
        component: () => import('../views/order/orderbom/productorder/process'),
        name: 'Process',
        meta: { title: '设置工艺', activeMenu: '/order/orderbom',keepAlive:true }
      }
    ]
  },
  {
    path: '/order/orderbom-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'productorder/kkfileKeyProcess',
        component: () => import('../views/order/orderbom/productorder/kkfileKeyProcess'),
        name: 'kkfileKeyProcess',
        meta: { title: '看图Key工艺', activeMenu: '/order/orderbom',keepAlive:true }
      }
    ]
  },
  {
    path: '/order/timecost-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'workpiece',
        component: () => import('../views/order/timecost/workpiece'),
        name: 'Quality',
        meta: { title: '查看工件', activeMenu: '/order/timecost',keepAlive:true }
      }
    ]
  },
  {
    path: '/camdesign/programme',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('../views/camdesign/programme/index'),
        name: 'Programme',
        meta: { title: 'NC编程列表', activeMenu: '/camdesign/programme',keepAlive:true }
      }
    ]
  },
  {
    path: '/camdesign/programme-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'alreadyAccept',
        component: () => import('../views/camdesign/programme/alreadyAccept'),
        name: 'alreadyAccept',
        meta: { title: 'NC编程已领取列表', activeMenu: '/camdesign/programme',keepAlive:true }
      }
    ]
  },
  {
    path: '/camdesign/programme-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'alreadyFinish',
        component: () => import('../views/camdesign/programme/alreadyFinish'),
        name: 'viewAlreadyFinish',
        meta: { title: 'NC编程已完成列表', activeMenu: '/camdesign/programme',keepAlive:true }
      }
    ]
  },
  {
    path: '/camdesign/programme-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'alreadyStop',
        component: () => import('../views/camdesign/programme/alreadyStop'),
        name: 'alreadyCancel',
        meta: { title: 'CAD在线看图', activeMenu: '/camdesign/programme' }
      }
    ]
  },
  {
    path: '/camdesign/programme-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'alreadyCancel',
        component: () => import('../views/camdesign/programme/alreadyCancel'),
        name: 'alreadyCancel',
        meta: { title: '查看图档', activeMenu: '/camdesign/programme' }
      }
    ]
  },
  {
    path: '/camdesign/electrode-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'eleProcess',
        component: () => import('../views/camdesign/electrode/eleProcess'),
        name: 'eleProcess',
        meta: { title: '设置电极工艺', activeMenu: '/camdesign/electrode',keepAlive:true }
      }
    ]
  },
  {
    path: '/production/taskStation-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'equProcess',
        component: () => import('../views/production/taskStation/equProcess'),
        name: 'ViewEquprocess',
        meta: { title: '设备待加工任务列表', activeMenu: '/production/taskStation'}
      }
    ]
  },
  {
    path: '/production/taskStation-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'myTask',
        component: () => import('../views/production/taskStation/myTask'),
        name: 'viewMyTask',
        meta: { title: '已领取的加工任务', activeMenu: '/production/taskStation'}
      }
    ]
  },
  {
    path: '/production/taskStation-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'finishTask',
        component: () => import('../views/production/taskStation/finishTask'),
        name: 'finishTask',
        meta: { title: '我完成的加工任务', activeMenu: '/production/taskStation',keepAlive:true }
      }
    ]
  },
  {
    path: '/production/taskStationWorker-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'equProcess',
        component: () => import('../views/production/taskStationWorker/equProcess'),
        name: 'viewEquprocessWorker',
        meta: { title: '设备待加工任务列表', activeMenu: '/production/taskStationWorker'}
      }
    ]
  },
  {
    path: '/production/taskStationWorker-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'myTask',
        component: () => import('../views/production/taskStationWorker/myTask'),
        name: 'ViewMyTaskWorker',
        meta: { title: '已领取的加工任务', activeMenu: '/production/taskStationWorker'}
      }
    ]
  },
  {
    path: '/production/taskStationWorker-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'finishTask',
        component: () => import('../views/production/taskStationWorker/finishTask'),
        name: 'viewMyFinishTaskWorker',
        meta: { title: '我完成的加工任务', activeMenu: '/production/taskStationWorker',keepAlive:true }
      }
    ]
  },
  {
    path: '/follow',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'recording',
        component: () => import('@/views/follow/recording'),
        name: 'FollowRecording',
        meta: { title: '单件进度', activeMenu: '/follow/recording' }
      }
    ]
  },
  {
    path: '/follow',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'orderProdPlan',
        component: () => import('@/views/follow/orderProdPlan'),
        name: 'ScheduleManagement',
        meta: { title: '排产计划', activeMenu: '/follow/orderProdPlan' }
      }
    ]
  },
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
