<template>
    <div style="display: flex;">

        <div style="width: 80%;">
            <!-- 视频容器 -->
            <div class="video-container">
                <video ref="videoRef" @timeupdate="handleTimeUpdate" @pause="handlePause" @play="handlePlay"
                    id="myVideo" controls muted controlsList="nodownload" :src="url" autofocus preload="metadata"
                    style="width: 100%; max-height: 75vh;object-fit: contain;">
                    您的浏览器不支持视频播放。
                </video>
                <!-- 弹幕容器 -->
                <div class="danmaku-container" ref="danmakuContainer" v-if="showDanmakus">
                    <div v-for="(danmaku, index) in currentDanmakus" :key="index" :style="{
                        top: danmaku.top + 'px',
                        animationDuration: danmaku.duration + 's',
                        left: '100%',
                        animationPlayState: danmaku.paused ? 'paused' : 'running',
                        willChange: 'transform'
                    }" class="danmaku">
                        {{ danmaku.text }}
                    </div>
                </div>
                <!-- 发送弹幕输入框和按钮 -->
                <div style="text-align: center;">
                    <el-input v-model="danmakuText" placeholder="输入弹幕内容" @keyup.enter="sendDanmaku" maxlength="30"
                        clearable style="max-width: 500px;flex: 1;">
                        <template #append>
                            <el-button icon="Promotion" @click="sendDanmaku"></el-button>
                        </template>
                    </el-input>
                    &nbsp;
                    <!-- 显示/隐藏弹幕按钮 -->
                    <el-switch v-model="showDanmakus" class="ml-2" inline-prompt active-text="弹幕" inactive-text="弹幕" />
                </div>

            </div>

            <!-- 视频信息卡片 -->
            <div class="video-info-card">
                <div class="video-info-header">
                    <span class="video-title">{{ this.videoName }}</span>
                    <span :class="['video-badge', this.VIP === '2' ? 'vip' : 'free']">{{ this.VIP === '2' ? 'VIP' : '免费'
                    }}</span>
                </div>
                <!-- <div class="video-info-tags">
                    <span class="video-tag">标签1</span>
                    <span class="video-tag">标签2</span>
                </div> -->
                <div class="video-info-desc">{{ this.videoTitle }}</div>
            </div>

        </div>


        <div style="width: 20%;">

            <div @scroll="handleScroll"
                style="height: 94vh;position: relative;overflow-y: auto; border-left: 1px solid #eee; scrollbar-width: none; background: #f7f8fa;">
                <!-- 评论列表 -->
                <div v-if="comments.length > 0">
                    <!-- 渲染所有评论（包括顶级评论和所有回复） -->
                    <div v-for="comment in getAllComments()" :key="comment.videoCommentId"
                        :class="['comment-card', comment.parentId ? 'reply-card' : '']">
                        <div class="comment-card-header">
                            <span class="comment-username">
                                {{ comment.userName || comment.userId }}
                                <template v-if="comment.parentId"> 回复@{{ getReplyToUserName(comment) }}</template>
                            </span>
                        </div>
                        <div class="comment-card-content">
                            {{ comment.videoCommentContent }}
                        </div>
                        <div class="comment-card-footer">
                            <span class="comment-time">{{ formatDate(comment.videoCommentTime) }}</span>
                            <div class="comment-actions">
                                <el-button link v-if="userInfo && comment.userId == userInfo.userId"
                                    @click="deleteComment(comment.videoCommentId)" size="small">删除</el-button>
                                <el-button link @click="replyToComment(comment)" size="small">回复</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else style="text-align: center; color: #aaa; margin-top: 20px;">
                    暂时没有评论
                </div>
            </div>

            <!-- 评论输入框 -->
            <div class="comment-input-container" style="position: relative;">
                <!-- 回复提示悬浮在输入框上方 -->
                <transition name="fade">
                    <div v-if="replyTo" class="reply-hint-floating">
                        回复 {{ replyTo.userName || replyTo.userId }}: {{ replyTo.videoCommentContent }}
                        <el-button link @click="cancelReply" size="small">取消</el-button>
                    </div>
                </transition>
                <el-input v-model="addComment.videoCommentContent" maxlength="100" :rows="2" clearable
                    :placeholder="replyPlaceholder" @keyup.enter="AddComment">
                    <template #append>
                        <el-button icon="Promotion" @click="AddComment"></el-button>
                    </template>
                </el-input>
            </div>
        </div>
    </div>
</template>

<script>
import authService from '../../utils/authService';
import { formatDate } from '../../utils/dateUtils';

export default {
    data() {
        return {
            url: '',                 // 替换为你的视频文件路径
            videoName: '',
            videoTitle: '',
            VIP: '',
            commentContent: '',
            comments: [],            //存储评论数据的数组
            addComment: {
                userName: '',
                videoCommentContent: "",
                videoCommentTime: '',
                userId: '',
                videoId: '',
                parentId: null,      // 父评论ID，用于回复功能
                replyToId: null      // 回复目标用户ID
            },
            replyTo: null,           // 当前回复的目标评论
            reqComment: {
                videoId: null,       // 视频id
                pageNum: 1,         //  当前页码
                pageSize: 9,
                isLoading: false
            },
            userName: {},
            userInfo: JSON.parse(localStorage.getItem("userInfo")),    //  获取登录时保存的用户信息

            //  以下为弹幕数据
            danmakuText: '', // 输入的弹幕内容
            addDanmaku: { videoId: '', text: '', time: '' },     //  添加到数据库
            danmakus: [], // 所有弹幕列表
            currentDanmakus: [], // 当前需要显示的弹幕列表
            trackCount: 30, // 弹幕轨道数量
            trackHeight: 10, // 每条轨道的高度
            danmakuDuration: 10, // 弹幕动画持续时间（秒）
            maxDanmakuCount: 20, // 最大弹幕数量，可根据实际情况调整
            danmakuElements: [],
            intervalId: null,
            showDanmakus: true, // 控制弹幕显示或隐藏的开关

            //  history
            watchedSeconds: null,    //  已观看时间

        };

    },
    computed: {
        //  对评论区的展示顺序按评论时间进行倒序排序，等实现点赞功能后再按点赞数排序
        sortedComments() {
            return this.comments.sort((a, b) => {
                const dateA = new Date(a.videoCommentTime);
                const dateB = new Date(b.videoCommentTime);
                return dateB - dateA;
            });
        },

        // 回复输入框的占位符
        replyPlaceholder() {
            if (this.replyTo) {
                return `回复 ${this.replyTo.userName || this.replyTo.userId}...`;
            }
            return "评论内容(100字)";
        }
    },
    methods: {
        //  格式化时间戳
        formatDate: formatDate,

        // 回复评论
        replyToComment(parentComment, replyComment = null) {
            if (!this.userInfo) {
                this.$message.warning({ message: '请先登录', showClose: true });
                return;
            }

            this.replyTo = replyComment || parentComment;
            this.addComment.parentId = this.replyTo.videoCommentId;
            this.addComment.replyToId = this.replyTo.userId;
        },

        // 取消回复
        cancelReply() {
            this.replyTo = null;
            this.addComment.parentId = null;
            this.addComment.replyToId = null;
        },

        async videoPlay() {
            try {
                const urlParams = new URLSearchParams(window.location.search)
                //  movieId为从videoList传来的videoId
                const movieId = urlParams.get("movieId")             //从URL中获取movieId
                this.videoName = urlParams.get("videoName")
                this.videoTitle = urlParams.get("videoTitle")
                this.VIP = urlParams.get("VIP")
                this.reqComment.videoId = this.addComment.videoId = movieId

                this.url = await authService.videoURL(movieId);
                await authService.increaseViewCount(movieId);

                //  验证用户是否可以观看视频，仅用于提示作用，如果该用户是这个视频的作者，即使为VIP视频也可以观看
                const response = await authService.verify(movieId)
                console.log(response)
                //  获取视频信息
                if (response.status === 200 && response.data == false) {
                    this.$message.warning({ message: '视频为VIP视频，升级会员即可观看全片', showClose: true })
                }

                if (response.status == 401) {
                    this.$message.warning({ message: '登录已过期，请重新登录401', showClose: true })
                }
            } catch (error) {
                console.error(error)
                if (error.response.status == 403 || error.isUnauthorizedError == true) {
                    this.$message.warning({ message: '视频为VIP视频，升级会员即可观看全片', showClose: true })
                }
            }

        },

        //  加载更多评论
        async loadMoreComments() {
            const urlParams = new URLSearchParams(window.location.search)
            const movieId = urlParams.get("movieId")              //获取movieId
            this.reqComment.videoId = this.addComment.videoId = movieId

            if (this.reqComment.isLoading) return;               // 如果已经在加载，直接返回
            this.reqComment.isLoading = true;                   // 设置加载状态为true
            console.log(this.reqComment)
            // 获取评论
            const response = await authService.videoComment(this.reqComment)
            console.log(response)
            const reGetComments = await response.data;
            this.comments = [...this.comments, ...reGetComments]; // 合并新数据
            console.log(this.comments)
            this.reqComment.pageNum++;                   // 增加页码
            this.reqComment.isLoading = false;           // 重置加载状态
        },

        //  删除评论
        async deleteComment(videoCommentId) {
            const response = await authService.deleteComment({ videoCommentId: videoCommentId })
            if (response.data == true && response.status == 200) {
                this.$message.warning({ message: `删除评论成功：${videoCommentId}`, showClose: true })
                // 递归删除评论（支持顶层和回复）
                this.comments = this.removeCommentById(this.comments, videoCommentId);
            }
        },

        // 递归移除评论或回复
        removeCommentById(comments, id) {
            // 先过滤顶层
            let filtered = comments.filter(comment => comment.videoCommentId !== id);
            // 再递归处理replies
            filtered = filtered.map(comment => {
                if (comment.replies && comment.replies.length > 0) {
                    comment.replies = this.removeCommentById(comment.replies, id);
                }
                return comment;
            });
            return filtered;
        },

        //  检测滚动情况
        handleScroll(event) {
            const container = event.target;
            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;
            const scrollHeight = container.scrollHeight;
            //  检查是否滚动到底部
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                this.loadMoreComments();                         // 加载更多评论
            }
        },

        //评论
        async AddComment() {
            try {
                //  从session中获取用户信息
                // this.addComment.videoCommentTime = (new Date().toLocaleString());
                this.addComment.videoCommentTime = (Date.now())
                if (this.userInfo == null) {
                    this.$message.warning({ message: '请登录' })
                    return
                }
                const userId = this.userInfo.userId
                console.log(userId)

                if (!this.addComment.videoCommentContent.trim()) {
                    this.$message.warning({ message: '评论内容不能为空', showClose: true });
                    return;
                } else if (this.userInfo == null || userId == null) {
                    this.$message.warning({ message: '登录后即可评论', showClose: true })
                    return;
                } else {
                    this.addComment.userId = userId
                    this.addComment.userName = this.userInfo.userName          //从本地存储获取用户名
                    console.log(this.addComment)
                    const response = await authService.addComment(this.addComment)
                    if (response.status == 200 && response.data == true) {
                        // 如果是回复评论，需要重新加载评论列表以获取完整的层级结构
                        if (this.addComment.parentId) {
                            this.comments = []; // 清空当前评论列表
                            this.reqComment.pageNum = 1; // 重置页码
                            await this.loadMoreComments(); // 重新加载评论
                        } else {
                            // 如果是顶层评论，直接添加到列表开头
                            this.comments = [this.addComment, ...this.comments];
                        }

                        this.$message.success({ message: '评论成功', showClose: true });
                        this.addComment = {
                            videoId: this.reqComment.videoId,
                            parentId: null,
                            replyToId: null
                        }; // 清空评论输入框，避免双向数据绑定
                        this.cancelReply(); // 取消回复状态
                    } else {
                        this.$message.error({ message: '出错啦', showClose: true })
                    }

                }
            } catch (error) {
                console.error('提交评论失败：', error);
                this.$message.error({ messsage: '提交评论失败', showClose: true });
            }
        },

        //  从url中获取视频id
        getVideoIdByURL() {
            const urlParams = new URLSearchParams(window.location.search)
            const movieId = urlParams.get("movieId")              //获取movieId
            return movieId
        },

        //  以下为弹幕操作函数

        //  获取弹幕数据
        async getDanmakus() {
            const danmaku = { videoId: this.getVideoIdByURL() }
            const response = await authService.getDanmakus(danmaku)
            const dbDanmakus = response.data
            // console.log(dbDanmakus)

            // 为从数据库获取的数据添加top，duration和paused属性
            this.danmakus = dbDanmakus.map(danmaku => ({
                ...danmaku,
                top: Math.floor(Math.random() * this.trackCount) * this.trackHeight,
                duration: this.danmakuDuration,
                paused: false
            }))
        },

        //  发送弹幕
        async sendDanmaku() {
            try {
                if (this.danmakuText.trim() === '') return
                if (this.userInfo == null || this.userInfo.userId == null) {
                    this.$message.warning({ message: '请先登录', showClose: true })
                    return;
                }
                // 记录当前视频时间
                const currentTime = this.video.currentTime
                const danmaku = {
                    text: this.danmakuText,
                    time: currentTime,
                    top: Math.floor(Math.random() * this.trackCount) * this.trackHeight
                }
                //  从url中获取视频ID
                const videoId = this.getVideoIdByURL()      //获取movieId
                this.addDanmaku.videoId = videoId
                this.addDanmaku.userId = this.userInfo.userId
                this.addDanmaku.text = this.danmakuText
                this.addDanmaku.time = currentTime

                // 避免时间为0时服务器出错
                if (this.addDanmaku.time == 0) {
                    this.addDanmaku.time++
                }
                //  添加弹幕数据到服务器
                // const response = await axios.post('http://localhost:8080/api/addDanmaku', this.addDanmaku)
                const response = await authService.addDanmaku(this.addDanmaku)
                console.log(response)
                if (response.data == true) {
                    this.danmakus.push(danmaku)
                    console.log(this.danmakus)
                    //  清空输入框
                    this.danmakuText = ''
                    this.$message.success({ message: '发送弹幕成功', showClose: true })
                } else {
                    this.$message.error({ message: '出错啦~~~', showClose: true })
                }
            } catch (error) {
                this.$message.error({ message: '出错啦~~~~', showClose: true })
                console.error(error)
            }
        },

        // 处理视频时间更新事件
        handleTimeUpdate() {
            const currentTime = this.video.currentTime
            // 对弹幕数据按时间排序
            const sortedDanmakus = this.danmakus.sort((a, b) => a.time - b.time);
            //  过滤出当前时间需要显示的弹幕
            const filteredDanmakus = sortedDanmakus.filter(danmaku => {
                return currentTime >= danmaku.time && currentTime < danmaku.time + this.danmakuDuration
            })
            //  只有当过滤后的弹幕列表发生变化时才更新currentDanmakus
            //  为每条弹幕添加而外属性
            if (JSON.stringify(filteredDanmakus) !== JSON.stringify(this.currentDanmakus)) {
                this.currentDanmakus = filteredDanmakus.map(danmaku => {
                    return {
                        ...danmaku,
                        duration: this.danmakuDuration,
                        paused: false
                    }
                })
                // console.log(this.currentDanmakus)

            }

        },

        //  处理视频暂停时间
        handlePause() {
            this.currentDanmakus.forEach(danmaku => {
                danmaku.paused = true
            })
        },

        //  处理视频播放事件
        handlePlay() {
            this.currentDanmakus.forEach(danmaku => {
                danmaku.paused = false
            })
        },

        // 切换弹幕显示或隐藏状态
        toggleDanmakus() {
            this.showDanmakus = !this.showDanmakus;
        },

        //  观看历史记录
        async getHistory() {
            const historyId = localStorage.getItem("historyId")
            console.log(historyId)

            localStorage.removeItem('historyId')    //  立即删除historyId避免影响到后续视频
            console.log(localStorage.getItem('historyId'))
            if (historyId == null) return

            const condition = {
                historyId: historyId
            }
            console.log(condition)
            const response = await authService.historyByHistoryId(condition)
            console.log(response)
            this.watchedSeconds = response.data.watchedSeconds
        },

        //  保存观看历史记录
        saveWatchHistory() {
            const video = this.$refs.videoRef
            const currentTime = Math.floor(video.currentTime)   //  获取当前视频时间
            const historyData = {
                videoId: this.getVideoIdByURL(),
                userId: this.userInfo.userId,
                watchedSeconds: currentTime,
                timestamp: Date.now()
            }
            authService.insertHistory(historyData)
        },

        // 获取被回复用户的姓名
        getReplyToUserName(comment) {
            if (!comment.parentId) return '';

            // 如果是回复评论，查找父评论的用户名
            const parentComment = this.findParentComment(comment.parentId);
            if (parentComment) {
                return parentComment.userName || parentComment.userId;
            }

            // 如果找不到父评论，返回replyToId作为备用
            return comment.replyToId;
        },

        // 查找父评论
        findParentComment(parentId) {
            // 在所有评论中查找父评论
            const allComments = this.getAllComments();
            return allComments.find(comment => comment.videoCommentId === parentId) || null;
        },

        // 获取所有评论（包括顶级评论和所有回复）
        getAllComments() {
            const allComments = [];

            // 遍历顶级评论
            for (let comment of this.comments) {
                // 添加顶级评论
                allComments.push(comment);

                // 递归添加所有回复评论
                if (comment.replies && comment.replies.length > 0) {
                    this.addAllReplies(comment.replies, allComments);
                }
            }

            return allComments;
        },

        // 递归添加所有回复评论
        addAllReplies(replies, allComments) {
            for (let reply of replies) {
                allComments.push(reply);

                // 如果这个回复还有子回复，继续递归
                if (reply.replies && reply.replies.length > 0) {
                    this.addAllReplies(reply.replies, allComments);
                }
            }
        },

    },
    mounted() {
        this.loadMoreComments()

        this.videoPlay()
        //  禁用右键
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);

        //  获取弹幕数据
        this.getDanmakus()

        this.video = this.$refs.videoRef
        this.danmakuContainer = this.$refs.danmakuContainer
        //  获取所有弹幕元素
        this.danmakuElements = this.danmakuContainer.children

        //  history
        this.getHistory()
        const video = this.$refs.videoRef
        //  监听元数据加载完成事件
        video.addEventListener('loadedmetadata', () => {
            console.log("视频元数据已加载")
            video.currentTime = this.watchedSeconds
            video.play()
        })
        window.addEventListener('beforeunload', this.saveWatchHistory)
    },
    beforeDestroy() {
        window.removeEventListener('beforeunload', this.saveWatchHistory)
    },
};
</script>

<style>
.video-container {
    position: relative;
    width: 100%;
    max-width: 80vw;
    /* max-width: 800px; */
    margin: 0 auto;
}

video {
    width: 100%;
    height: auto;
}

.danmaku-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
}

.danmaku {
    position: absolute;
    white-space: nowrap;
    color: white;
    font-size: 16px;
    animation-name: danmakuMove;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
}

@keyframes danmakuMove {
    from {
        left: 100%;
    }

    to {
        left: -100%;
    }
}

/* 评论相关样式 */
.comment-card {
    margin-bottom: 16px;
}

.comment-header {
    display: flex;
    align-items: center;
}

.comment-author {
    font-weight: bold;
    color: #333;
}

.comment-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 8px 0;
    line-height: 1.4;
}

.button-container {
    text-align: right;
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
}

.button-container button {
    float: right;
    margin-right: 10px;
    margin-left: 10px;
}

/* 回复评论样式 */
.replies-container {
    margin-top: 12px;
    padding-left: 16px;
    border-left: 2px solid #e4e7ed;
}

.reply-item {
    margin-bottom: 8px;
    padding: 8px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.reply-content {
    font-size: 14px;
}

.reply-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.reply-author {
    font-weight: bold;
    color: #409eff;
    font-size: 13px;
}

.reply-time {
    font-size: 12px;
    color: #909399;
}

.reply-text {
    margin: 4px 0;
    line-height: 1.3;
    word-break: break-word;
}

.reply-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
}

/* 评论输入框样式 */
.comment-input-container {
    padding: 12px;
    border-top: 1px solid #e4e7ed;
}

.reply-hint {
    margin-top: 8px;
    padding: 8px;
    background-color: #f0f9ff;
    border: 1px solid #b3d8ff;
    border-radius: 4px;
    font-size: 13px;
    color: #409eff;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.el-card__header {
    padding: 10px;
}

.el-card__body {
    height: auto;
    min-height: 11vh;
    padding: 0px 0 0px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* 评论区自定义样式 */
.custom-comment-block {
    background: #232323;
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 16px 18px 10px 18px;
    color: #eee;
    font-size: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    position: relative;
    transition: box-shadow 0.2s;
}

.custom-comment-block:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
}

.comment-header-row {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #bdbdbd;
    margin-bottom: 4px;
}

.comment-username {
    font-weight: 500;
    color: #bdbdbd;
}

.comment-content-row {
    margin: 4px 0 8px 0;
    word-break: break-all;
}

.comment-main-content {
    color: #fff;
    font-size: 15px;
    line-height: 1.7;
}

.comment-footer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}

.comment-time {
    font-size: 12px;
    color: #888;
}

.comment-actions {
    display: flex;
    gap: 8px;
}

.comment-actions .el-button {
    color: #bdbdbd;
    font-size: 13px;
    padding: 0 4px;
}

.comment-actions .el-button:hover {
    color: #409eff;
    background: none;
}

.replies-container {
    margin-top: 8px;
    padding-left: 18px;
    border-left: 2px solid #333;
}

.reply-block {
    background: #232323;
    margin-bottom: 8px;
    padding: 12px 14px 8px 14px;
    font-size: 14px;
}

.reply-hint {
    margin-top: 8px;
    padding: 8px;
    background-color: #232323;
    border: 1px solid #444;
    border-radius: 4px;
    font-size: 13px;
    color: #409eff;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* 悬浮回复提示样式 */
.reply-hint-floating {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    margin-bottom: 8px;
    padding: 8px;
    background-color: #232323;
    border: 1px solid #444;
    border-radius: 4px;
    font-size: 13px;
    color: #409eff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.video-info-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    padding: 24px 28px 18px 28px;
    margin: 24px 0 16px 0;
}

.video-info-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
}

.video-title {
    font-size: 22px;
    font-weight: bold;
    color: #222;
}

.video-badge {
    padding: 2px 10px;
    border-radius: 8px;
    font-size: 13px;
    color: #fff;
    font-weight: 500;
}

.video-badge.vip {
    background: linear-gradient(90deg, #ff6b6b 0%, #ee5a52 100%);
}

.video-badge.free {
    background: linear-gradient(90deg, #00d4aa 0%, #00b894 100%);
}

.video-info-tags {
    margin-bottom: 8px;
}

.video-tag {
    display: inline-block;
    background: #f0f0f0;
    color: #888;
    border-radius: 6px;
    font-size: 12px;
    padding: 2px 10px;
    margin-right: 8px;
}

.video-info-desc {
    color: #666;
    font-size: 15px;
    margin-top: 6px;
    line-height: 1.7;
    word-break: break-all;
}

/* 评论区 */
.comment-list {
    margin-top: 18px;
}

.comment-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
    padding: 16px 18px 10px 18px;
    color: #333;
    font-size: 15px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    min-height: 90px;
    position: relative;
}

.comment-card-header {
    display: flex;
    align-items: flex-start;
    font-size: 13px;
    color: #409eff;
    font-weight: 500;
    margin-bottom: 8px;
}

.comment-card-content {
    flex: 1;
    color: #222;
    font-size: 15px;
    margin-bottom: 8px;
    word-break: break-all;
}

.comment-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 13px;
    margin-top: auto;
}

.comment-time {
    color: #bbb;
    font-size: 12px;
}

.comment-actions {
    display: flex;
    gap: 8px;
}

.comment-actions .el-button {
    color: #888;
    font-size: 13px;
    padding: 0 4px;
}

.comment-actions .el-button:hover {
    color: #409eff;
    background: none;
}

.reply-card {
    background: #f7f8fa;
    margin-top: 8px;
    margin-left: 18px;
    box-shadow: none;
    border-left: 3px solid #e0e0e0;
}
</style>