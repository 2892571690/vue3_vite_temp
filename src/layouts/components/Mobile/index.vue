<template>
  <div class="admin-container">
    <el-container>
      <el-container class="container">
        <el-header class="header" height="60px">
          <NavBar @handleCollapse="handleCollapse" />
          <TabBar v-if="tag" />
        </el-header>
        <el-main class="main" :class="{ fixed: fixedHead, 'no-tag': !tag }">
          <AppMain />
        </el-main>
      </el-container>
    </el-container>
    <el-drawer v-model="isDrawer" direction="ltr" :with-header="false" @close="closeDrawer">
      <Menu />
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Mobile',
};
</script>

<script setup>
import { computed } from 'vue';
import { settingStore } from '@/store/setting.js'

const settingState = settingStore();

const isDrawer = computed(() => {
  return settingState.getIsDrawer;
});

const tag = computed(() => {
  return settingState.getTag;
});

const fixedHead = computed(() => {
  return settingState.getFixedHead;
});

const handleCollapse = () => {
  settingState.setIsDrawer(true);
};

const closeDrawer = () => {
  settingState.setIsDrawer(false);
};
</script>

<style lang="scss" scoped>
.admin-container {
  position: relative;
  background-color: $base-content-bg-color;
  .container {
    position: absolute;
    right: 0;
    left: 0;
    transition: all $base-transition-time-4;
  }
  .header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: $base-z-index-999;
    padding: 0;
    transition: all $base-transition-time-4;
  }
  .main {
    position: relative;
    top: $base-main-mobile-top;
    &.no-tag {
      top: $base-main-mobile-no-tag-top;
    }
    background-color: $base-content-bg-color;
  }
  :deep(.el-menu) {
    border-right: $base-border-none !important;
  }
}
</style>
