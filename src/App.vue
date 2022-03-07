<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zh from 'element-plus/lib/locale/lang/zh-cn'
import en from "element-plus/lib/locale/lang/en";

import { ref, watch } from "vue";

import { settingStore } from '@/store/setting.js'
const settingState = settingStore()

let locale = ref()

watch(() => settingState.lang, (newValue, oldValue) => {
  switch (newValue) {
    case 'zh':
      return locale.value = zh;
    case 'en':
      return locale.value = en;
  }
}, { immediate: true })

</script>
