import { defineStore } from 'pinia'
import Cookies from '@/utils/auth.js'
import { setting } from '@/config/setting.js'
import { resetRouter } from '@/router';

const { tokenName } = setting

export const userStore = defineStore('user', {
    state: () => ({
        accessToken: Cookies.getToken('Token'),//token
        permissions: [],//用户权限
        avatar: '',//用户头像
        username: '',//用户名
        userId: null,//用户Id
    }),
    actions: {
        // 登录
        login(userInfo) {
            return new Promise((resolve, reject) => {
                this.accessToken = userInfo.name + userInfo.password
                Cookies.setToken(tokenName, userInfo.name + userInfo.password, 60 * 60 * 24 * 7)
                resolve()
            })
        },
        // 获取用户信息
        getUserInfo() {
            const info = { avatar: 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif', username: '吴品龙', userId: 1, permissions: ["admin"] }
            return new Promise((resolve, reject) => {
                this.permissions = info.permissions
                this.avatar = info.avatar
                this.username = info.username
                this.userId = info.userId
                resolve(info.permissions)
            })
        },
        // 创建虚拟权限
        setPermissions(power) {
            this.permissions = power
        },
        // 退出
        async outLogin() {
            this.accessToken = ''
            this.permissions = []
            this.avatar = ''
            this.username = ''
            this.userId = null
            Cookies.removeToken(tokenName)
            await resetRouter();
        }
    }
})