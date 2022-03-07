import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/index.vue';

export const constantRoutes = [
    { path: '/login', name: 'Login', component: () => import('@/views/login.vue'), meta: { title: '登录' }, hidden: true, },
    { path: '/404', name: '404', component: () => import('@/views/Error/404.vue'), hidden: true, },
    { path: '/401', name: '401', component: () => import('@/views/Error/401.vue'), hidden: true, },
]

export const asyncRoutes = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('@/views/Home/index.vue'),
                meta: {
                    title: '首页',
                    icon: 'home',
                    affix: true,
                    noKeepAlive: true,
                },
            },
        ],
    },
    {
        path: '/user',
        component: Layout,
        name: 'UsersManage',
        meta: { title: '用户管理', icon: 'user' },//当children有多个的时候需要添加meta
        children: [
            {
                path: '/user',
                name: 'User',
                component: () => import('@/views/User/index.vue'),
                meta: {
                    title: '用户',
                    affix: false,
                    noKeepAlive: true,
                },
            },
            {
                path: '/userName',
                name: 'UserName',
                component: () => import('@/views/User/userName.vue'),
                meta: {
                    title: '用户名称',
                    affix: false,
                    noKeepAlive: true,
                },
            },
        ],
    },
    // 404 page must be placed at the end !!!
    {
        path: '/:pathMatch(.*)',
        redirect: '/404',
        hidden: true
    }
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现
    history: createWebHistory(),
    routes: constantRoutes, // `routes: routes` 的缩写
})

// reset router
export function resetRouter() {
    router.getRoutes().forEach((route) => {
        const { name } = route;
        if (name) {
            router.hasRoute(name) && router.removeRoute(name);
        }
    });
}

export default router