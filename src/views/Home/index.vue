<template>
    <div>
        <div>我是首页</div>
        <el-date-picker v-model="value1" type="date" placeholder="Pick a day"></el-date-picker>
        {{ $t("select") }}
    </div>
</template>

<script setup>

name: 'Home'

import { ref } from 'vue'

const value1 = ref()

</script>
<style scoped lang="scss">
</style>