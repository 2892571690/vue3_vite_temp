<template>
  <div v-if="settingState.routerView" class="app-main-container">
    <transition mode="out-in" name="fade-transform">
      <router-view class="app-main-height" />
    </transition>
    <footer class="footer-copyright">{{ copyrightStr }}</footer>
  </div>
</template>

<script>
export default {
  name: 'AppMain',
};
</script>

<script setup>
import { ref } from 'vue';
import { settingStore } from '@/store/setting.js'
import { setting } from '@/config/setting';
const { copyright } = setting;

const copyrightStr = ref(copyright);
const settingState = settingStore();
</script>

<style lang="scss" scoped>
.app-main-container {
  position: relative;
  box-sizing: border-box;
  width: $base-width;
  overflow: hidden;
  text-align: left;
  .app-main-height {
    min-height: $app-main-min-height;
  }
  .footer-copyright {
    min-height: $footer-copyright-height;
    line-height: $footer-copyright-height;
    color: $base-color-3;
    text-align: center;
    border-top: 1px dashed $base-border-color;
  }
}
</style>
