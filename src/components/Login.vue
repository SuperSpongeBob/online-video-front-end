<template>
    <div class="login-container">

        <el-card class="login-card">
            <template #header>
                <div class="card-header">
                    <span>登录</span>
                </div>
            </template>
            
            <el-form ref="formRef" :model="user" :rules="validationRules" label-width="120px">
                <el-form-item label="账号" prop="userPhone">
                    <el-input v-model="user.userPhone" placeholder="请输入手机号" autocomplete="new-password"/>
                </el-form-item>
                <el-form-item label="密码" prop="userPassword">
                    <el-input type="password" v-model="user.userPassword" placeholder="请输入密码" show-password />
                </el-form-item>
                <el-form-item label="身份">
                    <el-radio-group v-model="loginType">
                        <el-radio :value="'user'">用户登录</el-radio>
                        <el-radio :value="'admin'">管理员登录</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div style="margin: 2vh;display: flex;justify-content: center;">
                    <el-button style="width: 180px;" type="primary" round @click="submit">登录</el-button>
                </div>
                <div style="margin: 2vh;display: flex;justify-content: center;">
                    <el-button link  type="info"  @click="this.$router.push('/forgetPassword')">忘记密码？</el-button>
                </div>
                    <div style="display: flex; justify-content: space-between;">
                        <el-button link type="primary" @click="this.$router.push('/index')">
                            <el-icon>
                                <Back />
                            </el-icon>首页
                        </el-button>

                        <el-button link  type="primary"
                            @click="this.$router.push('/register')">
                            注册<el-icon>
                                <Right />
                            </el-icon>
                        </el-button>
                    </div>
                
            </el-form>
        </el-card>

    </div>
</template>

<script>
import { ElLoading } from 'element-plus';
import authService from '../utils/authService';
import { useUserStore } from '../utils/userStore';
import { isPassword, isMobilePhoneNumber, checkExist, } from "../utils/validationRules";
export default {
    data() {
        return {
            user: {
                userPhone: "17806573192",
                userPassword: "admin123"
            },
            loginType: 'user',
            formRef:null,
            
            validationRules: {
                userPhone: [
                    { required: true, message: "手机号码不能为空", trigger: "blur" },
                    { validator: isMobilePhoneNumber, trigger: "blur" },
                    // { validator: checkExist, trigger: "blur" },
                ],
                userPassword: [
                    { required: true, message: "密码不能为空", trigger: "blur" },
                    { validator: isPassword, trigger: "blur" },
                ],
            },
        }
    },
    methods: {
        async submit() {
            this.$refs.formRef.validate(valid=>{
                if(valid){
                    authService.login({ userPhone: this.user.userPhone, userPassword: this.user.userPassword })
                    .then(response=>{
                        const {data} = response
                        if(data.success){
                            // localStorage.setItem('VideoToken', data.token)
                            // localStorage.setItem('userInfo', JSON.stringify(data))
                            // localStorage.setItem("LoginState", true)
                            const userStore = useUserStore()
                            userStore.login(data)
                            
                            if (this.loginType == 'admin' && data.roles[0] == "ROLE_ADMIN") {
                                const loading = ElLoading.service({
                                    lock: true,
                                    text: 'Loading',
                                    background: 'rgba(0,0,0,0.7)'
                                })
                                setTimeout(() => {
                                    loading.close()
                                    this.$notify.success({title:`尊敬的管理员`,message:'欢迎来到后台管理系统'})
                                    this.$router.push('/admin')
                                }, 1000)
                                return
                            }
                            this.$message.success({message:`${data.message}`,showClose:true})
                            this.$notify.success({title:`尊敬的用户`,message:'您已登录成功',position: 'bottom-right',})
                            this.$router.push("/index")
                        }else{
                            this.$message.error({message:`${data.message}`,showClose:true})
                        }
                    })
                    .catch(error=>{
                        if(error.response){
                            this.$message.error({message:`${error.response.data.message}`||'登录失败',showClose:true})
                        }else{
                            this.$message.error({message:`网络错误，请稍后重试`,showClose:true})
                        }
                    })
                }
            })
        },
    }
}

</script>

<style scoped>
.login-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    background-color: transparent;
}

.login-card {
    max-width: 600px;
    width: 100%;
    padding: 15px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: white;
}

.el-form-item {
    margin-bottom: 15px;
}

.el-form-item__label {
    width: 80px;
}

.el-input {
    width: 240px;
}
</style>


<!-- <template>
  <div style="max-width: 100%;display: flex;justify-content: center;align-items: center;height: 100vh;">
    <el-card shadow="always">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="userPhone" name="账号" label="账号" placeholder="手机号"
            :rules="[{ required: true, message: '请填写手机号' }]" />
          <van-field v-model="userPassword" type="password" name="密码" label="密码" placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]" />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit"> 提交 </van-button>
        </div>
      </van-form>
      <el-form-item>
        <el-button link type="primary" style="margin-left: 60%">
          <router-link to="/register">前往注册</router-link>
        </el-button>
        <el-button link>
          <router-link to="/forgetPassword">找回密码</router-link>
        </el-button>
      </el-form-item>
    </el-card>
  </div>

</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import authService from "../utils/authService";
import { ElMessage } from "element-plus";

const router = useRouter();
const userPhone = ref("18613163197");
const userPassword = ref("zyx123456");

const onSubmit = async () => {
  try {
    //创建userData数组用于存放账号密码传到后端
    const userData = [];
    //将输入的账号密码添加到数组中
    userData.push(userPhone.value, userPassword.value);
    const response = await authService.login(userData);
    console.log(response[0].userIsVip)
    
    if (response.length === 0) {

      ElMessage({ showClose: true, message: "账号或密码错误", type: "error", });

      console.log("账号或密码错误");
    } else {
      router.push("/index");
      ElMessage({ showClose: true, message: "登录成功", type: "success", });
      console.log("success");
      
      sessionStorage.setItem("LoginState", true),      //登录状态

      sessionStorage.setItem("userId", response[0].userId)        //登录成功后保存从后端传回的userId
      sessionStorage.setItem("userIsVip",response[0].userIsVip)   //用于观看视频时验证是否为VIP
      localStorage.setItem("userName",response[0].userName)       //暂时用于评论时的评论功能
    }
  } catch (error) {
    console.error(error);
  }
};
</script> -->




<!-- <style scoped>
van-form {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

.card {
  padding: 2em;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }

  a:hover {
    color: #747bff;
  }

  button {
    background-color: #f9f9f9;
  }
}
</style> -->

<!-- <script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import authService from '../utils/authService.js'; -->
<!-- // export default {
// data() {
// return {
// userName: 'zyx',
// userPassword: '11',
// userList: [],
// form: {
// username: '',
// password: ''
// }

// }
// },
// methods: {
// async onSubmit() {
// try {
// this.form.username = this.userName
// this.form.password = this.userPassword
// const response = await authService.login(this.form)
// console.log(response)
// if (!response || Array.isArray(response) && response.length === 0) {
// console.log('账号或密码错误')
// alert('账号或密码错误')
// } else {
// console.log('success')
// router.push('/home')
// }
// // this.userList=response.data
// // console.log(this.userList)
// } catch (error) {
// console.error(error)
// console.log(this.form)
// }
// }
// }
// }

// const response=await axios.get('http://localhost:8080/api/user',{
// params:{
// username:this.userName,
// password:this.userPassword
// }
// }
// console.log(response.status)
// if(response.status===200){
// console.log('登录成功')
// }
// const router = useRouter()
// const username = ref('')
// const password = ref('')
// const register = () => {
// router.push('/')
// }
// const onSubmit=async()=>{
// try{
// const userData=await authService.login('userName','userPassword')
// // 获取输入框的值，假设有变量 usernameInput 和 passwordInput
// const enteredUsername = username.value
// const enteredPassword = password.value
// // 在 userData 数组中查找匹配的用户
// const matchedUser = userData.find((user) => user.userName === enteredUsername)

// if (matchedUser && matchedUser.userPassword === enteredPassword) {
// // 用户名和密码匹配
// router.push('/home')
// console.log('登录成功')

// return localStorage.setItem('token', 'Bearer xxx')
// } else {
// // 用户名或密码错误
// alert('用户名或密码错误')
// console.log('登录失败')
// console.log(userData)

// }
// }catch{
// alert('数据库连接中断')
// console.error('Error during login:', error)
// // // 处理错误，例如向用户显示错误消息
// }
// }

// const onSubmit = async () => {

// try {
// // const response = await authService.login(
// // { username: this.userName, password: userPassword })
// const response=await axios.post('http://localhost:8080/api/user',{
// username:this.username,
// password:this.password,
// })
// alert(response.data)

// } catch (error) {
// alert('登录失败')
// console.error(error)
// }
// } 
 </script> -->
