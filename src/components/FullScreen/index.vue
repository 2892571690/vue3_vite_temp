<template>
  <span class="icon-hover full-screen-wrapper" :title="isFullScreen ? '退出全屏' : '全屏'">
    <component
      theme="filled"
      size="16"
      :fill="color"
      :strokeWidth="4"
      :is="(isFullScreen ? 'off' : 'full') + '-screen'"
      @click="handleClick"
    />
  </span>
</template>

<script setup>
import { computed } from 'vue';
import screenfull from 'screenfull';
import { settingStore } from '@/store/setting.js'
import { ElMessage } from 'element-plus';
const settingState = settingStore();

defineProps({
  color: {
    type: String,
    default: '#666',
  },
});

const isFullScreen = computed(() => {
  return settingState.getIsFullScreen
});

const emit = defineEmits(['refresh']);
const handleClick = () => {
  if (!screenfull.isEnabled) {
    ElMessage.warning('进入全屏失败');
    return false;
  }
  settingState.changeFullScreen(!isFullScreen.value)
  screenfull.toggle();
  emit('refresh', screenfull.isFullscreen);
};
</script>

<style lang="scss" scoped>
.full-screen-wrapper {
  padding: 20px 10px;
}
</style>
