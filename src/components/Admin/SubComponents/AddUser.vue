<template>
    <el-divider content-position="center">新增用户信息</el-divider>

    <el-card style="width: 400px;margin: 0 auto;">

        <el-form ref="form" :model="form" :rules="rules" label-width="20%" style="max-width: 90%;">
            <input type="text" style="display: none;" autocomplete="username" />
            <input type="password" style="display: none;" autocomplete="current-password" />

            <el-form-item label="姓名" prop="userName">
                <el-input autocomplete="new-password" v-model="form.userName" placeholder="名字" clearable />
            </el-form-item>
            <el-form-item label="电话" prop="userPhone">
                <el-input autocomplete="new-password" v-model="form.userPhone" placeholder="手机号"
                    @input="filterNonNumeric('userPhone')" clearable />
            </el-form-item>

            <el-form-item label="邮箱" prop="userEmail">
                <el-input v-model="form.userEmail" placeholder="电子邮箱" autocomplete="new-password" clearable />
            </el-form-item>

            <el-form-item label="性别" prop="userGender">
                <el-select v-model="form.userGender" placeholder="男 / 女" clearable>
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                </el-select>
            </el-form-item>

            <el-form-item label="角色" prop="userRole">
                <el-select v-model="this.form.userRole.roleId" placeholder="角色" clearable>
                    <el-option label="普通" value="1" />
                    <el-option label="会员" value="2" />
                    <el-option label="管理员" value="3" />
                </el-select>
            </el-form-item>

            <el-form-item label="密码" prop="userPassword">
                <el-input v-model="form.userPassword" type="password" @input="handleInput" show-password></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit('form')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { ref } from 'vue';
import authService from '../../../utils/authService';
import { isUserName, isPassword, userRole, isMobilePhoneNumber, isEmail, checkExist } from '../../../utils/validationRules';

export default {
    data() {
        return {
            form: {
                userRole: { roleId: "" },
            },
            rules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { validator: isUserName, trigger: "blur" },
                    { validator: checkExist, trigger: "blur" },
                ],
                userPhone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: isMobilePhoneNumber, trigger: "blur" },
                    { validator: checkExist, trigger: "blur" },
                ],
                userGender: [{ required: true, message: "性别不能为空", trigger: "blur" }],
                userRole: [
                    { required: true, message: "角色不能为空", trigger: "blur" },
                    { validator: userRole, trigger: 'blur' },
                ],
                userEmail: [
                    { required: true, message: "邮箱不能为空", trigger: "blur" },
                    { validator: isEmail, trigger: "blur" },
                    { validator: checkExist, trigger: "blur" },
                ],
                userPassword: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: isPassword, trigger: 'blur' }
                ]
            },
        }
    },
    methods: {
        //  监测密码输入框，自动删除输入的空格
        handleInput(value) {
            this.form.userPassword = value.replace(/\s+/g, '')
        },

        //  监测手机号、身份证号输入，只允许输入数字
        filterNonNumeric(field) {
            // 根据传入的字段名获取当前输入的值
            let value = this.form[field];
            // 只保留数字字符
            value = value.replace(/\D/g, '');
            // 更新 v-model 绑定的值
            this.form[field] = value;
        },

        async submit(formName) {
            //  获取当前注册时间
            // this.form.userAddTime = ref(new Date().toLocaleString());
            this.form.userAddTime = Date.now()

            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    // const insertDate = { user: this.form, userRole: this.form.userRole }
                    const insertDate = {
                        userName: this.form.userName,
                        userPhone: this.form.userPhone,
                        userEmail: this.form.userEmail,
                        userPassword: this.form.userPassword,
                        userGender:this.form.userGender,
                        roleId: this.form.userRole.roleId
                    }
                    const response = await authService.adminInsertUser(insertDate)
                    console.log(response)
                    if (response.data == true) {
                        console.log(response.status)
                        this.$message.success({ message: '添加用户成功', showClose: true })
                    } else if (response.status == 204) {
                        this.$message.error({ message: '添加用户失败,请更换手机号重试', showClose: true })
                    } else {
                        this.$message.error({ message: '异常警告', showClose: true })
                    }
                } else {
                    console.log("error")
                    return false
                }
            })
        },
    }
}
</script>