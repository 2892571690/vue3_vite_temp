<template>
  <el-menu-item
    :key="item.path"
    :index="item.children ? item.children[0].path : item.path"
    v-if="!item.meta || !item.children"
  >
    <component
      class="menu-icon"
      v-if="item.children ? item.children[0].meta?.icon : item.meta?.icon"
      theme="outline"
      size="14"
      strokeWidth="3"
      :is="item.children ? item.children[0].meta?.icon : item.meta?.icon"
    />
    <template #title>
      <span class="title">{{ item.children ? item.children[0].meta?.title : item.meta?.title }}</span>
    </template>
  </el-menu-item>
  <el-sub-menu :class="{ 'is-black': isBlack }" :index="item.path" v-else>
    <template #title>
      <component
        class="menu-icon"
        v-if="item.meta?.icon"
        theme="outline"
        size="14"
        strokeWidth="3"
        :is="item.meta?.icon"
      />
      <span class="title">{{ item.meta?.title }}</span>
    </template>
    <template v-for="(option, index) in item.children">
      <menu-item v-if="option.children" :key="option.path" :item="option" />
      <el-menu-item v-else :index="option.path" :key="index">
        <component
          class="menu-icon"
          v-if="option.meta.icon"
          theme="outline"
          size="14"
          strokeWidth="3"
          :is="option.meta?.icon"
        />
        <span class="title">{{ option.meta?.title }}</span>
      </el-menu-item>
    </template>
  </el-sub-menu>
</template>

<script>
export default {
  name: 'MenuItem',
};
</script>

<script setup>
import { computed } from 'vue';
import { settingStore } from '@/store/setting.js'

import { themeConfig } from '@/config/theme';
const { themeOptions } = themeConfig;

const whiteColors = ['#fff', '#ffffff', '#FFF', '#FFF', 'rgb(255, 255, 255)'];

let props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const settingState = settingStore();

const theme = computed(() => {
  return settingState.getTheme
});

const menuBgColor = computed(() => {
  return themeOptions[theme.value].menuBgColor;
});

const isBlack = computed(() => {
  return whiteColors.indexOf(menuBgColor.value) === -1;
});
</script>
<style lang="scss" scoped>
.menu-icon,
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: $base-icon-width-big !important;
  height: $base-icon-height-super-max !important;
  margin-right: $base-margin-5;
  visibility: initial !important;
  line-height: 50px !important;
}
</style>
