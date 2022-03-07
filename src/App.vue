<template>
  <el-config-provider :locale="localLanguage">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { computed } from 'vue';
import i18n from '@/lang';
const locale = i18n.global.locale;
const localLanguage = computed(() => {
  return i18n.global.messages[locale];
});
</script>
