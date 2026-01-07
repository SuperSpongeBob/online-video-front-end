<template>
    <div class="video-grid-container custom-scrollbar"@scroll="handleScroll" style="height: 90%; overflow-y: auto;">
        <div class="video-grid">
            <div v-for="movie in movies" :key="movie.videoId" class="video-card">
                <!-- 加载骨架屏 -->
                <div v-if="loading" class="skeleton-card">
                    <div class="skeleton-thumbnail"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-title"></div>
                        <div class="skeleton-description"></div>
                    </div>
                </div>

                <!-- 视频卡片内容 -->
                <div v-else>
                    <!-- VIP/免费标签 -->
                    <div :class="['video-badge', getVideoTypeClass(movie.videoType || movie.videoIsVip)]">
                        {{ getVideoTypeText(movie.videoType || movie.videoIsVip) }}
                    </div>

                    <!-- 视频缩略图 -->
                    <div class="video-thumbnail" @click="goToMoviePage(movie)">
                        <img :src="movie.thumbnailPath" @error="handleError" alt="视频缩略图" />

                        <!-- 视频信息覆盖层 -->
                        <div class="video-overlay">
                            <div class="video-stats">
                                <div class="stat-item">
                                    <el-icon>
                                        <View />
                                    </el-icon>
                                    <span>{{ formatViewCount(movie.viewCount) }}</span>
                                </div>
                            </div>
                            <div class="video-stats">
                                <div class="stat-item">
                                    <span>{{ formatDuration(movie.duration) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 视频信息 -->
                    <div class="video-info">
                        <div class="video-title">{{ movie.videoName }}</div>
                        <div class="video-description">{{ movie.videoTitle }}</div>

                        <!-- 标签区域 -->
                        <div class="video-tags">
                            <span class="video-tag">{{ movie.videoChannel || '未知分类' }}</span>
                            <span class="video-tag">{{ getVideoTypeTag(movie.videoType || movie.videoIsVip) }}</span>
                            <span v-if="movie.viewCount > 10000" class="video-tag">热门</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import fallbackImage from '../../assets/Damaged.png'
import authService from "../../utils/authService";
import { getVideoTypeText, getVideoTypeClass, getVideoTypeTag } from '../../utils/videoTypeUtils';
import '../../assets/videoCard.css' // 引入新样式

export default {
    name: 'VideoList',
    props: {
        videoType: {
            type: String,
            default: ''
        },
        // 兼容旧字段
        videoIsVip: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            loading: false,
            movies: [],
            req: {
                videoType: this.videoType || (this.videoIsVip === '2' ? 'VIP' : this.videoIsVip === '1' ? '免费' : ''),
                pageNum: 1,
                pageSize: 28,
                isLoading: false,
                videoAlbum: {},
            },
        };
    },
    methods: {
        formatDuration(seconds) {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return `${h ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        },
        formatViewCount(count) {
            if (count >= 10000) return (count / 10000).toFixed(1) + '万';
            return count;
        },
        async fetchMovies() {
            try {
                if (this.req.isLoading) return;
                this.req.isLoading = true;
                const response = await authService.getIndexVideos(this.req)
                console.log(response)
                if (response.status == 200) {
                    // 洗牌算法打乱顺序
                    const shuffledData = response.data.slice();
                    for (let i = shuffledData.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
                    }
                    const newMovies = shuffledData.map(item => {
                        if (item.thumbnailPath) {
                            return {
                                ...item,
                                thumbnailPath: `${authService.backendAddress()}/images/${item.thumbnailPath}`
                            }
                        } else {
                            return {
                                ...item,
                                thumbnailPath: fallbackImage
                            }
                        }
                    });
                    this.movies = [...this.movies, ...newMovies];
                    this.req.pageNum++;
                    this.req.isLoading = false;
                } else if (response.status == 204) {
                    this.$message.warning({ message: '到底啦~~~~~', showClose: true })
                    return
                } else {
                    return
                }
            } catch (error) {
                console.error(error);
            }
        },
        handleScroll(event) {
            const container = event.target;
            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;
            const scrollHeight = container.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                this.fetchMovies();
            }
        },
        goToMoviePage(movie) {
            window.open(`${window.location.origin}/videoPlay?movieId=${movie.videoId}`);
        },
        handleError(event) {
            event.target.src = fallbackImage
        },
        getVideoTypeText,
        getVideoTypeClass,
        getVideoTypeTag,
    },
    mounted() {
        this.fetchMovies();
    },
};
</script>