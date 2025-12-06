<template>
    <div>
        <el-container style="height: 300px; border: 1px solid #eee">
            <el-aside width="180px" style="background-color: white">
                <el-menu :default-active="activeIndex" @select="handleSelect">
                    <el-menu-item-group>

                        <router-link class="alink" to="/index/videoList">
                            <el-menu-item index="1-1">
                                首页
                            </el-menu-item>

                        </router-link>

                        <router-link class="alink" to="/index/recommend">
                            <el-menu-item index="1-2">
                                推荐
                            </el-menu-item>
                        </router-link>

                        <router-link class="alink" to="/index/memberZone">
                            <el-menu-item index="1-3">
                                会员专区
                            </el-menu-item>
                        </router-link>

                        <router-link class="alink" to="/index/freeZone">
                            <el-menu-item index="1-4">
                                免费专区
                            </el-menu-item>
                        </router-link>
                    </el-menu-item-group>
                </el-menu>
            </el-aside>
        </el-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: sessionStorage.getItem('activeMenu') || '1-1'
        }
    },
    methods: {
        handleSelect(index) {
            this.activeIndex = index
            sessionStorage.setItem('activeMenu', index)
        }
    }
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
</style>

<!-- <template>
    <el-aside >
      <el-menu default-active="videoList" class="el-menu-vertical-demo" @select="handleSelect">
        <el-menu-item index="videoList">首页</el-menu-item>
        <el-menu-item index="indexBody">电视剧</el-menu-item>
        <el-menu-item index="">电影</el-menu-item>
        <el-menu-item index="">短视频</el-menu-item>
        <el-menu-item index="">动漫</el-menu-item>
        <el-menu-item index="">免费专区</el-menu-item>
      
      </el-menu>
    </el-aside>
  </template>
  
  <script>
  export default {
    methods: {
      handleSelect(key) {
        this.$router.push({ path: key });
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
.el-aside{
    text-align: center;
    width: 150px;
    height: 100vh;
    border-right:1px solid #eaeaea ;
}

  .el-menu-vertical-demo {
    list-style-type: none;
    padding: 0%;
  }
  
  .el-menu-item {
    line-height: 50px;
    font-weight: bold;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  .el-menu-item:hover {
    background-color: #efefef;
    cursor: pointer;
  }
  
  .el-menu-item.is-active {
    background-color: #efefef;
    display: block;
    color: black;
    padding-left: 30px;
  }
  
  .el-menu-item::before {
    content: ' ';
    display: block;
    width: 4px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #42b983;
  }
  </style>
   -->