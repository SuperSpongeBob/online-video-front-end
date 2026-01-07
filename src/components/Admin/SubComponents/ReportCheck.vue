<template>
    <el-divider content-position="center">待处理举报视频</el-divider>

    <el-card>
        <el-table :data="reportData" max-height="700" stripe>
            <el-table-column fixed="left" width="100" property="reportId" label="举报ID" />
            <el-table-column width="100" property="videoId" label="视频ID" />
            <el-table-column width="120" property="reporterId" label="举报人ID" />
            <el-table-column width="120" property="reportType" label="举报类型">
                <template #default="scope">
                    <el-tag :type="getReportTypeColor(scope.row.reportType)">
                        {{ scope.row.reportType }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column width="120" property="reportStatus" label="举报状态">
                <template #default="scope">
                    <span :style="getStatusColor(scope.row.reportStatus)">{{ scope.row.reportStatus }}</span>
                </template>
            </el-table-column>
            <el-table-column property="reportDescription" label="举报描述" show-overflow-tooltip />
            <el-table-column width="180" property="reportTime" label="举报时间">
                <template #default="scope">
                    {{ formatDate(scope.row.reportTime) }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="280" header-align="center">
                <template #default="scope">
                    <el-button link @click="centerDialogVisible = true; viewReport(scope.row)">查看详情</el-button>
                    <el-button link type="primary" @click="handleReport(scope.row, '已处理')">处理</el-button>
                    <el-button link type="danger" @click="handleReport(scope.row, '已驳回')">驳回</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 处理举报对话框 -->
    <el-dialog v-model="centerDialogVisible" width="1000" align-center>
        <div style="margin-bottom: 20px;">
            <h3>举报详情</h3>
            <el-descriptions :column="2" border>
                <el-descriptions-item label="举报ID">{{ subReportData.reportId }}</el-descriptions-item>
                <el-descriptions-item label="视频ID">{{ subReportData.videoId }}</el-descriptions-item>
                <el-descriptions-item label="举报人ID">{{ subReportData.reporterId }}</el-descriptions-item>
                <el-descriptions-item label="举报类型">
                    <el-tag :type="getReportTypeColor(subReportData.reportType)">
                        {{ subReportData.reportType }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="举报状态">
                    <span :style="getStatusColor(subReportData.reportStatus)">{{ subReportData.reportStatus }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="举报时间">{{ formatDate(subReportData.reportTime) }}</el-descriptions-item>
                <el-descriptions-item label="举报描述" :span="2">
                    {{ subReportData.reportDescription }}
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <div style="margin-bottom: 20px;">
            <h3>视频信息</h3>
            <video id="myVideo" controls controlsList="nodownload" :src="url"
                style="width: 100%; height: 60%;object-fit: contain;max-width: 90vw;max-height: 80vh;">
                您的浏览器不支持视频播放。
            </video>
            <div style="margin-top: 10px;">
                <div>视频名称：{{ videoInfo.videoName }}</div>
                <div>视频标题：{{ videoInfo.videoTitle }}</div>
            </div>
        </div>

        <!-- 如果是侵权类型，显示正版链接输入 -->
        <div v-if="subReportData.reportType === '侵权'" style="margin-bottom: 20px;">
            <h3>正版视频链接</h3>
            <el-input v-model="sourceVideoUrl" placeholder="请输入正版视频链接（可选）" style="margin-bottom: 10px;">
                <template #prepend>链接</template>
            </el-input>
            <el-alert v-if="videoInfo.sourceVideoUrl" type="info" :closable="false" style="margin-bottom: 10px;">
                当前已有正版链接：{{ videoInfo.sourceVideoUrl }}
            </el-alert>
        </div>

        <el-form :model="handleForm" label-width="100px" style="margin-bottom: 20px;">
            <el-form-item label="处理备注">
                <el-input v-model="handleForm.handleRemark" type="textarea" :rows="3" 
                    placeholder="请输入处理备注（可选）"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" plain @click="previousReport(subReportData)">上一个</el-button>
                <el-button type="danger" @click="handleReport(subReportData, '已驳回', true)">驳回</el-button>
                <el-button type="primary" @click="handleReport(subReportData, '已处理', true)">处理</el-button>
                <el-button type="primary" plain @click="nextReport(subReportData)">下一个</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { ref } from 'vue';
import authService from '../../../utils/authService';
import { formatDate } from '../../../utils/dateUtils';

export default {
    data() {
        return {
            reportData: [],                      //  表格数据
            subReportData: {},                   //  用于对话框的数据显示
            centerDialogVisible: ref(false),    //  对话框是否显示
            url: '',                            //  视频播放路径
            videoInfo: {},                       //  视频信息
            sourceVideoUrl: '',                  //  正版视频链接
            handleForm: {
                handleRemark: ''
            },
            userInfo: JSON.parse(localStorage.getItem("userInfo") || "{}")
        }
    },
    methods: {
        //  根据不同状态显示不同颜色字体
        getStatusColor(status) {
            switch (status) {
                case "已处理":
                    return { color: 'green' };
                case "待处理":
                    return { color: 'orange' };
                case "处理中":
                    return { color: 'blue' };
                case "已驳回":
                    return { color: 'red' };
                default:
                    return {}
            }
        },

        //  根据举报类型显示不同颜色
        getReportTypeColor(type) {
            switch (type) {
                case "侵权":
                    return 'danger';
                case "色情":
                    return 'danger';
                case "暴力":
                    return 'warning';
                case "其他":
                    return 'info';
                default:
                    return ''
            }
        },

        // 格式化日期
        formatDate(timestamp) {
            if (!timestamp) return '';
            return formatDate(timestamp);
        },

        //  查看举报详情
        async viewReport(row) {
            this.subReportData = row;
            this.sourceVideoUrl = '';
            this.handleForm.handleRemark = '';
            
            // 获取视频信息
            try {
                const videoResponse = await authService.getVideos({ videoId: row.videoId });
                if (videoResponse.data && videoResponse.data.length > 0) {
                    this.videoInfo = videoResponse.data[0];
                    this.sourceVideoUrl = this.videoInfo.sourceVideoUrl || '';
                }
            } catch (error) {
                console.error('获取视频信息失败', error);
            }
            
            // 获取视频播放URL
            this.url = await authService.videoURL(row.videoId);
        },

        //  处理举报
        async handleReport(row, status, isDialog) {
            try {
                // 如果是侵权类型且提供了正版链接，先更新视频信息
                if (row.reportType === '侵权' && this.sourceVideoUrl && this.sourceVideoUrl.trim()) {
                    const videoUpdateData = {
                        videoId: row.videoId,
                        sourceVideoUrl: this.sourceVideoUrl.trim(),
                        videoType: '无版权'  // 设置为无版权类型
                    };
                    try {
                        await authService.adminUpdateVideo(videoUpdateData);
                        this.$message.success({ message: '正版链接已保存', showClose: true });
                    } catch (error) {
                        console.error('更新视频信息失败', error);
                        this.$message.warning({ message: '更新视频信息失败，但将继续处理举报', showClose: true });
                    }
                }

                const handleData = {
                    reportId: row.reportId,
                    handlerId: this.userInfo.userId,
                    status: status,
                    handleRemark: this.handleForm.handleRemark || ''
                };

                const response = await authService.handleReport(handleData);
                if (response.status == 200) {
                    const reportItem = this.reportData.find(item => item.reportId === row.reportId);
                    if (reportItem) {
                        reportItem.reportStatus = status;
                        reportItem.handleRemark = this.handleForm.handleRemark;
                        if (status === '已处理') {
                            this.$message.success({ message: '处理成功', showClose: true });
                        } else {
                            this.$message.warning({ message: '已驳回', showClose: true });
                        }
                    }

                    // 从列表中移除已处理的举报
                    this.reportData = this.reportData.filter(item => item.reportId !== row.reportId);

                    // 如果是对话框中的操作，跳转到下一个
                    if (isDialog) {
                        const nextResult = this.nextReport(row);
                        if (!nextResult) {
                            this.centerDialogVisible = false;
                        }
                    } else {
                        // 如果不是对话框操作，刷新列表
                        await this.getReports();
                    }
                } else {
                    this.$message.error({ message: '处理失败', showClose: true });
                }
            } catch (error) {
                console.error('处理举报失败', error);
                if (error.response && error.response.data) {
                    this.$message.error({ message: error.response.data || '处理失败', showClose: true });
                } else {
                    this.$message.error({ message: '处理失败', showClose: true });
                }
            }
        },

        //  dialog中上一个举报
        async previousReport(row) {
            const index = this.reportData.findIndex(item => item.reportId === row.reportId)
            if (index !== -1 && index > 0) {
                await this.viewReport(this.reportData[index - 1])
                return true
            } else {
                this.$message.warning({ message: '已经是第一个举报了', showClose: true })
                return false
            }
        },

        //  dialog中下一个举报
        async nextReport(row) {
            const index = this.reportData.findIndex(item => item.reportId === row.reportId)
            if (index !== -1 && index + 1 < this.reportData.length) {
                await this.viewReport(this.reportData[index + 1])
                return true
            } else {
                this.$message.warning({ message: '没有更多待处理举报', showClose: true })
                return false;
            }
        },

        //  获取待处理的举报记录
        async getReports() {
            try {
                const reportQuery = {
                    reportStatus: '待处理',
                    pageNum: 1,
                    pageSize: 100
                };
                const response = await authService.adminGetReports(reportQuery);
                console.log(response);
                if (response.status == 204 || !response.data || response.data.length === 0) {
                    this.$message.warning({ message: '没有待处理的举报', showClose: true });
                    return;
                }

                //  将数据映射到reportData中
                this.reportData = response.data.map(item => ({
                    reportId: item.reportId,
                    reporterId: item.reporterId,
                    videoId: item.videoId,
                    reportStatus: item.reportStatus,
                    reportType: item.reportType,
                    reportDescription: item.reportDescription,
                    reportTime: item.reportTime,
                    handlerId: item.handlerId,
                    handleTime: item.handleTime,
                    handleRemark: item.handleRemark
                }));
            } catch (error) {
                console.error('获取举报记录失败', error);
                this.$message.error({ message: '获取举报记录失败', showClose: true });
            }
        }
    },
    mounted() {
        this.getReports();
    }
}
</script>

