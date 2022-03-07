<template>
  <div class="icon-hover icon-lang">
    <el-dropdown>
      <translate theme="filled" size="16" :fill="color" :strokeWidth="4" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in languages"
            :key="item.value"
            :disabled="language == item.value"
          >
            <span @click="handleSetLanguage(item.value)">{{ item.name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { settingStore } from '@/store/setting.js'
defineProps({
  color: {
    type: String,
    default: '#666',
  },
});
const languages = reactive([
  {
    name: '简体中文',
    value: 'zh',
  },
  {
    name: 'English',
    value: 'en',
  },
]);

const language = computed(() => {
  return settingState.getLang
});

const settingState = settingStore();

const handleSetLanguage = (lang) => {
  settingState.changeLanguage(lang)
  // location.reload();
};
</script>

<style lang="scss" scoped>
.icon-lang {
  padding: 20px 10px;
}
</style>
