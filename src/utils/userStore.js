import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        isLoggedIn: false,
        userInfo: null,
        roles: []
    }),
    actions: {
        login(data) {
            this.isLoggedIn = true;
            this.userInfo = data;
            this.roles = data.roles || []
            localStorage.setItem('VideoToken', data.token)
            localStorage.setItem('userInfo', JSON.stringify(data))
            localStorage.setItem('LoginState', true)
        },
        logout() {
            this.isLoggedIn = false
            this.userInfo = null
            this.roles = []
            localStorage.removeItem('VideoToken')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('LoginState')
        },
        //  从本地存储恢复用户状态
        restoreState() {
            const token = localStorage.getItem('VideoToken')
            const userInfo = localStorage.getItem('userInfo')
            if (token && userInfo) {
                this.isLoggedIn = true
                this.userInfo = JSON.parse(userInfo)
                this.roles = this.userInfo.roles || []
            }
        }
    }
})