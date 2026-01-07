<template>
    <div style="display: flex;">

        <div style="width: 80%;">
            <!-- 视频容器 -->
            <div class="video-container" @mouseenter="handleVideoMouseEnter" @mouseleave="handleVideoMouseLeave">
                <!-- 上一个/下一个视频按钮 -->
                <div class="video-navigation" v-show="showNavigationButtons">
                    <div class="nav-button prev-button" :class="{ 'disabled': !hasPreviousVideo }"
                        @click="playPreviousVideo">
                        <div class="nav-text">Previous</div>
                    </div>
                    <div class="nav-button next-button" :class="{ 'disabled': !hasNextVideo }" @click="playNextVideo">
                        <div class="nav-text">Next</div>
                    </div>
                </div>

                <video ref="videoRef" @timeupdate="handleTimeUpdate" @pause="handlePause" @play="handlePlay"
                    @ended="handleVideoEnded" id="myVideo" controls muted controlsList="nodownload" :src="url" autofocus
                    preload="metadata" style="width: 100%; height: 80vh; object-fit: contain;">
                    您的浏览器不支持视频播放。
                </video>
                <!-- 30秒限制提示遮罩 -->
                <div v-if="videoType === 'NO_COPYRIGHT' && showTimeLimitOverlay" class="time-limit-overlay" 
                    style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); 
                    display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; z-index: 1000;">
                    <h3 style="margin-bottom: 20px;">该视频为无版权视频，仅可观看30秒预览</h3>
                    <el-button v-if="sourceVideoUrl" type="primary" size="large" @click="goToSourceVideo">
                        前往正版平台观看完整视频
                    </el-button>
                </div>
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
            </div>
            
            <!-- 发送弹幕输入框和按钮 - 移到video-container外部 -->
            <div style="text-align: center;">
                <el-input v-model="danmakuText" placeholder="输入弹幕内容" @keyup.enter="sendDanmaku" maxlength="30"
                    clearable style="max-width: 500px;">
                    <template #append>
                        <el-button icon="Promotion" @click="sendDanmaku">发送</el-button>
                    </template>
                </el-input>
                &nbsp;
                <!-- 显示/隐藏弹幕按钮 -->
                <el-switch v-model="showDanmakus" class="ml-2" inline-prompt active-text="弹幕" inactive-text="弹幕" />

                <!-- 举报按钮 - 移除v-if条件，未登录时也显示但提示需要登录 -->
                <el-button type="danger" size="small" @click="handleReportClick" 
                        :disabled="hasReported" style="margin-left: 10px;">
                        {{ hasReported ? '已举报' : '举报' }}
                </el-button>

                <el-button v-if="videoType === 'NO_COPYRIGHT' &&sourceVideoUrl" type="primary" size="small" @click="goToSourceVideo">
                        跳转至源视频
                </el-button>
            </div>

            <!-- 视频信息卡片 -->
            <div class="video-info-card">
                <div class="video-info-header">
                    <span class="video-title">{{ this.videoName }}</span>
                    <span :class="['video-badge', getVideoTypeClass(this.videoType)]">{{ getVideoTypeText(this.videoType) }}</span>

                </div>
                <div class="video-info-desc">{{ this.videoTitle }}</div>
                <!-- 无版权视频提示 -->
                <!-- <div v-if="videoType === 'NO_COPYRIGHT' && sourceVideoUrl" class="copyright-notice" style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 4px;">
                    <p style="margin: 0 0 5px 0; color: #856404;">该视频为无版权视频，仅可观看30秒预览</p>
                    <el-button type="primary" size="small" @click="goToSourceVideo">前往正版平台观看</el-button>
                </div> -->
            </div>
            
            <!-- 举报对话框 -->
            <el-dialog v-model="showReportDialog" title="举报视频" width="500px">
                <el-form :model="reportForm" label-width="100px">
                    <el-form-item label="举报类型" required>
                        <el-select v-model="reportForm.reportType" placeholder="请选择举报类型" style="width: 100%;">
                            <el-option label="侵权" value="侵权"></el-option>
                            <el-option label="色情" value="色情"></el-option>
                            <el-option label="暴力" value="暴力"></el-option>
                            <el-option label="其他" value="其他"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="举报描述" required>
                        <el-input v-model="reportForm.reportDescription" type="textarea" :rows="4" 
                            placeholder="请详细描述举报原因" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="showReportDialog = false">取消</el-button>
                        <el-button type="primary" @click="submitReport">提交</el-button>
                    </span>
                </template>
            </el-dialog>

        </div>

        <div style="width: 20%; height: 100vh; background: #f7f8fa;">
            <!-- Tab按钮区域 -->
            <div class="tab-header">
                <div class="tab-buttons">
                    <div :class="['tab-button', { 'active': activeTab === 'comment' }]"
                        @click="handleTabChange('comment')">
                        评论
                    </div>
                    <div :class="['tab-button', { 'active': activeTab === 'album' }]" @click="handleTabChange('album')">
                        专辑
                    </div>
                </div>
            </div>

            <!-- 评论内容 -->
            <div v-if="activeTab === 'comment'" class="tab-content">
                <!-- 评论列表 -->
                <div @scroll="handleScroll"
                    style="height: 88vh;position: relative;overflow-y: auto; scrollbar-width: none;">
                    <div v-if="comments.length > 0">
                        <!-- 渲染所有评论（包括顶级评论和所有回复） -->
                        <div v-for="comment in comments" :key="comment.videoCommentId" class="comment-card">
                            <!-- 顶级评论内容 -->
                            <div class="comment-card-header">
                                <span class="comment-username">
                                    {{ comment.userName || comment.userId }}
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

                            <!-- 二级区块：拍平所有子回复 -->
                            <div v-if="flattenReplies(comment).length" class="replies-container">
                                <div v-for="reply in flattenReplies(comment)" :key="reply.videoCommentId"
                                    class="reply-item">
                                    <div class="reply-header">
                                        <span class="reply-author">
                                            {{ reply.userName || reply.userId }}
                                            <template v-if="reply.parentId">
                                                <el-icon>
                                                    <Promotion />
                                                </el-icon> @{{ getParentUserName(reply.parentId, comment) }}
                                            </template>
                                        </span>
                                        <span class="reply-time">{{ formatDate(reply.videoCommentTime) }}</span>
                                    </div>
                                    <div class="reply-content">{{ reply.videoCommentContent }}</div>
                                    <div class="reply-actions">
                                        <el-button link v-if="userInfo && reply.userId == userInfo.userId"
                                            @click="deleteComment(reply.videoCommentId)" size="small">删除</el-button>
                                        <el-button link @click="replyToComment(comment, reply)"
                                            size="small">回复</el-button>

                                    </div>
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
                    <el-input ref="commentInput" v-model="addComment.videoCommentContent" maxlength="100" :rows="2"
                        clearable :placeholder="replyPlaceholder" @keyup.enter="AddComment">
                        <template #append>
                            <el-button icon="Promotion" @click="AddComment"></el-button>
                        </template>
                    </el-input>
                </div>
            </div>

            <!-- 专辑内容 -->
            <div v-if="activeTab === 'album'" class="tab-content">
                <!-- 专辑视频列表 -->
                <div @scroll="handleAlbumScroll"
                    style="height: 94vh;position: relative;overflow-y: auto; scrollbar-width: none;">
                    <div v-if="albumLoading" style="text-align: center; color: #aaa; margin-top: 20px;">
                        加载中...
                    </div>
                    <div v-else-if="albumVideos.length > 0">
                        <div class="album-video-grid">
                            <div v-for="video in albumVideos" :key="video.videoId"
                                :class="['album-video-card', { 'current-playing': isCurrentVideo(video) }]"
                                @click="goToVideo(video)">
                                <!-- VIP/免费标签 -->
                                <div :class="['album-video-badge', getVideoTypeClass(video.videoType)]">
                                    {{ getVideoTypeText(video.videoType) }}
                                </div>

                                <!-- 视频缩略图 -->
                                <div class="album-video-thumbnail">
                                    <img :src="getThumbnailUrl(video.thumbnailPath)" @error="handleThumbnailError"
                                        alt="视频缩略图" />

                                    <!-- 视频信息覆盖层 -->
                                    <div class="album-video-overlay">
                                        <div class="album-video-stats">
                                            <div class="album-stat-item">
                                                <el-icon>
                                                    <View />
                                                </el-icon>
                                                <span>{{ formatViewCount(video.viewCount) }}</span>
                                            </div>
                                        </div>
                                        <div class="album-video-stats">
                                            <div class="album-stat-item">
                                                <span>{{ formatDuration(video.duration) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 视频信息 -->
                                <div class="album-video-info">
                                    <div class="album-video-title" :title="video.videoName">{{ video.videoName }}
                                    </div>
                                    <div class="album-video-description" :title="video.videoTitle">{{
                                        video.videoTitle }}
                                    </div>
                                </div>

                                <!-- 当前播放指示器 -->
                                <div v-if="isCurrentVideo(video)" class="playing-indicator">
                                    <div class="audio-bars">
                                        <div class="bar bar1"></div>
                                        <div class="bar bar2"></div>
                                        <div class="bar bar3"></div>
                                        <div class="bar bar4"></div>
                                    </div>
                                    <span class="playing-text">正在播放</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else style="text-align: center; color: #aaa; margin-top: 20px;">
                        暂无专辑视频
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import authService from '../../utils/authService';
import { formatDate } from '../../utils/dateUtils';
import { getVideoTypeText, getVideoTypeClass, getVideoTypeTag } from '../../utils/videoTypeUtils';
import { View, ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import axios from 'axios';

export default {
    components: {
        View,
        ArrowLeft,
        ArrowRight
    },
    data() {
        return {
            url: '',                 // 替换为你的视频文件路径
            videoName: '',
            videoTitle: '',
            videoType: null, // 视频类型
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

            // 专辑相关
            activeTab: 'comment', // 当前Tab，默认显示评论
            albumVideos: [],    // 专辑视频列表
            albumLoading: false,

            // 视频导航相关
            currentVideoIndex: -1, // 当前视频在专辑中的索引
            hasPreviousVideo: false,
            hasNextVideo: false,
            showNavigationButtons: false, // 控制导航按钮显示/隐藏
            pendingNotification: null, // 待显示的通知
            
            // 举报相关
            showReportDialog: false,
            hasReported: false,
            reportForm: {
                reportType: '',
                reportDescription: ''
            },
            videoType: null, // 视频类型
            sourceVideoUrl: null, // 源视频链接
            maxWatchTime: null, // 最大观看时间（秒），用于无版权视频限制
            showTimeLimitOverlay: false, // 显示30秒限制遮罩
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
        
        // 视频类型工具方法
        getVideoTypeText,
        getVideoTypeClass,
        getVideoTypeTag,

        // 聚焦到评论输入框
        focusCommentInput() {
            this.$nextTick(() => {
                if (this.$refs.commentInput) {
                    this.$refs.commentInput.focus();
                }
            });
        },

        // 刷新用户信息
        refreshUserInfo() {
            try {
                const storedUserInfo = localStorage.getItem("userInfo");
                if (storedUserInfo) {
                    this.userInfo = JSON.parse(storedUserInfo);
                }
            } catch (error) {
                console.error('刷新用户信息失败:', error);
            }
        },

        // 回复评论
        replyToComment(parentComment, replyComment = null) {
            // 刷新用户信息，确保数据是最新的
            this.refreshUserInfo();

            if (!this.userInfo) {
                this.$message.warning({ message: '请先登录', showClose: true });
                return;
            }

            this.replyTo = replyComment || parentComment;
            this.addComment.parentId = this.replyTo.videoCommentId;
            this.addComment.replyToId = this.replyTo.userId;

            // 自动聚焦到输入框
            this.focusCommentInput();
        },

        // 取消回复
        cancelReply() {
            this.replyTo = null;
            this.addComment.parentId = null;
            this.addComment.replyToId = null;

            // 取消回复后也聚焦到输入框
            this.focusCommentInput();
        },

        async videoPlay() {
            try {
                const urlParams = new URLSearchParams(window.location.search)
                //  movieId为从videoList传来的videoId
                const movieId = urlParams.get("movieId")             //从URL中获取movieId
                this.reqComment.videoId = this.addComment.videoId = movieId

                // 重置30秒限制相关状态
                this.maxWatchTime = null;
                this.showTimeLimitOverlay = false;

                this.url = await authService.videoURL(movieId);
                await authService.increaseViewCount(movieId);

                //  验证用户是否可以观看视频，仅用于提示作用，如果该用户是这个视频的作者，即使为VIP视频也可以观看
                const response = await authService.verify(movieId)
                console.log(response)
                
                // 获取视频类型和源视频链接
                if (response.status === 200 && response.data) {
                    const data = response.data;
                    this.videoType = data.videoType;
                    this.sourceVideoUrl = data.sourceVideoUrl;
                    
                    // 检查是否可以观看
                    if (data.canWatch === false) {
                        // 不能观看，显示原因
                        if (data.reason === 'NO_COPYRIGHT' || data.videoType === 'NO_COPYRIGHT') {
                            // 无版权视频，显示提示并提供跳转链接
                            this.$message.warning({ 
                                message: data.message || '该视频为无版权视频，仅管理员可以观看', 
                                showClose: true,
                                duration: 5000
                            });
                            // 如果提供了源视频链接，可以显示跳转提示
                            if (this.sourceVideoUrl) {
                                this.showTimeLimitOverlay = true; // 显示提示覆盖层
                            }
                        } else if (data.reason === 'VIP_REQUIRED') {
                            // VIP视频
                            this.$message.warning({ 
                                message: data.message || '视频为VIP视频，升级会员即可观看全片', 
                                showClose: true 
                            });
                        } else {
                            // 其他原因
                            this.$message.warning({ 
                                message: data.message || '无法观看该视频', 
                                showClose: true 
                            });
                        }
                    } else {
                        // 可以观看
                        // 如果后端返回了maxWatchTime，使用后端返回的值（用于无版权视频30秒限制）
                        if (data.maxWatchTime !== undefined && data.maxWatchTime !== null) {
                            this.maxWatchTime = data.maxWatchTime;
                        } else if (this.videoType === 'NO_COPYRIGHT') {
                            // 如果没有返回maxWatchTime但视频类型是无版权，设置30秒限制（管理员情况）
                            this.maxWatchTime = null; // 管理员可以观看完整视频，不设置限制
                        }
                    }
                    
                    // 检查是否已举报
                    if (this.userInfo) {
                        try {
                            const reportCheck = await authService.checkReport(movieId);
                            this.hasReported = reportCheck.data?.hasReported || false;
                        } catch (e) {
                            console.error('检查举报状态失败', e);
                        }
                    }
                }

                if (response.status == 401) {
                    this.$message.warning({ message: '登录已过期，请重新登录', showClose: true })
                }
            } catch (error) {
                console.error(error)
                if (error.response && error.response.status == 403 || error.isUnauthorizedError == true) {
                    this.$message.warning({ message: '视频为VIP视频，升级会员即可观看全片', showClose: true })
                }
            }

        },
        
        // 处理举报按钮点击
        handleReportClick() {
            if (!this.userInfo) {
                this.$message.warning({ message: '请先登录后再举报', showClose: true });
                return;
            }
            this.showReportDialog = true;
        },
        
        // 提交举报
        async submitReport() {
            if (!this.reportForm.reportType || !this.reportForm.reportDescription) {
                this.$message.warning({ message: '请填写完整的举报信息', showClose: true });
                return;
            }
            
            if (!this.userInfo) {
                this.$message.warning({ message: '请先登录', showClose: true });
                return;
            }
            
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const movieId = urlParams.get("movieId");
                
                const reportData = {
                    videoId: parseInt(movieId),
                    reportType: this.reportForm.reportType,
                    reportDescription: this.reportForm.reportDescription
                };
                
                const response = await authService.submitReport(reportData);
                if (response.status === 200) {
                    this.$message.success({ message: '举报提交成功，我们会尽快处理', showClose: true });
                    this.showReportDialog = false;
                    this.hasReported = true;
                    this.reportForm = { reportType: '', reportDescription: '' };
                }
            } catch (error) {
                console.error('提交举报失败', error);
                if (error.response && error.response.data) {
                    this.$message.error({ message: error.response.data || '举报提交失败', showClose: true });
                }
            }
        },
        
        // 跳转到源视频链接
        goToSourceVideo() {
            if (this.sourceVideoUrl) {
                window.open(this.sourceVideoUrl, '_blank');
            } else {
                this.$message.warning({ message: '暂无正版链接', showClose: true });
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
            try {
                // 刷新用户信息，确保数据是最新的
                this.refreshUserInfo();

                if (!this.userInfo) {
                    this.$message.warning({ message: '请先登录', showClose: true });
                    return;
                }

                // 添加调试信息
                console.log('删除评论参数:', { videoCommentId: videoCommentId });
                console.log('当前用户信息:', this.userInfo);

                // 直接使用 axios 发送请求，确保数据正确传递
                const token = localStorage.getItem('VideoToken');
                const response = await axios.post(`${authService.backendAddress()}/api/deleteComment`,
                    { videoCommentId: videoCommentId },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                );
                console.log('删除评论响应:', response);

                if (response.data == true && response.status == 200) {
                    this.$message.warning({ message: `删除评论成功：${videoCommentId}`, showClose: true })
                    // 递归删除评论（支持顶层和回复）
                    this.comments = this.removeCommentById(this.comments, videoCommentId);
                } else {
                    this.$message.error({ message: '删除评论失败', showClose: true });
                }
            } catch (error) {
                console.error('删除评论失败:', error);
                this.$message.error({ message: '删除评论失败，请重试', showClose: true });
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

        // 拍平所有子回复
        flattenReplies(comment) {
            const result = [];
            function dfs(replies) {
                if (!replies) return;
                for (const reply of replies) {
                    result.push(reply);
                    if (reply.replies && reply.replies.length > 0) {
                        dfs(reply.replies);
                    }
                }
            }
            dfs(comment.replies);
            return result;
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
                this.refreshUserInfo();
                this.addComment.videoCommentTime = Date.now();
                if (this.userInfo == null) {
                    this.$message.warning({ message: '请登录' });
                    return;
                }
                const userId = this.userInfo.userId;
                if (!this.addComment.videoCommentContent.trim()) {
                    this.$message.warning({ message: '评论内容不能为空', showClose: true });
                    return;
                } else if (this.userInfo == null || userId == null) {
                    this.$message.warning({ message: '登录后即可评论', showClose: true });
                    return;
                } else {
                    this.addComment.userId = userId;
                    this.addComment.userName = this.userInfo.userName;
                    const response = await authService.addComment(this.addComment);
                    if (response.status == 200 && response.data && response.data.success) {
                        // 用后端返回的真实ID
                        const newComment = {
                            ...this.addComment,
                            videoCommentId: response.data.videoCommentId,
                            replies: [],
                        };
                        this.insertNewCommentToList(newComment);
                        this.$message.success({ message: '评论成功', showClose: true });
                        this.addComment = {
                            videoId: this.reqComment.videoId,
                            parentId: null,
                            replyToId: null
                        };
                        this.cancelReply();
                        this.focusCommentInput();
                    } else {
                        this.$message.error({ message: '出错啦', showClose: true });
                    }
                }
            } catch (error) {
                console.error('提交评论失败：', error);
                this.$message.error({ messsage: '提交评论失败', showClose: true });
            }
        },

        // 新增辅助方法
        insertNewCommentToList(newComment) {
            if (!newComment.parentId) {
                // 顶级评论，插入最前面
                this.comments.unshift(newComment);
            } else {
                // 递归查找父评论
                const parent = this.findCommentById(this.comments, newComment.parentId);
                if (parent) {
                    if (!parent.replies) parent.replies = [];
                    parent.replies.push(newComment);
                }
            }
        },
        findCommentById(comments, id) {
            for (let comment of comments) {
                if (comment.videoCommentId === id) return comment;
                if (comment.replies && comment.replies.length > 0) {
                    const found = this.findCommentById(comment.replies, id);
                    if (found) return found;
                }
            }
            return null;
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
            const video = this.$refs.videoRef || this.video;
            if (!video) return;
            
            const currentTime = video.currentTime;
            
            // 30秒限制检查（无版权视频）
            if (this.maxWatchTime && currentTime >= this.maxWatchTime) {
                video.pause();
                this.showTimeLimitOverlay = true;
                return;
            }
            
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

        async fetchAlbumVideos() {
            this.albumLoading = true;
            try {
                const videoId = this.getVideoIdByURL();
                const res = await authService.videosInSameAlbum(videoId);
                this.albumVideos = res.data || [];
                // 更新视频导航状态
                this.updateVideoNavigation();
                // 更新当前视频信息
                this.updateCurrentVideoInfoFromAlbum();
            } catch (e) {
                this.$message.error('获取专辑视频失败');
            }
            this.albumLoading = false;
        },
        handleTabChange(tabName) {
            this.activeTab = tabName;
            // 移除重复获取数据的逻辑，因为页面加载时已经获取了
        },

        // 专辑滚动处理
        handleAlbumScroll(event) {
            // 可以在这里添加专辑列表的滚动加载逻辑
            const container = event.target;
            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;
            const scrollHeight = container.scrollHeight;

            // 检查是否滚动到底部，可以在这里实现分页加载
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                // 这里可以添加加载更多专辑视频的逻辑
                console.log('专辑列表滚动到底部');
            }
        },

        // 格式化视频时长
        formatDuration(seconds) {
            if (!seconds) return '0:00';
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        },
        goToVideo(video) {
            // 跳转到该视频播放页，只带上movieId参数
            const currentPath = window.location.pathname;
            const queryParams = new URLSearchParams({
                movieId: video.videoId
            });
            window.location.href = `${currentPath}?${queryParams.toString()}`;
        },

        // 从专辑数据中获取当前视频信息
        updateCurrentVideoInfoFromAlbum() {
            const currentVideoId = this.getVideoIdByURL();
            const currentVideo = this.albumVideos.find(video => video.videoId == currentVideoId);

            if (currentVideo) {
                this.videoName = currentVideo.videoName;
                this.videoTitle = currentVideo.videoTitle;
                this.videoType = currentVideo.videoType;
                console.log('currentVideo:  ' + JSON.stringify(this.videoType))
            }
        },

        // 更新当前视频信息后刷新导航状态
        updateCurrentVideoInfo() {
            // 在视频信息更新后，重新获取专辑视频并更新导航状态
            if (this.activeTab === 'album' || this.albumVideos.length > 0) {
                this.fetchAlbumVideos();
            }
        },

        getThumbnailUrl(path) {
            // 根据你的后端缩略图访问规则拼接
            return `${authService.backendAddress()}/images/${path}`;
        },

        // 格式化播放量
        formatViewCount(count) {
            if (count >= 10000) return (count / 10000).toFixed(1) + '万';
            return count;
        },

        // 处理缩略图加载错误
        handleThumbnailError(event) {
            event.target.src = require('../../assets/Damaged.png');
        },

        // 判断是否为当前播放的视频
        isCurrentVideo(video) {
            const currentVideoId = this.getVideoIdByURL();
            return video.videoId == currentVideoId;
        },

        // 处理视频播放结束
        handleVideoEnded() {
            console.log('视频播放结束，自动播放下一个视频');
            this.playNextVideo();
        },

        // 播放下一个视频
        playNextVideo() {
            if (!this.hasNextVideo) {
                this.$message.warning({ message: '已经是最后一个视频啦', showClose: true });
                return;
            }

            const nextIndex = this.currentVideoIndex + 1;
            if (nextIndex < this.albumVideos.length) {
                const nextVideo = this.albumVideos[nextIndex];
                // 保存通知到localStorage
                localStorage.setItem('videoSwitchNotification', JSON.stringify({
                    type: 'success',
                    message: `正在切换到：${nextVideo.videoName}`,
                    timestamp: Date.now()
                }));
                // 添加点击反馈
                this.addClickFeedback('next');
                this.goToVideo(nextVideo);
            }
        },

        // 播放上一个视频
        playPreviousVideo() {
            if (!this.hasPreviousVideo) {
                this.$message.warning({ message: '已经是第一个视频啦', showClose: true });
                return;
            }

            const prevIndex = this.currentVideoIndex - 1;
            if (prevIndex >= 0) {
                const prevVideo = this.albumVideos[prevIndex];
                // 保存通知到localStorage
                localStorage.setItem('videoSwitchNotification', JSON.stringify({
                    type: 'success',
                    message: `正在切换到：${prevVideo.videoName}`,
                    timestamp: Date.now()
                }));
                // 添加点击反馈
                this.addClickFeedback('prev');
                this.goToVideo(prevVideo);
            }
        },

        // 添加点击反馈效果
        addClickFeedback(type) {
            const button = document.querySelector(`.nav-button.${type}-button`);
            if (button) {
                button.classList.add('clicking');
                setTimeout(() => {
                    button.classList.remove('clicking');
                }, 150);
            }
        },

        // 更新视频导航状态
        updateVideoNavigation() {
            if (this.albumVideos.length === 0) {
                this.hasPreviousVideo = false;
                this.hasNextVideo = false;
                return;
            }

            // 找到当前视频在专辑中的索引
            const currentVideoId = this.getVideoIdByURL();
            this.currentVideoIndex = this.albumVideos.findIndex(video => video.videoId == currentVideoId);

            // 更新导航按钮状态
            this.hasPreviousVideo = this.currentVideoIndex > 0;
            this.hasNextVideo = this.currentVideoIndex < this.albumVideos.length - 1;
        },

        // 控制导航按钮显示/隐藏
        handleVideoMouseEnter() {
            this.showNavigationButtons = true;
        },

        handleVideoMouseLeave() {
            this.showNavigationButtons = false;
        },

        // 检查并显示保存的通知
        checkAndShowNotification() {
            const savedNotification = localStorage.getItem('videoSwitchNotification');
            if (savedNotification) {
                try {
                    const notification = JSON.parse(savedNotification);
                    const now = Date.now();
                    // 只显示5秒内的通知
                    if (now - notification.timestamp < 5000) {
                        if (notification.type === 'success') {
                            this.$message.success({
                                message: notification.message,
                                showClose: true,
                                duration: 3000
                            });
                        }
                    }
                    // 清除保存的通知
                    localStorage.removeItem('videoSwitchNotification');
                } catch (error) {
                    console.error('解析通知失败:', error);
                    localStorage.removeItem('videoSwitchNotification');
                }
            }
        },

        // 处理视频播放状态变化
        handlePlay() {
            this.currentDanmakus.forEach(danmaku => {
                danmaku.paused = false;
            });
            // 播放时隐藏导航按钮
            this.showNavigationButtons = false;
        },

        handlePause() {
            this.currentDanmakus.forEach(danmaku => {
                danmaku.paused = true;
            });
            // 暂停时显示导航按钮
            this.showNavigationButtons = true;
        },

        getParentUserName(parentId, rootComment) {
            // 递归查找parentId对应的评论
            function dfs(comment) {
                if (!comment) return null;
                if (comment.videoCommentId === parentId) return comment.userName || comment.userId;
                if (comment.replies && comment.replies.length > 0) {
                    for (const reply of comment.replies) {
                        const found = dfs(reply);
                        if (found) return found;
                    }
                }
                return null;
            }
            return dfs(rootComment);
        }

    },
    mounted() {
        // 刷新用户信息
        this.refreshUserInfo();

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

        // 页面加载时立即获取专辑数据，确保导航按钮正常工作
        this.fetchAlbumVideos()

        // 检查并显示保存的通知
        this.$nextTick(() => {
            setTimeout(() => {
                this.checkAndShowNotification();
            }, 500); // 延迟500ms确保页面完全加载
        });
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

/* 视频导航按钮 */
.video-navigation {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    z-index: 10;
    pointer-events: none;
    /* 让按钮可以穿透到视频上 */
    transition: opacity 0.3s ease;
}

/* 优化视频容器样式 */
.video-container {
    position: relative;
    width: 100%;
    max-width: 80vw;
    height: 80vh;
    margin: 0 auto;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.nav-button {
    width: 60px;
    height: 45px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7));
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: #fff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
    backdrop-filter: blur(12px);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
}

.nav-button:hover {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8));
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.06);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
}

.nav-button:active {
    transform: scale(1.05);
    transition: all 0.1s ease;
}

.nav-button.disabled {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.nav-button.disabled:hover {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.1);
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 文字样式 */
.nav-text {
    font-size: 10px;
    font-weight: 500;
    text-align: center;
    line-height: 1.2;
    letter-spacing: 0.3px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 为按钮添加特殊效果 */
.nav-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 6px;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.nav-button:hover::before {
    opacity: 1;
}

/* 添加按钮内部光效 */
.nav-button::after {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    border-radius: 5px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.nav-button:hover::after {
    opacity: 1;
}

/* 添加方向指示器 */
.nav-button.prev-button .nav-text::before {
    content: '◀';
    margin-right: 3px;
    font-size: 8px;
    opacity: 0.7;
}

.nav-button.next-button .nav-text::after {
    content: '▶';
    margin-left: 3px;
    font-size: 8px;
    opacity: 0.7;
}

/* 添加按钮点击动画 */
@keyframes buttonClick {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(0.95);
    }

    100% {
        transform: scale(1);
    }
}

.nav-button.clicking {
    animation: buttonClick 0.15s ease-in-out;
}

/* 添加按钮脉冲效果 */
@keyframes buttonPulse {
    0% {
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
    }

    50% {
        box-shadow: 0 3px 12px rgba(64, 158, 255, 0.25);
    }

    100% {
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
    }
}

.nav-button:not(.disabled):hover {
    animation: buttonPulse 2s infinite;
}

video {
    width: 100%;
    height: 80vh;
    object-fit: contain;
}

.danmaku-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80vh;
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
    line-clamp: 2;
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
    /* margin: 24px 0 16px 0; */
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

.video-badge.paid {
    background: linear-gradient(90deg, #ffa726 0%, #fb8c00 100%);
}

.video-badge.no-copyright {
    background: linear-gradient(90deg, #9e9e9e 0%, #757575 100%);
}

.video-badge.exclusive {
    background: linear-gradient(90deg, #ab47bc 0%, #8e24aa 100%);
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

/* 专辑视频网格样式 */
.album-video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    padding: 16px;
}

.album-video-card {
    position: relative;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
    cursor: pointer;
}

.album-video-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.album-video-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    color: #fff;
    z-index: 2;
}

.album-video-badge.vip {
    background: linear-gradient(90deg, #ff6b6b 0%, #ee5a52 100%);
}

.album-video-badge.free {
    background: linear-gradient(90deg, #00d4aa 0%, #00b894 100%);
}

.album-video-badge.paid {
    background: linear-gradient(90deg, #ffa726 0%, #fb8c00 100%);
}

.album-video-badge.no-copyright {
    background: linear-gradient(90deg, #9e9e9e 0%, #757575 100%);
}

.album-video-badge.exclusive {
    background: linear-gradient(90deg, #ab47bc 0%, #8e24aa 100%);
}

.album-video-thumbnail {
    position: relative;
    width: 100%;
    height: 150px;
    overflow: hidden;
}

.album-video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.album-video-card:hover .album-video-thumbnail img {
    transform: scale(1.05);
}

.album-video-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.album-video-stats {
    display: flex;
    gap: 8px;
}

.album-stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #fff;
    font-size: 11px;
    font-weight: 500;
}

.album-video-info {
    padding: 6px;
}

.album-video-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    line-height: 1.4;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.album-video-description {
    font-size: 12px;
    color: #666;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 当前播放视频样式 */
.album-video-card.current-playing {
    border: 2px solid #409eff;
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
}

.album-video-card.current-playing:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(64, 158, 255, 0.4);
}

/* 播放指示器 */
.playing-indicator {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(64, 158, 255, 0.9);
    border-radius: 20px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 3;
}

.playing-text {
    color: #fff;
    font-size: 10px;
    font-weight: 500;
}

/* 音频条动画 */
.audio-bars {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 12px;
}

.bar {
    width: 2px;
    background: #fff;
    border-radius: 1px;
    animation: audioWave 1.2s ease-in-out infinite;
}

.bar1 {
    height: 4px;
    animation-delay: 0s;
}

.bar2 {
    height: 8px;
    animation-delay: 0.2s;
}

.bar3 {
    height: 6px;
    animation-delay: 0.4s;
}

.bar4 {
    height: 10px;
    animation-delay: 0.6s;
}

@keyframes audioWave {

    0%,
    100% {
        transform: scaleY(0.5);
    }

    50% {
        transform: scaleY(1);
    }
}

/* 自定义Tab按钮样式 */
.tab-header {
    background: #f7f8fa;
    border-bottom: 1px solid #e4e7ed;
    padding: 0;
}

.tab-buttons {
    display: flex;
    background: #f7f8fa;
}

.tab-button {
    flex: 1;
    padding: 12px 16px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    background: transparent;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
    user-select: none;
}

.tab-button:hover {
    color: #409eff;
    background: rgba(64, 158, 255, 0.1);
}

.tab-button.active {
    color: #409eff;
    border-bottom-color: #409eff;
    background: #fff;
}

.tab-content {
    height: calc(100vh - 50px);
    /* 减去Tab头部高度 */
    background: #f7f8fa;
}
</style>