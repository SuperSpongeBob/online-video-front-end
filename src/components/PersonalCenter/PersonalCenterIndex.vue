<template>
    <div class="index-container">

        <!-- 头部区域 -->
        <PersonalHeader></PersonalHeader>
        <!-- 主体区域 -->
        <div class="index-main-box">
            <!-- 左侧边栏区域 -->
            <PersonalAside></PersonalAside>
            <!-- 右侧内容主体区域 -->
            <div class="index-main-body">
                <!-- 路由的视图 -->
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import PersonalHeader from './PersonalHeader.vue';
import PersonalAside from './PersonalAside.vue';
</script>

<style lang="less" scoped>
.index-container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .index-main-box {
        height: 100%;
        display: flex;

        .index-main-body {
            height: 100%;
            padding: 15px;
            flex: 1;
        }
    }
}
</style>