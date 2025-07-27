<template>
    <el-header class="header">
        <div class="logo">
            <img src="../../assets/logo.png" alt="商标" />
            <div class="brand-info">
                <span class="brand-name">OnLineVideo</span>
                <div class="user-welcome">
                    <el-tag type="info" size="small" effect="light" class="role-tag">
                        <el-icon>
                            <User />
                        </el-icon>
                        个人中心
                    </el-tag>
                </div>
            </div>
        </div>

        <div class="right-nav">
            <div class="nav-item">
                <el-tooltip content="返回首页" placement="bottom" effect="light">
                    <div class="icon-btn home-btn" @click="blackIndex">
                        <el-icon>
                            <House />
                        </el-icon>
                        <span class="btn-text">首页</span>
                    </div>
                </el-tooltip>
            </div>

            <div class="nav-item user-menu">
                <el-dropdown trigger="hover">
                    <div class="icon-btn user-btn">
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span class="btn-text">我的</span>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu class="user-dropdown">
                            <el-dropdown-item @click="logout" class="dropdown-item logout-item">
                                <el-icon>
                                    <SwitchButton />
                                </el-icon>
                                退出登录
                            </el-dropdown-item>
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
import { User, UserFilled, House, SwitchButton } from "@element-plus/icons-vue";

export default {
    components: {
        User,
        UserFilled,
        House,
        SwitchButton
    },
    methods: {
        blackIndex() {
            this.$router.push('/index/videoList')
        },
        async logout() {
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
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 0 24px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 16px;
}

.logo img {
    height: 40px;
    width: auto;
}

.brand-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.brand-name {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    letter-spacing: 0.5px;
}

.user-welcome {
    display: flex;
    align-items: center;
    gap: 8px;
}

.role-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    border-radius: 12px;
    padding: 2px 8px;
}

.right-nav {
    display: flex;
    align-items: center;
    gap: 16px;
}

.nav-item {
    display: flex;
    align-items: center;
}

.icon-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    border: 1px solid transparent;
    min-width: 60px;
}

.icon-btn:hover {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    transform: translateY(-1px);
}

.icon-btn .el-icon {
    font-size: 18px;
    margin-bottom: 4px;
    color: #606266;
}

.btn-text {
    font-size: 12px;
    color: #606266;
    font-weight: 500;
}

.home-btn:hover .el-icon,
.home-btn:hover .btn-text {
    color: #409eff;
}

.user-btn:hover .el-icon,
.user-btn:hover .btn-text {
    color: #52c41a;
}

.user-dropdown {
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border: none;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    font-size: 14px;
    transition: all 0.2s ease;
}

.dropdown-item:hover {
    background-color: #f5f7fa;
    color: #409eff;
}

.logout-item {
    color: #f56c6c;
}

.logout-item:hover {
    background-color: #fff5f5;
    color: #f56c6c;
}
</style>
