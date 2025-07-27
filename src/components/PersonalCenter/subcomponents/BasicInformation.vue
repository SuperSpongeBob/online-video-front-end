<template>
    <el-divider content-position="center">基本信息</el-divider>
    <el-container>
        <el-main>
            <el-card style="width: 400px;margin:0 auto;">
                <el-form ref="form" :model="form" label-width="40%">
                    <el-form-item label="Id">
                        <div>{{ form.userId }}</div>
                    </el-form-item>
                    <el-form-item label="姓名"> {{ form.userName }} </el-form-item>
                    <el-form-item label="邮箱"> {{ form.userEmail }} </el-form-item>
                    <el-form-item label="性别"> {{ form.userGender }} </el-form-item>
                    <el-form-item label="电话"> {{ form.userPhone }} </el-form-item>
                    <el-form-item label="注册时间"> {{ formatDate(form.userAddTime) }} </el-form-item>
                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
import { formatDate } from "../../../utils/dateUtils";
export default {
    data() {
        return {
            province: '',
            form: {
                userId: "",
                userAddTime: "",
                userEmail: "",
                userGender: "",
                userName: "",
                userPassword: "",
                userPhone: "",
            },
        };
    },

    methods: {
        //  格式化时间
        formatDate:formatDate,

        //  从localStorage获取用户信息
        async userInfo() {
            try {
                //  从session中获取登录时获取的数据
                const userInfo = JSON.parse(localStorage.getItem("userInfo"))
                Object.assign(this.form, userInfo)           //  将userInfo的数据传递到form中

                // console.log(this.form)
            } catch (error) {
                console.error(error);
            }

        },
    },
    mounted() {
        this.userInfo();
    },
};
</script>
