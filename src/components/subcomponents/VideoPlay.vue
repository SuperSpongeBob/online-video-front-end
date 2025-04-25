<template>
    <div style="display: flex;">

        <div style="width: 80%;">
            <!-- 视频容器 -->
            <div class="video-container">
                <video ref="videoRef" @timeupdate="handleTimeUpdate" @pause="handlePause" @play="handlePlay"
                    id="myVideo" controls muted controlsList="nodownload" :src="url" autofocus
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

            <h3>{{ this.videoName }}</h3>
            <span>{{ this.VIP === '2' ? "VIP" : "免费" }}视频</span>
            <h4>标题：{{ this.videoTitle }}</h4>
        </div>


        <div style="width: 20%;">

            <div @scroll="handleScroll"
                style="height: 96vh;position: relative;overflow-y: auto;  border-left: 1px solid #ccc; scrollbar-width: none;">
                <el-card v-if="comments.length > 0" v-for="comment in comments" :key="comment.videoCommentId">
                    <template #header #default="scope">
                        <div>
                            <span>{{ comment.userName }}</span>
                        </div>
                    </template>
                    <el-tooltip :content="comment.videoCommentContent" placement="top">
                        <p class="comment-content" show-overflow-tooltip> {{
                            comment.videoCommentContent }}
                        </p>
                    </el-tooltip>
                    <div class="button-container">
                        <el-button link v-if="this.userInfo &&comment.userId == this.userInfo.userId"
                            @click="deleteComment(comment.videoCommentId)">delete</el-button>
                        <el-button link @click="Reply">Reply</el-button>
                        <el-button link style="font-size:small;text-align: left;">{{
                            formatDate(comment.videoCommentTime)
                            }}</el-button>
                    </div>
                </el-card>

                <div v-else style="text-align: center;">
                    暂时没有评论
                </div>
            </div>

            <div>
                <el-input v-model="addComment.videoCommentContent" maxlength="100" :rows="2" clearable
                    placeholder="评论内容(100字)">
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
                videoId: ''
            },
            reqComment: {
                videoId: null,       // 视频id
                pageNum: 1,         //  当前页码
                pageSize: 6,
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
        }
    },
    methods: {
        //  格式化时间戳
        formatDate: formatDate,

        async videoPlay() {
            try {
                const urlParams = new URLSearchParams(window.location.search)
                //  movieId为从videoList传来的videoId
                const movieId = urlParams.get("movieId")             //从URL中获取movieId
                this.videoName = urlParams.get("videoName")
                this.videoTitle = urlParams.get("videoTitle")
                this.VIP = urlParams.get("VIP")
                this.reqComment.videoId = this.addComment.videoId = movieId

                //  验证用户是否可以观看视频，仅用于提示作用，如果该用户是这个视频的作者，即使为VIP视频也可以观看
                const response = await authService.verify(movieId)
                console.log(response)
                //  获取视频信息
                if (response.status === 200 && response.data == true) {
                    this.url = await authService.videoURL(movieId);
                    await authService.increaseViewCount(movieId);
                }
                if (response.status == 401) {
                    this.$message.warning({ message: '登录已过期，请重新登录401', showClose: true })
                }
            } catch (error) {
                console.error(error)
                if (error.response.status == 403 || error.isUnauthorizedError == true) {
                    this.$message.warning({ message: '视频为VIP视频，非会员禁止观看', showClose: true })
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
                //  删除评论区中的数据
                this.comments = this.comments.filter(comment => comment.videoCommentId!== videoCommentId);
            }
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
                        this.comments = [this.addComment, ...this.comments]; // 合并新数据
                        this.$message.success({ message: '评论成功', showClose: true });
                        this.addComment = {}                                                 //清空评论输入框，避免双向数据绑定
                        this.addComment.videoId = this.reqComment.videoId
                    } else {
                        this.$message.error({ message: '出错啦', showClose: true })
                    }

                }
            } catch (error) {
                console.error('提交评论失败：', error);
                this.$message.error({ messsage: '提交评论失败', showClose: true });
            }
        },

        //评论回复功能
        async Reply() {
            this.$message.warning({ message: '暂不支持回复评论功能', showClose: true })
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


.el-card__header {
    padding: 10px;
    /* 减少header底部内边距，可按需调整数值 */
}

.el-card__body {
    height: 11vh;
    padding: 0px 0 0px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* 减少body顶部内边距，可按需调整数值 */
}

.comment-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 限制显示的行数为 2 */
    overflow: hidden; /* 隐藏溢出的内容 */
    text-overflow: ellipsis;
    /* 溢出内容用省略号显示 */
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
    /* 可根据需要调整按钮之间的间距 */
}
</style>