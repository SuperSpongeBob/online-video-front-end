<template>
    <div>
        <el-collapse v-model="activeName">

            <el-collapse-item title="条件查询" name="1">

                <el-form :inline="true" :model="this.queryUser" class="demo-form-inline">
                    <el-form-item label="编号">
                        <el-input-number v-model="this.queryUser.userId" placeholder="用户id" clearable />
                    </el-form-item>

                    <el-form-item label="性别">
                        <el-select v-model="this.queryUser.userGender" placeholder="男 / 女" clearable>
                            <el-option label="男" value="男" />
                            <el-option label="女" value="女" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="身份">
                        <el-select v-model="this.queryUser.roleId" placeholder="身份" clearable>
                            <el-option label="用户" value="0" />
                            <el-option label="会员" value="1" />
                            <el-option label="管理员" value="2" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="姓名">
                        <el-input v-model="this.queryUser.userName" placeholder="名字（模糊查询）" autocomplete="true"
                            clearable />
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="this.queryUser.userPhone" placeholder="手机号（模糊查询）" autocomplete="true"
                            @input="filterNonNumeric('userPhone')" clearable />
                    </el-form-item>

                    <el-form-item label="邮件">
                        <el-input v-model="this.queryUser.userEmail" placeholder="电子邮箱（模糊查询）" autocomplete="true"
                            clearable />
                    </el-form-item>


                    <el-form-item label="注册时间">
                        <el-date-picker v-model="this.dateRange" type="daterange" unlink-panels range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        <!-- <el-date-picker v-model="queryUser.date1" type="date" aria-label="Pick a date"
                            placeholder="选择日期" />
                        <el-time-picker v-model="queryUser.date2" aria-label="Pick a time" placeholder="选择时间" /> -->
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="query">筛选</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>



        <div style="width: 100%;">
            <el-table :data="queryData" border stripe max-height="600"
                @scroll.capture="handleScroll($event, 'queryUser')">
                <el-table-column fixed="left" prop="userId" label="id" width="100" show-overflow-tooltip />
                <el-table-column prop="roleId" label="等级" width="100" show-overflow-tooltip>
                    <template #default="scope">
                        <span>{{ getRule(scope.row.roleId) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="姓名" width="180" show-overflow-tooltip />
                <el-table-column prop="userGender" label="性别" width="80" show-overflow-tooltip />
                <el-table-column prop="userPhone" label="电话" width="220" show-overflow-tooltip />
                <el-table-column prop="userEmail" label="邮箱" width="220" show-overflow-tooltip />
                <el-table-column prop="userAddTime" label="注册时间" width="220" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span>{{ formatDate(row.userAddTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="Operations" min-width="100">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                        <el-popconfirm title="Are you sure to delete this?" @confirm="deleteUser(scope.row)">
                            <template #reference>
                                <el-button link type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="conterDialogVisible" title="编辑用户信息" width="500" draggable overflow align-center>
            <el-form ref="dialogUserData" :model="dialogUserData" label-width="100px">
                <el-form-item label="编号">
                    <span>{{ dialogUserData.userId }}</span>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="dialogUserData.userName" placeholder="名字" clearable />
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="dialogUserData.userPhone" placeholder="手机号" clearable />
                </el-form-item>

                <el-form-item label="邮件">
                    <el-input v-model="dialogUserData.userEmail" placeholder="电子邮箱" clearable />
                </el-form-item>

                <el-form-item label="性别">
                    <el-select v-model="dialogUserData.userGender" placeholder="男 / 女" clearable>
                        <el-option label="男" value="男" />
                        <el-option label="女" value="女" />
                    </el-select>
                </el-form-item>

                <el-form-item label="身份">
                    <el-select v-model="dialogUserData.roleId" placeholder="身份" clearable>
                        <el-option label="普通" value="1" />
                        <el-option label="会员" value="2" />
                        <el-option label="管理员" value="3" />
                    </el-select>
                </el-form-item>

                <el-form-item label="密码">
                    <el-input v-model="dialogUserData.userPassword" @input="handleInput" type="password"
                        placeholder="设置密码" show-password />
                </el-form-item>

            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="conterDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="update"> 修改 </el-button>
                </div>
            </template>
        </el-dialog>
    </div>

</template>

<script>
import authService from '../../../utils/authService';
import { formatDate } from '../../../utils/dateUtils';

export default {
    data() {
        return {
            activeName: '1',            //  默认打开name:1的折叠面板
            loading: false,              //  加载状态
            queryUser: {
                UserId: '',
                userName: '',
                userGender: '',
                pageNum: 1,             //  初始化页码
                pageSize: 15,           //  设置加载每页大小
                isLoading: false         //  是否正在加载
            },
            queryData: [],              //  查询后的数据
            conterDialogVisible: false, //  false时隐藏
            dialogUserData: {},         //  对话框中的数据、管理员操作的数据
            dateRange: null,

        }
    },
    methods: {
        //  格式化时间戳
        formatDate: formatDate,

        //  监测密码输入框，自动删除输入的空格
        handleInput(value) {
            this.dialogUserData.userPassword = value.replace(/\s+/g, '')
        },

        //  监测手机号、身份证号输入，只允许输入数字
        filterNonNumeric(field) {
            let value = this.queryUser[field];          //   根据传入的字段名获取当前输入的值            
            value = value.replace(/\D/g, '');           //   利用正则表达式，只保留数字字符
            this.queryUser[field] = value;              //   更新 v-model 绑定的值
        },

        getRule(roleId) {
            switch (roleId) {
                case 0:
                    return "普通";
                case 1:
                    return "普通";
                case 2:
                    return "会员";
                case 3:
                    return "管理员"
                default:
                    return ""
            }
        },
        async update() {
            this.dialogUserData.roleId = parseInt(this.dialogUserData.roleId)                 //  将String类型转回number类型
            // const response = await authService.adminUpdateUser(this.dialogUserData)
            // if (response.status == 200) {

            //     let userItem = this.queryData.find(item => item.userId == (this.dialogUserData.userId))   //  根据用户id找到数据
            //     Object.assign(userItem, this.dialogUserData)                                            //  将数据替换
            //     this.dialogUserData.roleId = String(this.dialogUserData.roleId)

            //     this.$message.success({ message: '更新用户成功', showClose: true })
            // } else {
            //     this.$message.error({ message: '更新失败', showClose: true })
        // }

            authService.adminUpdateUser(this.dialogUserData)
            .then(response=>{
                const {data} = response
                if(data.success){
                    let userItem = this.queryData.find(item=>item.userId==(this.dialogUserData.userId))     //  根据用户Idzhaodoa数据
                    Object.assign(userItem,this.dialogUserData)                                             //  将数据替换
                    this.dialogUserData.roleId = String(this.dialogUserData.roleId)                     //  将identify字符串化
                    this.$message.success({message:`${data.message}`,showClose:true})
                }else{
                    this.$message.error({message:`${data.message}`,showClose:true})
                }
            })
            .catch(error=>{
                if(error.response){
                    this.$message.error({message:`${error.response.data.message}`||'更新用户失败',showClose:true})
                }else{
                    this.$message.error({message:`网络错误，请稍后重试`,showClose:true})
                }
            })
            
        },

        //  编辑按钮点击时
        edit(row) {
            // this.dialogUserDate = row
            this.dialogUserData = JSON.parse(JSON.stringify(row));      //  创建row的深拷贝，避免数据的双向绑定
            this.dialogUserData.roleId = String(this.dialogUserData.roleId);  //  将vip字符串格式化，避免传递到dialog时显示的是数字
            this.conterDialogVisible = true
        },

        //  删除按钮点击时
        async deleteUser(row) {
            console.log('delete' + row.userId)
            const index = this.queryData.findIndex(item => item.userId == row.userId)
            const response = await authService.adminDeleteUser(row.userId)
            if (response.status == 200) {
                if (index != -1) {
                    this.queryData.splice(index, 1)
                    this.$message.success({ message: '删除用户成功', showClose: true })
                    return
                }

            } else {
                this.$message.success({ message: '删除失败,错误代码：' + response.status, showClose: true })
            }
        },

        //  筛选按钮点击时
        async query() {
            console.log(this.queryUser)
            this.queryData = []                                 //  每次点击筛选按钮时重置数据，并且恢复页数
            this.queryUser.pageNum = 1
            this.queryUser.isLoading = false

            this.queryUsers()
        },

        //  根据条件查询用户信息
        async queryUsers() {

            try {
                if (this.queryUser.isLoading) return      //  如果正在加载直接退出
                this.queryUser.isLoading = true
                let startTime = null
                let endTime = null;
                if (this.dateRange &&this.dateRange.length == 2) {
                    startTime = new Date(this.dateRange[0]).getTime();
                    endTime = new Date(this.dateRange[1]).getTime();
                    console.log(startTime + "+" + endTime)
                }
                console.log(this.queryUser)
                // return
                // const response = await axios.post('http://localhost:8080/admin/users', this.queryUser)
                const response = await authService.adminUsers(this.queryUser,startTime,endTime)
                console.log(response)
                if (response.data != '' && response.data != null) {
                    const formattedNewUserData = response.data.map(item => ({
                        userId: item.userId,
                        roleId: item.roleId,
                        userName: item.userName,
                        userGender: item.userGender,
                        userPhone: item.userPhone,
                        userEmail: item.userEmail,
                        userAddTime: item.userAddTime,
                    }));
                    // 将新数据合并到现有数据中
                    this.queryData = [...this.queryData, ...formattedNewUserData];
                    this.queryUser.pageNum++
                    this.queryUser.isLoading = false
                } else {
                    this.$message.warning({ message: '没有更多信息', showClose: true })
                }

            } catch (error) {
                console.error(error)
            }
        },

        //  检测滚动情况
        handleScroll(event, where) {
            const { scrollTop, scrollHeight, clientHeight } = event.target;

            if (scrollTop + clientHeight >= scrollHeight) { // Adjust the threshold as needed
                console.log('Scrolled to bottom');
                if (where == 'queryUser') {
                    this.queryUsers()
                }
            }
        }
    },
    computed: {
    },
    mounted() {
        this.queryUsers()       //  页面初次打开时默认查询所有用户，筛选条件全为空
    }
}
</script>


<style>
.demo-form-inline .el-input {
    --el-input-width: 200px;
}

.demo-form-inline .el-select {
    --el-select-width: 100px;
}
</style>