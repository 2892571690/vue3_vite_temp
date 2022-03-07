import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '@/router';
import { convertRouter, filterAsyncRoutes } from '@/utils/handleRoutes';

// 模仿后台传过来的数据
const getRouterList = () => {
    return {
        code: 200,
        data: [{
            path: '/',
            component: Layout,
            redirect: '/index',
            children: [
                {
                    path: '/index',
                    name: 'Index',
                    component: () => import('@/views/Home/index.vue'),
                    meta: {
                        title: '首页',
                        icon: 'home',
                        affix: true,
                        noKeepAlive: true,
                    },
                },
            ],
        }],
        msg: "success"
    }
}

export const routesStore = defineStore('routes', {
    state: () => ({
        routes: [],
        partialRoutes: [],
    }),
    getters: {
        getRoutes: (state) => state.routes,
        getPartialRoutes: (state) => state.partialRoutes,
    },
    actions: {
        setRoutes(permissions) {
            return new Promise(async (resolve, reject) => {
                //开源版只过滤动态路由permissions，admin不再默认拥有全部权限
                const finallyAsyncRoutes = await filterAsyncRoutes([...asyncRoutes], permissions);
                this.routes = constantRoutes.concat(finallyAsyncRoutes);
                resolve(finallyAsyncRoutes);
            })
        },
        // 向后端请求数据
        setAllRoutes() {
            return new Promise(async (resolve, reject) => {
                let { data } = await getRouterList();
                // data.push({ path: '*', redirect: '/404', hidden: true });
                let accessRoutes = convertRouter(data);
                this.routes = constantRoutes.concat(accessRoutes);
                resolve(accessRoutes);
            })
        },
        setPartialRoutes(accessRoutes) {
            return new Promise((resolve, reject) => {
                this.partialRoutes = constantRoutes.concat(accessRoutes);
                resolve(accessRoutes);
            })
        },
    }
})