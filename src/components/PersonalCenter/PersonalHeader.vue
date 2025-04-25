<template>
    <el-header class="header">
        <div class="logo">
            <img src="../../assets/logo.png" alt="商标" />
        </div>

        <div class="right-nav">
            <el-button type="primary" plain @click="blackIndex">返回首页</el-button>

            <div class="user-avatar">
                <el-dropdown>
                    <UserFilled style="width: 2em;height: 2em;margin-right: 8px;" />
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </el-header>
</template>

<script>
import authService from '../../utils/authService';
import { useUserStore } from '../../utils/userStore';
export default {
    methods: {
        blackIndex() {
            this.$router.push('/index/videoList')
        },
        async logout() {
            // localStorage.removeItem("LoginState");
            // localStorage.removeItem('VideoToken')   //  清除本地token
            // localStorage.removeItem("userInfo")     //  清除本地用户信息
            const userStore = useUserStore()
            userStore.logout()
            this.$message.success({ message: 'LogoutSucceed', showClose: true })
            await authService.logout()
            this.blackIndex()
        }
    }
}

</script>

<style scoped>
.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo img {
    height: 40px;
    display: flex;
}

.search-box {
    flex: 1;
    text-align: center;
}

.right-nav {
    display: flex;
    align-items: center;
}

.history,
.user-avatar {
    margin-left: 20px;
}

.user-avatar img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}
</style>
