<template>
  <div
    id="tabs-bar-container"
    class="tabs-bar-container"
    :class="{ horizontal: mode === 'horizontal' }"
  >
    <el-tabs
      v-model="tabActive"
      type="card"
      class="tabs-content"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="item in visitedRouteList"
        :key="item.path"
        :name="item.path"
        :closable="!isAffix(item)"
      >
        <template #label>
          <div class="item">
            <component
              class="menu-icon"
              v-if="item.meta.icon"
              theme="outline"
              strokeWidth="3"
              :is="item.meta.icon"
            />
            <span>{{ item.meta.title }}</span>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <el-popover
      placement="bottom"
      width="auto"
      trigger="hover"
      @show="handleShow"
      @hide="handleHide"
    >
      <template #reference>
        <span class="more" :class="{ active: visible }" style="cursor: pointer">
          <all-application theme="filled" size="18" :strokeWidth="3" />
        </span>
      </template>
      <div
        class="command-item"
        v-for="(item, index) in commandList"
        :key="index"
        @click="handleCommand(item.command)"
      >
        <component class="icon" theme="filled" size="14" :strokeWidth="3" :is="item.icon" />
        <span class="command-label">{{ item.text }}</span>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { reactive, watch, toRefs, computed, nextTick } from 'vue';
import { tabsBarStore } from '@/store/tabsBar.js'
import { routesStore } from '@/store/routes.js'
import { settingStore } from '@/store/setting.js'
import { useRouter } from 'vue-router';


export default {
  name: 'TabBar',
  setup() {
    const tabsBarState = tabsBarStore();
    const routesState = routesStore();
    const settingState = settingStore();
    const router = useRouter();

    const state = reactive({
      affixtabs: [],
      tabActive: '',
      visible: false,
      commandList: [
        {
          command: 'refreshRoute',
          text: '重新加载',
          icon: 'refresh',
        },
        {
          command: 'closeOtherstabs',
          text: '关闭其它',
          icon: 'close',
        },
        {
          command: 'closeLefttabs',
          text: '关闭左侧',
          icon: 'to-left',
        },
        {
          command: 'closeRighttabs',
          text: '关闭右侧',
          icon: 'to-right',
        },
        {
          command: 'closeAlltabs',
          text: '关闭所有',
          icon: 'minus',
        },
      ],
    });

    const visitedRouteList = computed(() => {
      return tabsBarState.getVisitedRoutes
    });

    const routes = computed(() => {
      return routesState.getRoutes
    });

    const mode = computed(() => {
      return settingState.getMode;
    });

    const filterAffixtabs = (routes) => {
      let tabs = [];
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          tabs.push({
            fullPath: route.path,
            path: route.path,
            name: route.name,
            meta: { ...route.meta },
          });
        }
        if (route.children) {
          const temptabs = filterAffixtabs(route.children, route.path);
          if (temptabs.length >= 1) {
            tabs = [...tabs, ...temptabs];
          }
        }
      });
      return tabs;
    };
    const inittabs = () => {
      let affixtabs = (state.affixtabs = filterAffixtabs(routes.value));
      for (const tag of affixtabs) {
        if (tag.name) {
          tabsBarState.addVisitedRoute(tag)
        }
      }
    };
    const addtabs = () => {
      const { name } = router.currentRoute.value;
      if (name) {
        tabsBarState.addVisitedRoute(router.currentRoute.value)
      }
      return false;
    };
    watch(
      () => router.currentRoute.value,
      () => {
        inittabs();
        addtabs();
        let tabActiveR = '';
        visitedRouteList.value?.forEach((item) => {
          if (item.path === router.currentRoute.value.path) {
            tabActiveR = item.path;
          }
        });
        state.tabActive = tabActiveR;
      },
      { immediate: true }
    );

    const isActive = (route) => {
      return route.path === router.currentRoute.value.path;
    };
    const isAffix = (tag) => {
      return tag.meta && tag.meta.affix;
    };

    const toLastTag = (visitedRoutes) => {
      const latestView = visitedRoutes.slice(-1)[0];
      if (latestView) {
        router.push(latestView);
      } else {
        router.push('/');
      }
    };

    const handleTabRemove = async (tabActive) => {
      let view;
      visitedRouteList.value.forEach((item) => {
        if (tabActive == item.path) {
          view = item;
        }
      });
      const { visitedRoutes } = await tabsBarState.delRoute(view)
      if (isActive(view)) {
        toLastTag(visitedRoutes, view);
      }
    };

    const handleTabClick = (tab) => {
      const route = visitedRouteList.value.filter((item, index) => {
        if (tab.index == index) return item;
      })[0];
      if (router.currentRoute.value.path !== route.path) {
        router.push({
          path: route.path,
          query: route.query,
          fullPath: route.fullPath,
        });
      } else {
        return false;
      }
    };

    const refreshRoute = async () => {
      settingState.setRouterView(false)
      nextTick(() => {
        settingState.setRouterView(true)
      });
    };

    const closeOtherstabs = async () => {
      const view = await toThisTag();
      tabsBarState.delOthersRoutes(view)
    };
    const closeLefttabs = async () => {
      const view = await toThisTag();
      await tabsBarState.delLeftRoutes(view)
    };
    const closeRighttabs = async () => {
      const view = await toThisTag();
      await tabsBarState.delRightRoutes(view)
    };
    const closeAlltabs = async () => {
      const view = await toThisTag();
      const { visitedRoutes } = await tabsBarState.delAllRoutes()
      if (state.affixtabs.some((tag) => tag.path === view.path)) {
        return;
      }
      toLastTag(visitedRoutes, view);
    };

    const toThisTag = async () => {
      const { fullPath, path } = router.currentRoute.value;

      const view = visitedRouteList.value.filter((item) => {
        if (item.path === fullPath) {
          return item;
        }
      })[0];
      if (path !== view.path) router.push(view);
      return view;
    };

    const handleCommand = (command) => {
      switch (command) {
        case 'refreshRoute':
          refreshRoute();
          break;
        case 'closeOtherstabs':
          closeOtherstabs();
          break;
        case 'closeLefttabs':
          closeLefttabs();
          break;
        case 'closeRighttabs':
          closeRighttabs();
          break;
        case 'closeAlltabs':
          closeAlltabs();
          break;
        default:
          return '错误的事件类型';
      }
    };

    const handleShow = () => {
      state.visible = true;
    };

    const handleHide = () => {
      state.visible = false;
    };

    return {
      ...toRefs(state),
      visitedRouteList,
      routes,
      mode,
      isAffix,
      refreshRoute,
      closeAlltabs,
      closeRighttabs,
      closeLefttabs,
      closeOtherstabs,
      handleTabClick,
      handleTabRemove,
      handleCommand,
      handleShow,
      handleHide,
    };
  },
};
</script>

<style lang="scss" scoped>
.tabs-bar-container {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  height: $base-tabs-bar-height;
  padding-right: $base-padding;
  padding-left: $base-padding;
  user-select: none;
  background: $base-color-white;
  border-top: 1px solid #f6f6f6;
  &.horizontal {
    padding: 0 40px;
  }
  :deep(.fold-unfold) {
    margin-right: $base-padding;
  }
  :deep(.el-tabs__item) {
    display: inline-flex;
    align-items: center;
  }
  .item {
    display: inline-flex;
    align-items: center;
    .menu-icon {
      display: flex;
      padding-right: $base-margin-5;
    }
  }

  .tabs-content {
    width: calc(100% - 90px);
    height: $base-tag-item-height;
    :deep(.el-tabs__nav-next, .el-tabs__nav-prev) {
      height: $base-tag-item-height;
      line-height: $base-tag-item-height;
    }
    :deep(.el-tabs__header) {
      border-bottom: 0;
      .el-tabs__nav {
        border: 0;
        .el-tabs__item {
          box-sizing: border-box;
          height: $base-tag-item-height;
          margin-right: $base-margin-5;
          line-height: $base-tag-item-height;
          border: none;
          border-radius: $base-border-radius;
          transition: padding 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
          &.is-active {
            color: $base-color-primary;
            background: $base-color-primary-light9;
            border: none;
            border-bottom: 2px solid;
          }
          &:hover {
            color: $base-color-primary;
            background: $base-color-primary-light9;
            border: none;
            border-bottom: 2px solid;
          }
        }
      }
    }
  }
}
.command-item {
  display: flex;
  align-content: center;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
  .command-label {
    padding-left: 5px;
  }
  &:hover {
    color: $base-color-primary;
    background-color: $base-color-primary-light9;
  }
  .icon {
    display: flex;
  }
}
.more {
  display: flex;
  align-content: center;
  align-items: center;
  color: $base-font-color;
  cursor: pointer;
  transition: all 0.5s;
  &.active {
    color: $base-color-primary !important;
    transform: rotate(180deg);
  }
}
</style>
