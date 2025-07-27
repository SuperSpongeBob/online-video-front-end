<template>
    <el-header class="header">
        <div class="logo">
            <img src="../../assets/logo.png" alt="商标" />
            <div class="brand-info">
                <span class="brand-name">OnLineVideo</span>
                <div class="user-welcome">
                    <el-tag v-if="role === 'ROLE_ADMIN'" type="danger" size="small" effect="dark" class="role-tag">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        管理员
                    </el-tag>
                    <el-tag v-else-if="role === 'ROLE_VIP'" type="success" size="small" effect="dark" class="role-tag">
                        <el-icon>
                            <Star />
                        </el-icon>
                        VIP用户
                    </el-tag>
                    <el-tag v-else-if="role === 'ROLE_USER'" type="info" size="small" effect="light" class="role-tag">
                        <el-icon>
                            <User />
                        </el-icon>
                        普通用户
                    </el-tag>
                    <el-tag v-else type="info" size="small" effect="plain" class="role-tag">
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        访客
                    </el-tag>
                    <span class="username" v-if="userName">{{ userName }}</span>
                </div>
            </div>
        </div>

        <div class="search-box">
            <el-input v-model="this.searchText" placeholder="搜索视频内容..." @keyup.enter.native="search" maxlength="20"
                class="search-input" clearable>
                <template #prefix>
                    <el-icon>
                        <Search />
                    </el-icon>
                </template>
            </el-input>
        </div>

        <div class="right-nav">
            <div class="nav-item">
                <el-tooltip content="粒子背景开关" placement="bottom" effect="light">
                    <el-switch v-model="this.backgroundSwitch" @change="closeParticles" inline-prompt active-text="开"
                        inactive-text="关" class="particle-switch" />
                </el-tooltip>
            </div>

            <div class="nav-item">
                <el-tooltip content="观看历史" placement="bottom" effect="light">
                    <div class="icon-btn history-btn" @click="gotoHistory">
                        <el-icon>
                            <Clock />
                        </el-icon>
                        <span class="btn-text">历史</span>
                    </div>
                </el-tooltip>
            </div>

            <div class="nav-item">
                <el-tooltip content="上传视频" placement="bottom" effect="light">
                    <div class="icon-btn upload-btn" @click="gotoVideoUpload">
                        <el-icon>
                            <UploadFilled />
                        </el-icon>
                        <span class="btn-text">上传</span>
                    </div>
                </el-tooltip>
            </div>

            <div class="nav-item user-menu">
                <el-dropdown trigger="hover">
                    <div class="icon-btn user-btn">
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span class="btn-text">{{ LogStatus ? '我的' : '登录' }}</span>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu v-if="LogStatus" class="user-dropdown">
                            <el-dropdown-item @click="goToPersonal" class="dropdown-item">
                                <el-icon>
                                    <User />
                                </el-icon>
                                个人中心
                            </el-dropdown-item>
                            <el-dropdown-item v-if="role == 'ROLE_ADMIN'" @click="this.$router.push('/admin')"
                                class="dropdown-item admin-item">
                                <el-icon>
                                    <Tools />
                                </el-icon>
                                管理后台
                            </el-dropdown-item>
                            <el-dropdown-item @click="logout" class="dropdown-item logout-item">
                                <el-icon>
                                    <SwitchButton />
                                </el-icon>
                                退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                        <el-dropdown-menu v-else class="user-dropdown">
                            <el-dropdown-item @click="goToLogin" class="dropdown-item">
                                <el-icon>
                                    <UserFilled />
                                </el-icon>
                                登录
                            </el-dropdown-item>
                            <el-dropdown-item @click="goToRegister" class="dropdown-item">
                                <el-icon>
                                    <Plus />
                                </el-icon>
                                注册
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </el-header>
</template>

<script>
import { ref } from "vue";
import authService from "../../utils/authService";
import eventBus from "../../utils/eventBus";
import { useUserStore } from "../../utils/userStore";
import {
    Search,
    Clock,
    UploadFilled,
    UserFilled,
    User,
    Star,
    Setting,
    SwitchButton,
    Plus,
    Tools
} from "@element-plus/icons-vue";

export default {
    components: {
        Search,
        Clock,
        UploadFilled,
        UserFilled,
        User,
        Star,
        Setting,
        SwitchButton,
        Plus,
        Tools
    },
    data() {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        return {
            role: userInfo ? userInfo.roles[0] : null,        //  获取当前用户的角色
            userName: userInfo ? userInfo.userName : null,
            searchText: '',
            LogStatus: localStorage.getItem("LoginState") === "true",
            backgroundSwitch: true,
        }
    },
    created() {
        if (localStorage.getItem('switch') == undefined) return
        this.backgroundSwitch = localStorage.getItem('switch') == 'true'
    },
    methods: {
        closeParticles(value) {
            console.log(value)
            if (value) {
                eventBus.emit('open-particles');
            } else {
                eventBus.emit('close-particles');
            }
            localStorage.setItem('switch', value.toString())
        },
        test() {
            console.log(localStorage.getItem('VideoToken'))
            // console.log(localStorage.removeItem("VideoToken"))
            console.log(localStorage.removeItem("save"))
        },

        //  前往上传中心
        gotoVideoUpload() {
            window.open(`/videoUpload`)
        },

        //  前往观看历史页
        gotoHistory() {
            window.open('/History')
        },

        //  跳转到搜索页
        search() {
            this.$router.push(`/index/search/${this.searchText}`)
        },

        //  跳转到登录页
        goToLogin() {
            this.$router.push('/login')
        },

        //  退出登录
        async logout() {
            // localStorage.removeItem("LoginState");
            // localStorage.removeItem('VideoToken')   //  清除本地token
            // localStorage.removeItem("userInfo")     //  清除本地用户信息
            const userStore = useUserStore()
            userStore.logout()
            this.$message.success({ message: 'LogoutSucceed', showClose: true })
            await authService.logout()
            window.location.reload();
        },

        //  前往个人中心
        goToPersonal() {
            console.log(sessionStorage.removeItem('switch'))
            this.$router.push("/personalCenterIndex");
        },

        //  前往注册
        goToRegister() {
            this.$router.push('/register')
        },
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

.username {
    font-size: 13px;
    color: #606266;
    font-weight: 500;
}

.search-box {
    max-width: 500px;
    flex: 1;
    margin: 0 40px;
}

.search-input {
    border-radius: 20px;
}

.search-input :deep(.el-input__wrapper) {
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    height: 33px;
    border: 2px solid #e4e7ed;
}

.search-input :deep(.el-input__wrapper:hover) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #c0c4cc;
}

.search-input :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    border-color: #409eff;
}

.search-input :deep(.el-input__inner) {
    font-size: 16px;
    height: 44px;
    line-height: 44px;
}

.search-input :deep(.el-input__prefix) {
    font-size: 18px;
    color: #909399;
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

.particle-switch {
    --el-switch-on-color: #409eff;
    --el-switch-off-color: #dcdfe6;
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

.history-btn:hover .el-icon,
.history-btn:hover .btn-text {
    color: #409eff;
}

.upload-btn:hover .el-icon,
.upload-btn:hover .btn-text {
    color: #67c23a;
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

.admin-item {
    color: #ff4757;
    font-weight: 500;
}

.admin-item:hover {
    background-color: #fff5f5;
    color: #ff3742;
}

.logout-item {
    color: #f56c6c;
}

.logout-item:hover {
    background-color: #fff5f5;
    color: #f56c6c;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .header {
        padding: 0 16px;
    }

    .search-box {
        margin: 0 20px;
    }

    .brand-name {
        font-size: 16px;
    }

    .user-welcome {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
}
</style>
