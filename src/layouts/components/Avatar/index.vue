<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <span class="avatar-dropdown" :style="{ color }">
      <img class="user-avatar" :src="avatar" alt />
      <div class="user-name">
        {{ userName }}
        <component theme="filled" :is="'down'" fill="#666"/>
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
export default {
  name: 'Avatar',
};
</script>

<script setup>
import { ref } from 'vue';
import { userStore } from '@/store/user.js';
import { ElMessageBox } from 'element-plus';
import { setting } from '@/config/setting';
import { useRouter } from 'vue-router';
const { title, recordRoute } = setting;
const avatar = ref('https://i.gtimg.cn/club/item/face/img/2/15922_100.gif');
const userName = ref('hu-snail');
const userState = userStore();
const router = useRouter();

defineProps({
  color: {
    type: String,
    default: '#666',
  },
});

const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      handleLogout();
      break;
    default:
      break;
  }
};

const handleLogout = () => {
  ElMessageBox.confirm(`欢迎登录${title}？`, '操作提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    dangerouslyUseHTMLString: true,
    type: 'warning',
  })
    .then(async () => {
      await userState.outLogin();
      if (recordRoute) {
        const { fullPath } = router.currentRoute._value;
        router.push({ path: `/login?redirect=${fullPath}` });
        location.reload();
      } else {
        router.push('/login');
      }
    })
    .catch(() => { });
};
</script>

<style lang="scss" scoped>
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: $base-avatar-dropdown-height;
  padding: $base-padding-10;
  .user-avatar {
    width: $base-avatar-widht;
    height: $base-avatar-height;
    cursor: pointer;
    border-radius: $base-border-radius-circle;
  }

  .user-name {
    position: relative;
    margin-left: $base-margin-5;
    margin-left: $base-margin-5;
    cursor: pointer;
  }
}

:deep(.el-dropdown-menu__item--divided) {
  &::before {
    margin: 0;
  }
}
</style>
