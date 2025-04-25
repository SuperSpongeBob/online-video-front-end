<template>
    <div class="index-container">
      <!-- 头部区域 -->
      <Header></Header>
      <!-- 主体区域 -->
      <div class="index-main-box">
        <!-- 左侧边栏区域 -->
        <div class="index-sidebar">
          <Aside></Aside>
          <Foot></Foot> <!-- 将Foot组件放到侧边栏内 -->
        </div>
        <!-- 右侧内容主体区域 -->
        <div class="index-main-body">
          <!-- 路由的视图 -->
          <router-view></router-view>
        </div>
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
    height: 55vh;
    display: flex;
  }
  
  .index-sidebar {
    /* 可以根据需要调整侧边栏的宽度、背景等样式 */
    width: 160px; 
    background-color: #f8f9fa; 
  }
  </style>


<!-- <template>
    <div class="index-container">
        <Header></Header>
        <div class="index-main-box">
            <Aside></Aside>
            <div class="index-main-body">
                <router-view></router-view>
            </div>
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

    .index-main-box {
        height: 55vh;
        display: flex;
    }
}
</style> -->
