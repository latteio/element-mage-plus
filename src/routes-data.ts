import {RouteRecordRaw} from 'vue-router';

/*
 * 静态路由
 */
const staticRoutes: RouteRecordRaw[] = [{
  name: "/",
  path: "/",
  component: () => import('@/views/demos/Main.vue'),
  meta: {type: 'menu-group'},
  redirect: '/home',
  children: [
    {
      name: "dashboard",
      path: "/dashboard",
      component: () => import('@/views/demos/Empty.vue'),
      meta: {type: 'menu-group', title: '面板'},
      children: [{
        name: "home",
        path: "/home",
        component: () => import('@/views/demos/home.vue'),
        meta: {
          type: 'menu',
          title: '主页'
        }
      }]
    }, {
      name: "basic",
      path: "/basic",
      component: () => import('@/views/demos/Empty.vue'),
      meta: {type: 'menu-group', title: '基础'},
      children: [{
        name: "app",
        path: "/basic/app",
        component: () => import('@/views/demos/basic/AppMain.vue'),
        meta: {
          type: 'menu',
          title: '应用'
        }
      }, {
        name: "button",
        path: "/basic/button",
        component: () => import('@/views/demos/basic/ButtonMain.vue'),
        meta: {
          type: 'menu',
          title: '按钮'
        }
      }],
    },
    {
      name: "layout",
      path: "/layout",
      component: () => import('@/views/demos/Empty.vue'),
      meta: {type: 'menu-group', title: '布局'},
      children: [{
        name: "borderLayout",
        path: "/layout/borderLayout",
        component: () => import('@/views/demos/layout/BorderLayoutMain.vue'),
        meta: {
          type: 'menu',
          title: 'Border布局'
        }
      }, {
        name: "stackLayout",
        path: "/layout/stackLayout",
        component: () => import('@/views/demos/layout/StackLayoutMain.vue'),
        meta: {
          type: 'menu',
          title: 'Stack布局'
        }
      }, {
        name: "rowLayout",
        path: "/layout/rowLayout",
        component: () => import('@/views/demos/layout/RowLayoutMain.vue'),
        meta: {
          type: 'menu',
          title: 'Row布局'
        }
      }, {
        name: "page",
        path: "/layout/page",
        component: () => import('@/views/demos/page/Page.vue'),
        meta: {
          type: 'menu',
          title: '页面'
        }
      }, {
        name: "subpage",
        path: "/layout/subpage",
        component: () => import('@/views/demos/page/SubPage.vue'),
        meta: {
          type: 'menu',
          title: '子页面',
          hidden: true
        }
      }],
    },
    {
      name: "nav",
      path: "/nav",
      component: () => import('@/views/demos/Empty.vue'),
      meta: {type: 'menu-group', title: '导航'},
      children: [{
        name: "dropdown",
        path: "/nav/dropdown",
        component: () => import('@/views/demos/nav/NavMain.vue'),
        meta: {
          type: 'menu',
          title: 'Dropdown列表'
        }
      }],
    },
    {
      name: "data",
      path: "/data",
      component: () => import('@/views/demos/Empty.vue'),
      meta: {type: 'menu-group', title: '数据'},
      children: [{
        name: "form",
        path: "/data/form",
        component: () => import('@/views/demos/form/FormMain.vue'),
        meta: {
          type: 'menu',
          title: '表单域'
        }
      }, {
        name: "dialog",
        path: "/data/dialog",
        component: () => import('@/views/demos/dialog/DialogMain.vue'),
        meta: {
          type: 'menu',
          title: '对话框'
        }
      }, {
        name: "drawer",
        path: "/data/drawer",
        component: () => import('@/views/demos/dialog/DrawerMain.vue'),
        meta: {
          type: 'menu',
          title: '抽屉框'
        }
      }, {
        name: "tab",
        path: "/data/tab",
        component: () => import('@/views/demos/tab/TabMain.vue'),
        meta: {
          type: 'menu',
          title: '选项卡'
        }
      }, {
        name: "table",
        path: "/data/table",
        component: () => import('@/views/demos/table/TableMain.vue'),
        meta: {
          type: 'menu',
          title: '普通表格'
        }
      }, {
        name: "editTable",
        path: "/data/editTable",
        component: () => import('@/views/demos/table/EditTableMain.vue'),
        meta: {
          type: 'menu',
          title: '可编辑表格'
        }
      }, {
        name: "tree",
        path: "/data/tree",
        component: () => import('@/views/demos/tree/TreeMain.vue'),
        meta: {
          type: 'menu',
          title: '树结构'
        }
      }],
    }]
}];

export default staticRoutes;
