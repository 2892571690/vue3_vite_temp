<template>
  <div
    @click="handleClick"
    class="logo-wrapper"
    :class="{ unfold: collapse, horizontal: mode === 'horizontal' }"
  >
    <svg-icon name="vue" size="35px" />
    <span class="logo-title" :style="{ color: textColor }" v-if="!collapse">vue3-admin</span>
  </div>
</template>

<script>
export default {
  name: 'Logo',
};
</script>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { settingStore } from '@/store/setting.js'

import { themeConfig } from '@/config/theme';
const { themeOptions } = themeConfig;

const settingState = settingStore();
const router = useRouter();

const collapse = computed(() => {
  return settingState.getCollapse;
});

const mode = computed(() => {
  return settingState.getMode
});

const textColor = computed(() => {
  const whiteColors = ['#fff', '#ffffff', '#FFF', '#FFF', 'rgb(255, 255, 255)'];
  const color = themeOptions[settingState.getTheme].menuBgColor;
  return whiteColors.indexOf(color) !== -1 ? '#333' : '#fff';
});

const handleClick = () => {
  router.replace('/');
};
</script>
<style lang="scss" scoped>
.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $base-logo-width;
  cursor: pointer;
  &.unfold {
    width: $base-unfold-width;
    padding: $base-padding-10 0;
  }
  &.horizontal {
    justify-content: flex-start;
  }

  .logo-title {
    display: inline-block;
    max-width: calc(246px - 60px);
    padding-left: $base-padding-10;
    overflow: hidden;
    font-size: $base-font-size-max;
    line-height: $base-logo-height;
    color: #333;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
}
</style>
