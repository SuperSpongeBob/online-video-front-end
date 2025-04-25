<template>
    <el-row class="tac">
        <el-col :span="12">
            <el-container style="height: 600px; border: 1px solid #eee">
                <el-aside width="220px" style="background-color: white">
                    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                        @select="handleSelect">
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon>
                                    <User />
                                </el-icon>
                                <span>用户中心</span>
                            </template>

                            <router-link to="/PersonalCenterIndex/BasicInformation">
                                <el-menu-item index="1-1"><el-icon>
                                        <Search />
                                    </el-icon>基本信息</el-menu-item>
                            </router-link>


                            <router-link class="alink" to="/PersonalCenterIndex/InfoEditor">
                                <el-menu-item index="1-2"><el-icon>
                                        <EditPen />
                                    </el-icon>信息修改</el-menu-item>
                            </router-link>

                            <router-link class="alink" to="/PersonalCenterIndex/SecurityCenter">
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

                            <router-link to="/PersonalCenterIndex/UploadRecord">
                                <el-menu-item index="2-1"><el-icon>
                                        <Clock />
                                    </el-icon>上传记录</el-menu-item>
                            </router-link>


                            <router-link class="alink" to="/PersonalCenterIndex/History">
                                <el-menu-item index="2-2"><el-icon>
                                        <Clock />
                                    </el-icon>历史记录</el-menu-item>
                            </router-link>

                        </el-sub-menu>

                    </el-menu>
                </el-aside>
            </el-container>
        </el-col>

    </el-row>
</template>

<script>
import {
    Clock,
    EditPen,
    Menu as IconMenu,
    Search,
    Star,
    User,
} from '@element-plus/icons-vue'

export default {
    data() {
        return {
            activeIndex: sessionStorage.getItem('personalAside') || '1-1'
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        },
        handleSelect(index, indexPath) {
            this.activeIndex = index; // 更新当前选中的菜单项索引
            sessionStorage.setItem('personalAside', index); // 保存当前选中的菜单项索引到 localStorage
        }
    },
    mounted() {
        // 根据 adminActiveIndex 跳转到对应的路由
        switch (this.activeIndex) {
            case '1-1':
                this.$router.push('/PersonalCenterIndex/BasicInformation');
                break;
            case '1-2':
                this.$router.push('/PersonalCenterIndex/InfoEditor');
                break;
            case '1-3':
                this.$router.push('/PersonalCenterIndex/SecurityCenter');
                break;
            case '2-1':
                this.$router.push('/PersonalCenterIndex/UploadRecord');
                break;
            case '2-2':
                this.$router.push('/PersonalCenterIndex/History');
                break;
            default:
                this.$router.push('/PersonalCenterIndex/BasicInformation'); // 默认跳转到用户管理页面
                break;
        }
    }
}

</script>






<!-- <template>
    <div>
        <el-container style="height: 600px; border: 1px solid #eee">
            <el-aside width="120px" style="background-color: white">
                <el-menu :default-openeds="['1']">

                    <el-menu index="1">
                        <template slot="title">
                            <i class="el-icon-postcard"></i>信息修改</template>
                        <el-menu-item-group>

                            <router-link class="alink" to="/personalCenterIndex/basicInformation">
                                <el-menu-item index="1-1">
                                    基本信息
                                </el-menu-item>
                            </router-link>

                            <router-link class="alink" to="/personalCenterIndex/infoeditor">
                                <el-menu-item index="1-2">
                                    信息修改
                                </el-menu-item>
                            </router-link>

                            <router-link class="alink" to="">
                                <el-menu-item index="1-3">
                                    头像修改
                                </el-menu-item>
                            </router-link>

                            <router-link class="alink" to="/personalCenterIndex/securityCenter">
                                <el-menu-item index="1-4">
                                    安全中心
                                </el-menu-item>
                            </router-link>

                            <router-link class="alink" to="">
                                <el-menu-item index="1-5">
                                    视频管理
                                </el-menu-item>
                            </router-link>

                        </el-menu-item-group>

                    </el-menu>


                    <el-menu index="2">
                        <template slot="title">
                            <i class="el-icon-postcard"></i>文章管理</template>
                        <el-menu-item-group>
                            <router-link class="alink" to="">
                                <el-menu-item index="2-1">
                                    私密文章
                                </el-menu-item>
                            </router-link>

                            <router-link class="alink" to="">
                                <el-menu-item index="2-2">
                                    PUBLIC
                                </el-menu-item>
                            </router-link>

                            <router-link class="alink" to="">
                                <el-menu-item index="2-3">
                                    全部文章
                                </el-menu-item>
                            </router-link>

                            <router-link class="alink" to="">
                                <el-menu-item index="2-4">
                                    我的专栏
                                </el-menu-item>
                            </router-link>

                            <router-link class="alink" to="">
                                <el-menu-item index="2-5">
                                    审核状态
                                </el-menu-item>
                            </router-link>
                        </el-menu-item-group>

                    </el-menu>

                    
       
                </el-menu>
            </el-aside>


        </el-container>

    </div>
</template>

<script>
export default {
    name: "myspace",
    data() {

        return {

        }
    },
}
</script>

<style scoped>
.el-header {
    background-color: #e5efe2;
    color: #333;
    line-height: 60px;
}

.el-aside {
    height: 100vh;
    color: #333;
}

.router-link-active {
    text-decoration: none;
}

.alink {

    text-decoration: none;
}
</style> -->