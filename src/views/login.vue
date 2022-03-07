<template>
    <el-button type="primary" @click="handleLogin">登录</el-button>
</template>
<script setup>
import { userStore } from '@/store/user.js'
import { useRouter } from 'vue-router'

name: 'Login'

const userState = userStore()
const router = useRouter()

const handleLogin = () => {
    userState.login({ name: 'wpl', password: '123123' }).then(res => {
        router.replace({ path: "/" }, () => { });
    })
}
</script>