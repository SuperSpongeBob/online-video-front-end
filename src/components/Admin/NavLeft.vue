<template>
    <el-row class="tac">
        <el-col :span="12">
            <el-container style="height: 600px; border: 1px solid #eee">
                <el-aside width="180px" style="background-color: white">
                    <el-menu :default-active="this.adminActiveIndex" class="el-menu-vertical-demo" @open="handleOpen"
                        @close="handleClose" @select="handleSelect">
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon>
                                    <User />
                                </el-icon>
                                <span>用户管理</span>
                            </template>

                            <router-link to="/Admin/User">
                                <el-menu-item index="1-1"><el-icon>
                                        <Search />
                                    </el-icon>基本信息</el-menu-item>
                            </router-link>


                            <router-link class="alink" to="/Admin/AddUser">
                                <el-menu-item index="1-2"><el-icon>
                                        <EditPen />
                                    </el-icon>添加用户</el-menu-item>
                            </router-link>

                            <router-link class="alink" to="/Admin/Security">
                                <el-menu-item index="1-3"> <el-icon>
                                        <More />
                                    </el-icon> 安全中心 </el-menu-item>
                            </router-link>

                        </el-sub-menu>

                        <el-sub-menu index="2">
                            <template #title> <el-icon>
                                    <VideoCamera />
                                </el-icon> <span>视频管理</span>
                            </template>

                            <router-link class="alink" to="/Admin/Video">
                                <el-menu-item index="2-1"><el-icon>
                                        <Search />
                                    </el-icon>视频信息</el-menu-item>
                            </router-link>

                            <router-link to="/Admin/Check">
                                <el-menu-item index="2-2"><el-icon>
                                        <View />
                                    </el-icon>待审核视频</el-menu-item>
                            </router-link>
                            
                            <router-link to="/Admin/ReportCheck">
                                <el-menu-item index="2-3"><el-icon>
                                        <Warning />
                                    </el-icon>待处理举报</el-menu-item>
                            </router-link>
                        </el-sub-menu>


                    </el-menu>
                </el-aside>
            </el-container>
        </el-col>

    </el-row>
</template>

<script>

export default {
    data() {
        return {
            adminActiveIndex: sessionStorage.getItem('adminActiveMenu') || '1-1'
        }
    },
    methods: {
        handleOpen(key, keyPath) {

        },
        handleClose(key, keyPath) {

        },
        handleSelect(index, indexPath) {
            this.adminActiveIndex = index; // 更新当前选中的菜单项索引
            sessionStorage.setItem('adminActiveMenu', index); // 保存当前选中的菜单项索引到 localStorage
        }
    },
    mounted() {
        // 根据 adminActiveIndex 跳转到对应的路由
        switch (this.adminActiveIndex) {
            case '1-1':
                this.$router.push('/Admin/User');
                break;
            case '1-2':
                this.$router.push('/Admin/AddUser');
                break;
            case '1-3':
                this.$router.push('/Admin/Security');
                break;
            case '2-1':
                this.$router.push('/Admin/Video');
                break;
            case '2-2':
                this.$router.push('/Admin/Check');
                break;
            case '2-3':
                this.$router.push('/Admin/ReportCheck');
                break;
            default:
                this.$router.push('/Admin/User'); // 默认跳转到用户管理页面
                break;
        }
    }

}

</script>
