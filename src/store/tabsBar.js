import { defineStore } from 'pinia'

export const tabsBarStore = defineStore('tabsBar', {
    state: () => ({
        visitedRoutes: [],
    }),
    getters: {
        getVisitedRoutes: (state) => state.visitedRoutes,
    },
    actions: {
        addVisitedRoute(route) {
            let target = this.visitedRoutes.find((item) => item.path === route.path);
            if (target) {
                if (route.fullPath !== target.fullPath) Object.assign(target, route);
                return;
            }
            this.visitedRoutes.push(Object.assign({}, route));
        },
        async delRoute(route) {
            await this.delVisitedRoute(route)
            return {
                visitedRoutes: [...this.visitedRoutes],
            };
        },
        delVisitedRoute(route) {
            this.visitedRoutes.forEach((item, index) => {
                if (item.path === route.path) this.visitedRoutes.splice(index, 1);
            });
            return [...this.visitedRoutes];
        },
        async delOthersRoutes(route) {
            await this.delOthersVisitedRoute(route)
            return {
                visitedRoutes: [...this.visitedRoutes],
            };
        },
        delOthersVisitedRoute(route) {
            this.visitedRoutes = this.visitedRoutes.filter(
                (item) => item.meta.affix || item.path === route.path
            );
            return [...this.visitedRoutes];
        },
        async delLeftRoutes(route) {
            await this.delLeftVisitedRoute(route)
            return {
                visitedRoutes: [...this.visitedRoutes],
            };
        },
        delLeftVisitedRoute(route) {
            let index = this.visitedRoutes.length;
            this.visitedRoutes = this.visitedRoutes.filter((item) => {
                if (item.name === route.name) index = this.visitedRoutes.indexOf(item);
                return item.meta.affix || index <= this.visitedRoutes.indexOf(item);
            });
            return [...this.visitedRoutes];
        },
        async delRightRoutes(route) {
            await this.delRightVisitedRoute(route)
            return {
                visitedRoutes: [...this.visitedRoutes],
            };
        },
        delRightVisitedRoute(route) {
            let index = this.visitedRoutes.length;
            this.visitedRoutes = this.visitedRoutes.filter((item) => {
                if (item.name === route.name) index = this.visitedRoutes.indexOf(item);
                return item.meta.affix || index >= this.visitedRoutes.indexOf(item);
            });
            return [...this.visitedRoutes];
        },
        async delAllRoutes(route) {
            await this.delAllVisitedRoutes(route)
            return {
                visitedRoutes: [...this.visitedRoutes],
            };
        },
        delAllVisitedRoutes() {
            this.visitedRoutes = this.visitedRoutes.filter((item) => item.meta.affix);
            return [...this.visitedRoutes];
        },
    }
})