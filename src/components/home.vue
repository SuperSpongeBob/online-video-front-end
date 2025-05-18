<template>
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>

    <!-- <video ref="videoRef"
                    id="myVideo" controls muted controlsList="nodownload" src="http://192.168.1.1/download/动漫/斩神第一集.mp4" autofocus
                    style="width: 100%; max-height: 75vh;object-fit: contain;">
                    您的浏览器不支持视频播放。
                </video> -->
    127
    <!-- <img src="http://127.0.0.1/images/Stolen.png" style="max-width: 240px; height: 180px;">
    1
    <img src="http://192.168.1.1/images/Stolen.png" style="max-width: 240px; height: 180px;">
    10
    <img src="http://192.168.1.10/images/Stolen.png" style="max-width: 240px; height: 180px;">
    <br>
    s127
    <img src="https://127.0.0.1/images/Stolen.png" style="max-width: 240px; height: 180px;">
    s1
    <img src="https://192.168.1.1/images/Stolen.png" style="max-width: 240px; height: 180px;">
    s10
    <img src="https://192.168.1.10/images/Stolen.png" style="max-width: 240px; height: 180px;"> -->
    <el-button @click="loading=!loading">switch</el-button>
    <el-button @click="getlocal">getlocal</el-button>
  </template>
  
  <script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue'
  const loading = ref(false)
  
  const tableData = [
    {
      date: '2016-05-02',
      name: 'John Smith',
      address: 'No.1518,  Jinshajiang Road, Putuo District',
    },
    {
      date: '2016-05-04',
      name: 'John Smith',
      address: 'No.1518,  Jinshajiang Road, Putuo District',
    },
    {
      date: '2016-05-01',
      name: 'John Smith',
      address: 'No.1518,  Jinshajiang Road, Putuo District',
    },
  ]
const getlocal = async() => {
    const response =await axios.get("http://192.168.1.1/images/Stolen.png")
    console.log(response)
};
  </script>
  
  <style>
  body {
    margin: 0;
  }
  .example-showcase .el-loading-mask {
    z-index: 9;
  }
  </style>

<!-- <template>
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
        </div>
      </template>
      <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
      <template #footer v-if="1==1">Footer content</template>
    </el-card>
  </template>

  <style >
.el-card__header {
    padding: 10px; /* 减少header底部内边距，可按需调整数值 */
}
.el-card__body {
    padding: 0px 0 0 20px; /* 减少body顶部内边距，可按需调整数值 */
}
.el-card__footer {
    padding: 10px;
}
  </style> -->

<!-- <template>
    <div class="login-container">

        <el-card class="login-card">
            <template #header>
                <div class="card-header">
                    <span>账号注册</span>
                </div>
            </template>
            <el-form ref="formRef" :model="form" :rules="validationRules" label-width="120px">
                <el-form-item label="姓名" prop="userName">
                    <el-input v-model="form.userName" autocomplete="new-password"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="userGender">
                    <el-radio-group v-model="form.userGender">
                        <el-radio value="男">男</el-radio>
                        <el-radio value="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">
                    <el-input v-model="form.userEmail" autocomplete="new-password"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="userPhone">
                    <el-input v-model="form.userPhone" autocomplete="new-password"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="userPassword">
                    <el-input type="password" v-model="form.userPassword" autocomplete="new-password"
                        show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="form.confirmPassword" autocomplete="new-password"
                        show-password></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <div class="code-input">
                        <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
                        <el-button type="primary" :disabled="!canGetCode || countdown > 0" @click="getVerificationCode">
                            {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 240px;" type="primary" round @click="submitForm('form')">注册</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 240px;" type="primary" round @click="test">注册</el-button>
                </el-form-item>
            </el-form>
            <el-form-item>
                <el-button link style="margin-left: 0%" type="primary" @click="this.$router.push('/login')">
                    <el-icon>
                        <Back />
                    </el-icon>返回登录
                </el-button>
            </el-form-item>
        </el-card>
    </div>
</template>

<script>
import { ref } from "vue";
import authService from "../utils/authService";
import { isUserName, isPassword, isMobilePhoneNumber, isEmail, checkExist, } from "../utils/validationRules";

export default {
    data() {
        const confirmPassword = (rule, str, callback) => {
            if (str === null || typeof str === "undefined" || str === "") {
                callback("请输入密码");
            } else if (str !== this.form.userPassword) {
                callback("两次输入密码不一致!");
            } else {
                callback();
            }
        };

        return {
            form: ref({
                userName: "",
                userGender: "",
                userEmail: "",
                userPhone: "",
                userPassword: "",
                userAddTime: "",
                confirmPassword: "",
                code: "",
            }),
            formRef:ref(null),
            countdown:0,
            timer:null,
            validationRules: {
                userName: [
                    { required: true, message: "用户名不能为空", trigger: "blur" },
                    { validator: isUserName, trigger: "blur" },
                    { validator: checkExist, trigger: "blur" },
                ],
                userPhone: [
                    { required: true, message: "手机号码不能为空", trigger: "blur" },
                    { validator: isMobilePhoneNumber, trigger: "blur" },
                    { validator: checkExist, trigger: "blur" },
                ],
                userGender: [{ required: true, message: "性别不能为空", trigger: "blur" }],
                userEmail: [
                    { required: true, message: "邮箱不能为空", trigger: "blur" },
                    { validator: isEmail, trigger: "blur" },
                    { validator: checkExist, trigger: "blur" },
                ],
                userPassword: [
                    { required: true, message: "密码不能为空", trigger: "blur" },
                    { validator: isPassword, trigger: "blur" },
                ],
                confirmPassword: [
                    { required: true, message: "密码不能为空", trigger: "blur" },
                    { validator: confirmPassword, trigger: ["change", "blur"] },
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ],
            },
        };
    },
    methods: {
        getVerificationCode(){
            if(!this.canGetCode)return
            authService.registerCode({userPhone:this.form.userPhone,userEmail:this.form.userEmail})
            .then(response=>{
                console.log(response)
                const {data} = response
                if(data.success){
                    this.$message.success({message:'验证码已发送',showClose:true})
                    this.$notify.success({title:'邮箱验证码已发送',message:'验证码有效期为5分钟，失效请重新发送'})
                    this.startCountdown()
                }else{
                    this.$message.error({message:`${data.message}`,showClose:true})
                }
            })
            .catch(error=>{
                if(error.response){
                    this.$message.error({message:error.response.data.message||'发送验证码失败',showClose:true})
                }else{
                    console.error(error)
                    this.$message.error({message:'网络错误，请稍后重试code',showClose:true})
                }
            })
        },
        submitForm(){
            this.$refs.formRef.validate(valid=>{
                if(valid){
                    authService.registerInsert(this.form)
                    .then(response=>{
                        console.log(response)
                        const {data} =response
                        if(data.success){
                            this.$message.success({message:`${data.message}`,showClose:true})
                            this.$notify.success({title:'账号注册成功',message:'请返回登录页进行登录'})
                        }else{
                            this.$message.error({message:`${data.message}`,showClose:true})
                        }
                    })
                    .catch(error=>{
                        if(error.response){
                            this.$message.error({message:`${error.response.data.message}`||'密码重置失败',showClose:true})
                        }else{
                            this.$message.error({message:'网络错误，请稍后重试register',showClose:true})
                        }
                    })
                }
            })
        },
        startCountdown(){
            this.countdown=60
            this.timer=setInterval(()=>{
                this.countdown--
                if(this.countdown<=0){
                    clearInterval(this.timer)
                }
            },1000)
        },
        test(){
            this.$notify.success({message:'asdfas',title:"11111"})
        }
    },
    computed:{
        canGetCode(){
            return Boolean(this.form.userPhone&&this.form.userEmail)
        }
    }
};

</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.login-card {
    width: 500px;
}

.code-input {
    display: flex;
    gap: 20px;
}

.code-input .el-input{
    flex: 1;
}
</style> -->



<!-- <template>
    <el-button plain @click="dialogTableVisible = true;test()">
        Open a Table nested Dialog
    </el-button>
    <el-button @click="getDanmakus">getDanmakus</el-button>
    <el-button @click="getComments">getComment</el-button>
    <el-button @click="test">test</el-button>

    <el-dialog v-model="dialogTableVisible" draggable width="800">
        <p>评论</p>
        <el-table :data="commentData" height="100" @scroll.capture="handleScroll">
            <el-table-column property="userName" label="用户名" width="150" />
            <el-table-column property="videoCommentContent" label="评论内容" />
            <el-table-column property="videoCommentTime" label="评论时间" width="200" />
            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click.prevent="deleteComment(scope)">
                        Remove
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <p>弹幕</p>
        <el-table :data="danmakuData" height="250">
            <el-table-column property="danmakuId" label="弹幕Id" width="150" />
            <el-table-column property="text" label="弹幕内容" width="200" />
            <el-table-column property="time" label="出现时间" />
            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click.prevent="deleteDanmaku(scope)">
                        Remove
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>

    <el-table :data="gridData" height="250">
        <el-table-column property="date" label="Date" width="150" />
        <el-table-column property="name" label="Name" width="200" />
        <el-table-column property="address" label="Address" />
        <el-table-column fixed="right" label="Operations" min-width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="deleteDanmaku(scope.$index)">
                    Remove
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import authService from '../utils/authService';

export default {
    data() {
        return {
            dialogTableVisible: false,
            gridData: [
                {
                    date: '2016-05-02',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-04',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-01',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-03',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-02',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-04',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-01',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-03',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-02',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-04',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-01',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-03',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-02',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-04',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-01',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
                {
                    date: '2016-05-03',
                    name: 'John Smith',
                    address: 'No.1518,  Jinshajiang Road, Putuo District',
                },
            ],
            danmakuData: null,
            commentData: null,
            pageNum: 1,
            pageSize: 6,
            isLoading: false

        }
    },
    methods: {
        test(){
            console.log(Date.now())
        },
        async getComments() {
            if (this.isLoading) return
            this.isLoading = true
            const condition = { videoId: 49, pageNum: this.pageNum, pageSize: this.pageSize }
            const response = await authService.videoComment(condition)
            console.log(response)
            if (response.status == 200) {
                this.commentData = response.data.map(item => ({
                    userName: item.userName,
                    videoCommentContent: item.videoCommentContent,
                    videoCommentTime: item.videoCommentTime
                }))
            }
            this.isLoading = false
            this.pageNum++
        },
        async deleteComment(scope){
            this.$message.warning({ message: `删除评论 id为`, showClose: true })
            //  删除表格中的数据
            this.commentData.splice(scope.$index, 1)
        },

        async getDanmakus() {
            const condition = { videoId: 49 }
            const response = await authService.getDanmakus(condition)
            console.log(response)
            if (response.status == 200) {
                this.danmakuData = response.data.map(item => ({
                    danmakuId: item.danmakuId,
                    text: item.text,
                    time: item.time
                }))
            }
        },
        deleteDanmaku(scope) {
            this.$message.warning({ message: `删除弹幕 id为`, showClose: true })
            //  删除表格中的数据
            this.gridData.splice(scope.$index, 1)
        },

        //  检测滚动情况
        handleScroll(event) {
            const container = event.target;
            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;
            const scrollHeight = container.scrollHeight;
            //  检查是否滚动到底部
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                this.getComments();                         // 加载更多评论
            }
        },
    }
}
</script> -->


<!-- <template>
    <div style="display: flex; align-items: center">
      <el-popover placement="right" :width="400" trigger="click" v-model:visible="isPopoverVisible">
        <template #reference>
          <el-button style="margin-right: 16px">Click to activate</el-button>
        </template>
        <div>
          <el-table :data="gridData1">
            <el-table-column width="150" property="date" label="date" />
            <el-table-column width="100" property="name" label="name" />
            <el-table-column width="300" property="address" label="address" />
          </el-table>
          <el-table :data="gridData2">
            <el-table-column width="150" property="date" label="date" />
            <el-table-column width="100" property="name" label="name" />
            <el-table-column width="300" property="address" label="address" />
          </el-table>
        </div>
      </el-popover>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  // 控制弹出框的显示状态
  const isPopoverVisible = ref(false);
  
  // 第一个表格的数据
  const gridData1 = [
    {
      date: '2016-05-02',
      name: 'Jack',
      address: 'New York City',
    },
    {
      date: '2016-05-04',
      name: 'Jack',
      address: 'New York City',
    },
    {
      date: '2016-05-01',
      name: 'Jack',
      address: 'New York City',
    },
    {
      date: '2016-05-03',
      name: 'Jack',
      address: 'New York City',
    },
  ];
  
  // 第二个表格的数据
  const gridData2 = [
    {
      date: '2016-06-02',
      name: 'Alice',
      address: 'Los Angeles',
    },
    {
      date: '2016-06-04',
      name: 'Alice',
      address: 'Los Angeles',
    },
    {
      date: '2016-06-01',
      name: 'Alice',
      address: 'Los Angeles',
    },
    {
      date: '2016-06-03',
      name: 'Alice',
      address: 'Los Angeles',
    },
  ];
  </script> -->

<!-- <template>
    <div class="forget-password-container">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>忘记密码</span>
                </div>
            </template>

            <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
                <el-form-item label="手机号" prop="userPhone">
                    <el-input v-model="form.userPhone" placeholder="请输入手机号"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="userEmail">
                    <el-input v-model="form.userEmail" placeholder="请输入邮箱"></el-input>
                </el-form-item>

                <el-form-item label="验证码" prop="code">
                    <div class="code-input">
                        <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
                        <el-button type="primary" :disabled="!canGetCode || countdown > 0" @click="getVerificationCode">
                            {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" show-password></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                </el-form-item>

                <el-button link type="primary" @click="this.$router.push('/login')">
                    <el-icon>
                        <Back />
                    </el-icon>返回登录
                </el-button>

            </el-form>
        </el-card>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ElNotification } from 'element-plus'
import { isMobilePhoneNumber, isEmail, isPassword } from '../utils/validationRules'
import authService from '../utils/authService'

export default {
    setup() {
        const form = ref({
            userPhone: '18613160007',
            userEmail: '3024799675@qq.com',
            code: '',
            newPassword: ''
        })

        const formRef = ref(null)
        const countdown = ref(0)
        let timer = null

        const rules = {
            userPhone: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator: isMobilePhoneNumber, trigger: 'blur' }
            ],
            userEmail: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: isEmail, trigger: 'blur' }
            ],
            code: [
                { required: true, message: '请输入验证码', trigger: 'blur' }
            ],
            newPassword: [
                { required: true, message: '请输入新密码', trigger: 'blur' },
                { validator: isPassword, trigger: 'blur' }
            ]
        }

        const canGetCode = computed(() => {
            return form.value.userPhone && form.value.userEmail
        })

        const getVerificationCode = () => {
            if (!canGetCode.value) return

            // axios.post('http://192.168.1.1/api/auth/forget-password/code', {
            //     userPhone: form.value.userPhone,
            //     userEmail: form.value.userEmail
            // })
            authService.forgetPasswordCode({
                userPhone: form.value.userPhone,
                userEmail: form.value.userEmail
            })
                .then(response => {
                    console.log(response)
                    const { data } = response
                    if (data.success) {
                        ElMessage.success('验证码已发送')
                        ElNotification({
                            title: '邮箱验证码已发送',
                            message: '验证码有效期为5分钟，失效请重新发送',
                            type: 'success',
                        })
                        startCountdown()
                    } else {
                        ElMessage.error(data.message)
                    }
                })
                .catch(error => {
                    if (error.response) {
                        ElMessage.error(error.response.data.message || '发送验证码失败')
                    } else {
                        ElMessage.error('网络错误，请稍后重试code')
                    }
                })
        }

        const startCountdown = () => {
            countdown.value = 60
            timer = setInterval(() => {
                countdown.value--
                if (countdown.value <= 0) {
                    clearInterval(timer)
                }
            }, 1000)
        }

        const submitForm = () => {
            formRef.value.validate(valid => {
                if (valid) {
                    // axios.post('http://192.168.1.1/api/auth/forget-password/reset', form.value)
                    authService.forgetPasswordReset(form.value)
                        .then(response => {
                            console.log(response)
                            const { data } = response;
                            if (data.success) {
                                ElMessage.success(data.message);
                                ElNotification({
                                    title: '重置密码成功',
                                    message: '请返回登录页进行登录',
                                    type: 'success',
                                })
                            } else {
                                ElMessage.error(data.message);
                            }
                        })
                        .catch(error => {
                            if (error.response) {
                                ElMessage.error(error.response.data.message || '密码重置失败');
                            } else {
                                ElMessage.error('网络错误，请稍后重试reset');
                            }
                        });
                }
            });
        };

        return {
            form,
            formRef,
            rules,
            countdown,
            canGetCode,
            getVerificationCode,
            submitForm,
        }
    }
}
</script>

<style scoped>
.forget-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.box-card {
    width: 500px;
}

.code-input {
    display: flex;
    gap: 10px;
}

.code-input .el-input {
    flex: 1;
}
</style> -->



<!-- <template>
    <div class="forget-password-container">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>忘记密码</span>
          </div>
        </template>
        
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="form.userPhone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          
          <el-form-item label="邮箱" prop="userEmail">
            <el-input v-model="form.userEmail" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          
          <el-form-item label="验证码" prop="code">
            <div class="code-input">
              <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
              <el-button 
                type="primary" 
                :disabled="!canGetCode || countdown > 0"
                @click="getVerificationCode"
              >
                {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          
          <el-form-item label="新密码" prop="newPassword">
            <el-input 
              v-model="form.newPassword" 
              type="password" 
              placeholder="请输入新密码"
              show-password
            ></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'
  
  export default {
    setup() {
      const form = ref({
        userPhone: '',
        userEmail: '',
        code: '',
        newPassword: ''
      })
      
      const formRef = ref(null)
      const countdown = ref(0)
      let timer = null
      
      const rules = {
        userPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        userEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'userEmail', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ]
      }
      
      const canGetCode = computed(() => {
        return form.value.userPhone && form.value.userEmail
      })
      
      const getVerificationCode = () => {
        if (!canGetCode.value) return
        
        axios.post('http://192.168.1.1/api/auth/forget-password/code', {
          userPhone: form.value.userPhone,
          userEmail: form.value.userEmail
        }).then(() => {
          ElMessage.success('验证码已发送')
          startCountdown()
        }).catch(error => {
          ElMessage.error(error.response?.data?.message || '发送验证码失败')
        })
      }
      
      const startCountdown = () => {
        countdown.value = 60
        timer = setInterval(() => {
          countdown.value--
          if (countdown.value <= 0) {
            clearInterval(timer)
          }
        }, 1000)
      }
      
      const submitForm = () => {
        formRef.value.validate(valid => {
          if (valid) {
            axios.post('http://192.168.1.1/api/auth/forget-password/reset', form.value)
              .then(() => {
                ElMessage.success('密码重置成功')
                // 跳转到登录页
                window.location.href = '/login'
              })
              .catch(error => {
                ElMessage.error(error.response?.data?.message || '密码重置失败')
              })
          }
        })
      }
      
      return {
        form,
        formRef,
        rules,
        countdown,
        canGetCode,
        getVerificationCode,
        submitForm
      }
    }
  }
  </script>
  
  <style scoped>
  .forget-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .box-card {
    width: 500px;
  }
  
  .code-input {
    display: flex;
    gap: 10px;
  }
  
  .code-input .el-input {
    flex: 1;
  }
  </style> -->







<!-- <template>
    <div class="password-reset-container">
      <el-card class="reset-card">
        <h2 class="reset-title">重置密码</h2>
        <el-form :model="formData" label-width="100px">
            <el-form-item label="手机号码">
            <el-input v-model="formData.userEmail" placeholder="请输入手机号码" clearable></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址">
            <el-input v-model="formData.userEmail" placeholder="请输入邮箱地址" clearable></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="formData.newPassword" type="password" placeholder="请输入新密码" clearable></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="formData.verificationCode" placeholder="请输入验证码" clearable>
              <template #suffix>
                <el-button
                  :loading="isCounting"
                  :disabled="isCounting"
                  @click="sendVerificationCode"
                  :class="{ 'countdown-button': isCounting }"
                >
                  {{ isCounting? countdown + '秒后重试' : '获取验证码' }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetPassword">重置密码</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const formData = ref({
    userEmail: '',
    newPassword: '',
    verificationCode: ''
  });
  const isCounting = ref(false);
  const countdown = ref(60);
  
  const sendVerificationCode = () => {
    if (isCounting.value) return;
    isCounting.value = true;
    countdown.value = 60;
    // 这里模拟发送验证码的逻辑，实际需要替换为真实的接口请求
    console.log(`向 ${formData.value.userEmail} 发送验证码`);
    const countdownInterval = setInterval(() => {
      if (countdown.value > 1) {
        countdown.value--;
      } else {
        clearInterval(countdownInterval);
        isCounting.value = false;
        countdown.value = 60;
      }
    }, 1000);
  };
  
  const resetPassword = () => {
    // 这里模拟重置密码的逻辑，实际需要替换为真实的接口请求
    console.log(`使用验证码 ${formData.value.verificationCode} 重置密码为 ${formData.value.newPassword}`);
  };
  </script>
  
  <style scoped>
  .password-reset-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .reset-card {
    width: 400px;
    padding: 30px;
  }
  
  .reset-title {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .countdown-button {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style> -->