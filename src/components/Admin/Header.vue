<template xmlns:el-col="http://www.w3.org/1999/html">
    <el-header class="header">
        <div class="logo">
            <img src="../../assets/logo.png" alt="商标" />
            <div class="brand-info">
                <span class="brand-name">OnLineVideo</span>
                <div class="admin-badge">
                    <el-tag type="danger" size="small" effect="dark" class="role-tag">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        管理后台
                    </el-tag>
                </div>
            </div>
        </div>

        <div class="right-nav">
            <div class="welcome-info">
                <el-icon>
                    <UserFilled />
                </el-icon>
                <span class="admin-name">管理员：{{ this.userName }}</span>
            </div>

            <div class="nav-item">
                <el-tooltip content="返回首页" placement="bottom" effect="light">
                    <div class="icon-btn home-btn" @click="goToHome">
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
                        <span class="btn-text">设置</span>
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
import { Setting, UserFilled, House, SwitchButton } from "@element-plus/icons-vue";

export default {
    components: {
        Setting,
        UserFilled,
        House,
        SwitchButton
    },
    data() {
        return {
            userName: ""
        }
    },
    methods: {
        getUserName() {
            this.userName = JSON.parse(localStorage.getItem("userInfo")).userName
        },
        goToHome() {
            this.$router.push('/index')
        },
        logout() {
            localStorage.removeItem("LoginState");
            localStorage.removeItem('VideoToken');
            localStorage.removeItem("userInfo");
            this.$message.success({ message: '退出成功', showClose: true });
            this.$router.push('/login');
        }
    },
    mounted() {
        this.getUserName()
    }
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
    color: #ffffff;
    letter-spacing: 0.5px;
}

.admin-badge {
    display: flex;
    align-items: center;
}

.role-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    border-radius: 12px;
    padding: 2px 8px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.right-nav {
    display: flex;
    align-items: center;
    gap: 16px;
}

.welcome-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ffffff;
    font-weight: 500;
}

.admin-name {
    font-size: 14px;
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
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    min-width: 60px;
}

.icon-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-1px);
}

.icon-btn .el-icon {
    font-size: 18px;
    margin-bottom: 4px;
    color: #ffffff;
}

.btn-text {
    font-size: 12px;
    color: #ffffff;
    font-weight: 500;
}

.home-btn:hover .el-icon,
.home-btn:hover .btn-text {
    color: #ffffff;
}

.user-btn:hover .el-icon,
.user-btn:hover .btn-text {
    color: #ffffff;
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