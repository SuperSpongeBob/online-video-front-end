<template>
    <div class="report-record-container">
        <h2>我的举报记录</h2>

        <!-- 筛选条件 -->
        <div class="toolbar">
            <el-select v-model="filterStatus" placeholder="筛选状态" style="width: 150px; margin-right: 10px;" 
                @change="getReports">
                <el-option label="全部" value=""></el-option>
                <el-option label="待处理" value="待处理"></el-option>
                <el-option label="处理中" value="处理中"></el-option>
                <el-option label="已处理" value="已处理"></el-option>
                <el-option label="已驳回" value="已驳回"></el-option>
            </el-select>
        </div>

        <!-- 举报记录列表 -->
        <div v-if="reportList.length" class="report-list">
            <div v-for="report in reportList" :key="report.reportId" class="report-item">
                <div class="report-header">
                    <div class="report-info">
                        <h3>举报 #{{ report.reportId }}</h3>
                        <div class="meta-info">
                            <el-tag :type="getReportTypeColor(report.reportType)" size="small">
                                {{ report.reportType }}
                            </el-tag>
                            <span :style="getStatusColor(report.reportStatus)" class="status">
                                {{ report.reportStatus }}
                            </span>
                            <span class="time">{{ formatDate(report.reportTime) }}</span>
                        </div>
                    </div>
                </div>

                <div class="report-content">
                    <div class="content-item">
                        <span class="label">视频ID：</span>
                        <span>{{ report.videoId }}</span>
                    </div>
                    <div class="content-item">
                        <span class="label">举报描述：</span>
                        <span>{{ report.reportDescription }}</span>
                    </div>
                    <div v-if="report.handleRemark" class="content-item">
                        <span class="label">处理备注：</span>
                        <span>{{ report.handleRemark }}</span>
                    </div>
                    <div v-if="report.handleTime" class="content-item">
                        <span class="label">处理时间：</span>
                        <span>{{ formatDate(report.handleTime) }}</span>
                    </div>
                </div>

                <div class="report-actions">
                    <el-button type="primary" size="small" @click="viewVideo(report.videoId)">查看视频</el-button>
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty">
            <el-empty description="暂无举报记录" />
        </div>
    </div>
</template>

<script>
import authService from '../../../utils/authService';
import { formatDate } from '../../../utils/dateUtils';

export default {
    data() {
        return {
            reportList: [],
            filterStatus: '',
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

        // 查看视频
        viewVideo(videoId) {
            this.$router.push(`/videoPlay?movieId=${videoId}`);
        },

        //  获取我的举报记录
        async getReports() {
            try {
                if (!this.userInfo || !this.userInfo.userId) {
                    this.$message.warning({ message: '请先登录', showClose: true });
                    return;
                }

                const response = await authService.getMyReports(this.userInfo.userId);
                console.log(response);
                
                if (response.status == 200 && response.data) {
                    let reports = response.data;
                    
                    // 如果选择了筛选条件，进行过滤
                    if (this.filterStatus) {
                        reports = reports.filter(item => item.reportStatus === this.filterStatus);
                    }
                    
                    // 按时间倒序排列
                    reports.sort((a, b) => b.reportTime - a.reportTime);
                    
                    this.reportList = reports.map(item => ({
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
                } else {
                    this.reportList = [];
                }
            } catch (error) {
                console.error('获取举报记录失败', error);
                this.$message.error({ message: '获取举报记录失败', showClose: true });
                this.reportList = [];
            }
        }
    },
    mounted() {
        this.getReports();
    }
}
</script>

<style scoped>
.report-record-container {
    padding: 20px;
}

.report-record-container h2 {
    margin-bottom: 20px;
    color: #333;
}

.toolbar {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.report-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.report-item {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
}

.report-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;
}

.report-info h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #333;
}

.meta-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.status {
    font-weight: 500;
    font-size: 14px;
}

.time {
    color: #999;
    font-size: 12px;
}

.report-content {
    margin-bottom: 16px;
}

.content-item {
    margin-bottom: 8px;
    line-height: 1.6;
}

.content-item .label {
    font-weight: 500;
    color: #666;
    margin-right: 8px;
}

.report-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.empty {
    text-align: center;
    padding: 60px 0;
}
</style>

