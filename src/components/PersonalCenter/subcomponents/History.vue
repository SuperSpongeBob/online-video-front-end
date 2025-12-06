<template>
    <div class="history-container">
        <h2>观看历史</h2>

        <!-- 清除历史按钮 -->
        <div class="toolbar">
            <button @click="clearHistory" class="clear-btn">
                <span>清空历史记录</span>
            </button>
        </div>


        <!-- 历史列表 -->
        <div v-if="historyList.length" class="video-list">
            <div v-for="video in historyList" :key="video.historyId" class="video-item">
                <div class="thumbnail">
                    <img :src="video.url" alt="封面" />
                    <span v-if="video.videoIsVip === 1" class="vip-tag free">免费</span>
                    <span v-if="video.videoIsVip === 2" class="vip-tag vip">VIP</span>
                    <span class="watched">已看{{ ((video.watchedSeconds / video.duration) * 100).toFixed(1) }}%</span>
                    <span class="duration">{{ formatDuration(video.duration) }}</span>
                </div>

                <div class="info">
                    <h3>{{ video.videoName }}</h3>
                    <span style="font-size: 12px; color: #999; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">{{ video.videoTitle }}</span>
                    <div class="meta">
                        <time class="time">{{ formatDate(video.timestamp) }}</time>
                    </div>

                </div>

                <div class="optional">
                    <el-button type="primary" @click="continueToWatch(video)">继续观看</el-button>
                    <el-button @click="deleteHistory(video)">删除</el-button>
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty">
            <el-empty description="暂无观看历史" />
        </div>
    </div>
</template>

<script>
import authService from '../../../utils/authService'
import { formatDate } from '../../../utils/dateUtils'

export default {
    data() {
        return {
            // 响应式数据
            historyList: [],
            backendAddress: authService.backendAddress()
        }
    },
    methods: {
        continueToWatch(video) {
            console.log(video.historyId)
            localStorage.setItem("historyId", video.historyId)
            window.open(`${window.location.origin}/videoPlay?movieId=${video.videoId}`);
        },

        async getHistory() {
            const condition = {
                userId: (JSON.parse(localStorage.getItem("userInfo"))).userId
            }
            console.log(condition)
            // return
            const response = await authService.detailHistory(condition)
            // console.log(response)
            const processedData = response.data.map(item => {
                item.url = `${this.backendAddress}/images/${item.thumbnailPath}`
                return item
            })
            this.historyList = processedData
        },

        async deleteHistory(video) {
            console.log(video)
            const history = {
                historyId: video.historyId,
                userId: video.userId
            }
            console.log(history)
            const response = await authService.deleteHistory(history)
            if (response.data == true) {
                this.historyList = this.historyList.filter(item => item.historyId != video.historyId)
                this.$message.success({ message: '删除成功', showClose: true })
            } else if (response.status == 200) {
                this.$message.warning({ message: '请先登录', showClose: true })
            } else {
                this.$message.error({ message: '异常警告', showClose: true })
            }
        },

        // 格式化时长
        formatDuration(seconds) {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return `${h ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        },

        //  格式化时间戳
        formatDate: formatDate,

        // 清空历史
        async clearHistory() {
            console.log(this.historyList)
            if (confirm('确定要清空所有观看历史吗？')) {
                const history = {
                    userId: (JSON.parse(localStorage.getItem("userInfo"))).userId
                }
                const response = await authService.deleteHistory(history)
                if (response.data == true) {
                    this.historyList.splice(0)
                    this.$message.success({ message: '删除成功', showClose: true })
                } else if (response.status == 200) {
                    this.$message.warning({ message: '请先登录', showClose: true })
                } else {
                    this.$message.error({ message: '异常警告', showClose: true })
                }

            }
        }
    },
    created() {
        this.getHistory()
    }

    // 初始化加载历史记录
    // onMounted() {
    //     console.log("00000")
    //     this.historyList.push(...mockData)

    // }
}

</script>

<style scoped>
.history-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
}

.toolbar {
    margin: 20px 0;
    text-align: right;
}

.clear-btn {
    padding: 8px 16px;
    background: #f56c6c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.3s;
}

.clear-btn:hover {
    opacity: 0.8;
}

.video-list {
    display: grid;
    gap: 20px;
    height: 70vh;
    position: relative;
    overflow-y: auto;
    scrollbar-width: none;
}

.video-item {
    position: relative;
    width: 90%;
    height: 12vh;
    display: flex;
    gap: 15px;
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail {
    position: relative;
    flex-shrink: 0;
}

.thumbnail img {
    width: 12vw;
    height: 13vh;
    border-radius: 4px;
    object-fit: cover;
}

.vip-tag {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 12px;
    color: white;
}

.free {
    background: #33CD00;
}

.vip {
    background: #EC2828;
}

.watched {
    position: absolute;
    left: 5px;
    bottom: 5px;
    padding: 2px 5px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 3px;
    font-size: 12px;
}

.duration {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 3px;
    font-size: 12px;
}

.info {
    margin-top: -20px;
    flex: 1;
}

.meta {
    margin-top: 15px;
    font-size: 14px;
    color: #666;
}

.time {
    margin-right: 15px;
}

.empty {
    text-align: center;
    padding: 50px;
    color: #999;
}
</style>