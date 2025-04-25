<template xmlns:el-col="http://www.w3.org/1999/html">
    <el-header class="header">
        <h3>后台管理系统</h3>
        <div>
            欢迎你，管理员：{{ this.userName }}
            <el-divider direction="vertical" border-style="none" />
            <router-link to="/index" class="font-color">返回首页</router-link>
        </div>
    </el-header>
</template>

<script>

export default{
    data(){
        return{
            userName:""
        }
    },
    methods:{
        
        getUserName(){
            this.userName=JSON.parse(localStorage.getItem("userInfo")).userName
            // console.log(JSON.parse(localStorage.getItem("userInfo")))
        }
    },
    mounted(){
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
    background-color: #bbbac9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.font-color {
    color: #000000;
}
</style>