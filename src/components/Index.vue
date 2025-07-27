<template>
    <div class="index-container">
        <!-- 头部区域 -->
        <Header></Header>
        <!-- 主体区域 -->
        <div class="index-main-box">
            <!-- 左侧边栏区域 -->
            <div class="index-sidebar">
                <Aside></Aside>
                
            </div>
            <!-- 右侧内容主体区域 -->
            <div class="index-main-body">
                <!-- 路由的视图 -->
                <router-view></router-view>
            </div>
        </div>
        <!-- 页脚区域 -->
        <div class="index-footer">
            <Foot></Foot>
        </div>
    </div>
</template>

<script setup>
import Header from "./subcomponents/Header.vue";
import Foot from './subcomponents/Foot.vue';
import Aside from "./subcomponents/Aside.vue";
</script>

<style scoped>
.index-container {
    overflow-y: hidden;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.index-main-box {
    flex: 1;
    display: flex;
    min-height: 0;
}

.index-sidebar {
    width: 180px;
    background-color: #f8f9fa;
}

.index-main-body {
    flex: 1;
    overflow-y: auto;
}

.index-footer {
    height: 2vh;
    /* 进一步减小到视口高度的2.5% */
    background-color: #f5f5f5;
    border-top: 1px solid #e0e0e0;
    padding: 3px 20px;
    /* 进一步减小内边距 */
    overflow-y: auto;
}
</style>
