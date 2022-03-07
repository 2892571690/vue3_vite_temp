
/**
 * 路由全局控制
 */

import router from '@/router'
import { userStore } from '@/store/user.js';
import { routesStore } from '@/store/routes.js';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getPageTitle } from '@/utils/index';
import { setting } from '@/config/setting';
const { authentication, loginInterception, progressBar, routesWhiteList, recordRoute, tokenName } = setting;

NProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});

router.beforeResolve(async (to, from, next) => {
  const userState = userStore()
  const routesState = routesStore()
  // 开启进度条
  if (progressBar) NProgress.start();
  // 获取Token
  let hasToken = userState.accessToken;
  // 判断是否开启路由拦截
  if (!loginInterception) hasToken = true;

  if (hasToken) {
    // 判断跳转登录页(当有Token的时候去跳转登录页，指定到首页)
    if (to.path === '/login') {
      next({ path: '/' });
      if (progressBar) NProgress.done();
    } else {
      // 判断是否存在用户信息
      const hasUserInfo = userState.userId
      if (hasUserInfo) {
        // 有用户信息直接next()
        next();
      } else {
        try {
          // 没有用户信息获重新取用户信息，顺便返回用户权限
          let permissions;
          if (!loginInterception) {
            //loginInterception为false时，创建虚拟权限
            await userState.setPermissions(['admin']);
            permissions = ['admin'];
          } else {
            permissions = await userState.getUserInfo();
          }

          // 获取路由表
          let accessRoutes = [];
          if (authentication === 'intelligence') {
            accessRoutes = await routesState.setRoutes(permissions)
          } else if (authentication === 'all') {
            accessRoutes = await routesState.setAllRoutes()
          }
          accessRoutes.forEach((item) => {
            router.addRoute(item);
          });
          next({ ...to, replace: true });
        } catch {
          // 捕捉错误
          await userState.outLogin()
          if (progressBar) NProgress.done();
        }
      }
    }
  } else {
    // 免登录路由
    if (routesWhiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (recordRoute) {
        next(`/login?redirect=${to.path}`);
      } else {
        next('/login');
      }
      if (progressBar) NProgress.done();
    }
  }
  // 设置浏览器标签的名字
  document.title = getPageTitle(to.meta.title);
})
router.afterEach(() => {
  if (progressBar) NProgress.done();
});