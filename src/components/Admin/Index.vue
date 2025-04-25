<template>
    <div class="index-container">
        <!-- 头部区域 -->
        <Header></Header>
        <!-- 主体区域 -->
        <div class="index-main-box">
            <!-- 左侧边栏区域 -->
            <NavLeft></NavLeft>
            <!-- 右侧内容主体区域 -->
            <div class="index-main-body">
                <!-- 路由的视图 -->
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from './Header.vue';
import NavLeft from './NavLeft.vue';
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
      padding: 15px;
      width: 80%;
      flex: 1;
      
    }
  }
}
</style>