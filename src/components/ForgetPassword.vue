<template>
    <div style="max-width: 600px; margin: 0 auto;">
        <el-alert style="width: 300px; margin: 0 auto; display:flex;justify-content:center;border-radius: 8px;"
            title="温馨提示：验证码由邮箱发送" type="warning" show-icon />
    </div>
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

                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" show-password></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="form.confirmPassword" placeholder="请再次输入新密码" autocomplete="new-password"
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
                    <el-button style="width: 240px;" type="primary" round @click="submitForm">提交</el-button>
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
            userPhone: '',
            userEmail: '',
            code: '',
            newPassword: '',
            confirmPassword: '',
        })

        const formRef = ref(null)
        const countdown = ref(0)
        let timer = null

        const confirmPassword = (rule, str, callback) => {
            if (str === null || typeof str === "undefined" || str === "") {
                callback("请输入密码");
            } else if (str !== form.value.newPassword) {
                callback("两次输入密码不一致!");
            } else {
                callback();
            }
        };

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
            ],
            confirmPassword: [
                { required: true, message: "密码不能为空", trigger: "blur" },
                { validator: confirmPassword, trigger: ["change", "blur"] },
            ],
        }

        const canGetCode = computed(() => {
            return form.value.userPhone && form.value.userEmail
        })

        const getVerificationCode = () => {
            if (!canGetCode.value) return
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
    /* display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; */
    background-color: #f5f5f5;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}

.box-card {
    width: 500px;
    padding: 15px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: white;
}

.code-input {
    display: flex;
    gap: 10px;
}

.code-input .el-input {
    flex: 1;
}
</style>