<template>
    <el-divider content-position="center">信息修改</el-divider>
    <el-container>
        <el-main>
            <el-card style="width: 400px;margin:0 auto;">
                <el-form ref="form" :model="form" :rules="validationRules" label-width="20%">
                    <el-form-item label="Id">
                        <div>{{ form.userId }}</div>
                    </el-form-item>
                    <el-form-item label="姓名" prop="userName">
                        <el-input v-model="form.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="userPhone">
                        <el-input v-model="form.userPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="userEmail">
                        <el-input v-model="form.userEmail"></el-input>
                    </el-form-item>

                    <el-form-item label="性别" prop="userGender">
                        <el-radio-group v-model="form.userGender">
                            <el-radio label="男" value="男">男</el-radio>
                            <el-radio label="女" value="女">女</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="restore">恢复</el-button>
                        <el-button @click="resetForm">重置</el-button>
                        <el-button @click="tempStorage">暂存</el-button>
                        <el-button type="primary" @click="editUserInfo('form')">修改</el-button>
                    </el-form-item>

                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
import { isUserName, isMobilePhoneNumber, isEmail, checkExist, } from "../../../utils/validationRules";
import authService from "../../../utils/authService";

export default {
    data() {
        return {
            form: {
            },
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
            },
        };
    },
    methods: {
        //从storage中获取用户信息
        getData() {
            try {
                this.form = JSON.parse(localStorage.getItem("userInfo"));
                // console.log( JSON.stringify(this.form.userIdcard))
            } catch (error) {
                console.error(error);
            }
        },

        //提交修改
        async editUserInfo(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    authService.updateUserInfo(this.form)
                        .then((response) => {
                            console.log(response);
                            const { data } = response
                            if (data.success) {
                                localStorage.setItem("userInfo", JSON.stringify(this.form));
                                this.$message.success({ message: "修改成功", showClose: true, })
                            } else {
                                this.$message.error({ message: `${data.message}`, showClose: true })
                            }
                        })
                        .catch(error => {
                            if (error.response) {
                                this.$message.error({ message: `${error.response.data.message}` || '信息更新失败', showClose: true })
                            } else {
                                this.$message.error({ message: '网络错误，请稍后重试editUserInfo', showClose: true })
                            }
                        })
                }
            });
            // this.resetForm();
            // this.getData();
        },
        resetForm() {
            this.form = [];
        },
        restore() {
            this.form = JSON.parse(sessionStorage.getItem("userInfo"));
        },
        tempStorage() {
            sessionStorage.setItem("userInfo", JSON.stringify(this.form));
        },
    },
    mounted() {
        this.getData();
    },
};
</script>

//
<script setup>
// import { ref ,reactive} from "vue";
// import axios from "axios"
// import authService from "../../../utils/authService";

// const form = reactive({
//   userId: "24",
//   userAddTime: "11",
//   userCredibility: '',
//   userEmail: 'z',
//   userGender: 'z',
//    userIdcard: '',
//   userLoginIp: '',
//   userLoginStatu: '',
//   userMoney: '',
//   userName: "zz",
//   userNickname: '',
//   userPassword: "",
//   userPhone: ''

// }),

//   handleEdit=async(raw)=>  {
// },

//   submitForm  =async () => {
//     try {
//       if (this.form.id) {
//         // await axios.put(`http://127.0.0.1/api/data/${this.form.userId}`, this.form);
//       } else {
//         // await axios.post('http://127.0.0.1/api/data', this.form);
//       }
//       this.resetForm();
//       this.getData();
//     } catch (error) {
//       console.error(error);
//     }
//   },
//   resetForm =() => {
//     this.form.id = null;
//     this.form.name = '';
//     this.form.level = '';
//   }

//  const editData  =async ()  =>{
//     // this.form = { ...row };
//     console.log('flksjgh')
//     try {
//       const userInfo = await authService.search(35)
//       console.log(form)
//       console.log(userInfo[0])
//       Object.assign(form,userInfo[0])
//       // form.value=userInfo[0].value
//       // form=(userInfo[0])
//       console.log(form)
//     } catch (error) {
//       console.error(error)
//     }
//   },
//   deleteData =async  ()=> {
//     try {
//       await axios.delete(`http://127.0.0.1/api/data/${id}`);
//       this.getData();
//     } catch (error) {
//       console.error(error);
//     }
//   }

//
</script>

<!-- <template>
    <div style="width: 70%;margin-top: 5%">
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="100px"
               class="demo-dynamic"
    
    
      >
        <el-form-item
          style="width: 49%"
          label="昵称"
          prop="name"
          :rules="[
              { required: true, message: '请注意昵称长度在3~15个字符', trigger: 'blur' },
              { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ]"
    
        >
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="生日">
                <el-date-picker type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>

        <el-form-item label="性别">
                <el-radio-group>
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                  <el-radio label="其他">其他</el-radio>
                </el-radio-group>
              </el-form-item>
        <el-form-item
          style="width: 60%"
          prop="email"
          label="邮箱"
          :rules="[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]"
        >
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
    
        <el-form-item
          style="width: 80%;height: 120px"
          label="座右铭"
          prop="motto"
          :rules="[
              { required: false, message: '请输入座右铭', trigger: 'blur' },
              { min: 0, max: 150, message: '请注意长度不能超过150个字符', trigger: 'blur' }
            ]"
    
        >
          <el-input type="textarea" style="height: 100px;resize: none" v-model="ruleForm.motto"></el-input>
        </el-form-item>
    
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交修改</el-button>
    
        </el-form-item>
        
      </el-form>
      
    </div>
    </template>
    <script>
    export default {
      name: "infoeditor",
      data() {
        return {
          ruleForm: {
            name: '',
            sex: '男',
            email: '',
            city: '',
            motto: '',
    
          },
        };
      },
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
    
      }
    
    }
    </script>
    
    <style scoped>
    </style> -->
