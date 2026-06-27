import {createRouter, createWebHashHistory, RouterOptions} from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import staticRoutes from "@/routes-data";

/**
 * 创建路由
 */
const routes = [...staticRoutes];
console.log('routes===',routes)
const router = createRouter(<RouterOptions>{
  history: createWebHashHistory(),
  routes: routes
});

router.beforeEach(() => {
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});

/**
 * onError
 */
router.onError(() => {
  NProgress.done();
});

export default router;
