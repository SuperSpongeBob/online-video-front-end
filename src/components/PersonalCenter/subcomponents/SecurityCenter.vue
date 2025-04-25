<template>
    <el-divider content-position="center">密码修改</el-divider>
    <el-container>

        <el-main>
            <el-card style="width: 400px;margin: 0 auto;">
                <el-form ref="form" :model="form" :rules="validationRules" label-width="20%">
                    <el-form-item label="Id">
                        <div>{{ form.userId }}</div>
                    </el-form-item>

                    <el-form-item label="旧密码" prop="userPassword">
                        <el-input v-model="form.userPassword" type="password" placeholder="输入旧密码" show-password />
                    </el-form-item>
                    <el-form-item label="新密码" prop="userNewPassword">
                        <el-input v-model="form.userNewPassword" type="password" placeholder="输入新密码" show-password />
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
import { isPassword, checkExist, } from "../../../utils/validationRules";
import authService from "../../../utils/authService";

export default {
    name: 'SecurityCenter',
    data() {
        return {
            form: {
                userId: "",
                userPassword: "",
                userNewPassword: ""

            },
            validationRules: {
                userPassword: [
                    { required: true, message: "密码不能为空", trigger: "blur" },
                    { validator: isPassword, trigger: "blur" },
                    { validator: checkExist, trigger: "blur" },
                ],
                userNewPassword: [
                    { required: true, message: "密码不能为空", trigger: "blur" },
                    { validator: isPassword, trigger: "blur" },
                    { validator: checkExist, trigger: "blur" },
                ],

            },
        };
    },
    methods: {
        //从storage中获取用户信息
        getData() {
            console.log(JSON.parse(localStorage.getItem("userInfo")).userId)
            try {
                this.form.userId = JSON.parse(localStorage.getItem("userInfo")).userId;
            } catch (error) {
                console.error(error);
            }
        },

        //提交修改
        async editUserInfo(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    console.log(this.form)
                    try {
                        const response = await authService.updateUserPassword(this.form)
                        console.log(response)
                        if (response.data == true) {
                            this.$message.success({ showClose: true, message: "修改成功" })
                        } else if (response.status == 200) {
                            this.$message.warning({ message: '请先登录', showClose: true })
                        }
                    } catch (error) {
                        if (error.response.status == 400) {
                            this.$message.error({ showClose: true, message: "修改密码失败，旧密码不正确" });
                        }
                        console.error(error)
                    }
                } else {
                    console.log("修改失败");
                    return false;
                }
            });
        },
        resetForm() {
            this.form = [];
        },
        restore() {
            this.form = JSON.parse(sessionStorage.getItem("passwd"));
        },
        tempStorage() {
            sessionStorage.setItem("passwd", JSON.stringify(this.form));
        },
    },
    mounted() {
        this.getData();
    },
};
</script>
