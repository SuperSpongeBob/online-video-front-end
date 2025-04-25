<template>
    <el-main @scroll="handleScroll"
        style=" height: 100vh; position: relative; overflow-y: auto; scrollbar-width: none;">
        <el-row :gutter="20">

            <el-row v-for="movie in movies">
                <el-space direction="vertical" alignment="flex-start">
                    <el-skeleton style="width: 240px" :loading="loading" animated>
                        <template #template>
                            <el-skeleton-item variant="image" style="width: 240px; height: 240px" />
                            <div style="padding: 14px">
                                <el-skeleton-item variant="h3" style="width: 50%" />
                                <div
                                    style="display: flex;align-items: center;justify-items: space-between;margin-top: 16px;height: 16px;">
                                    <el-skeleton-item variant="text" style="margin-right: 16px" />
                                    <el-skeleton-item variant="text" style="width: 30%" />
                                </div>
                            </div>
                        </template>
                        <template #default>
                            <el-card :body-style="{ padding: '0px', marginBottom: '1px' }"
                                style="width: 240px; height: 250px; margin: 6px;">
                                <div v-if="!loading" :style="{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    color: 'white',
                                    backgroundColor: movie.videoIsVip === 2 ? '#EC2828' : '#33CD00'
                                }">
                                    {{ movie.videoIsVip === 2 ? "VIP" : "免费" }}
                                </div>
                                <div v-if="!loading" :style="{
                                    position: 'absolute',
                                    top: '160px',
                                    left: '8px',
                                    padding: '2px 4px',
                                    color: 'white',
                                    borderRadius: '3px',
                                    fontSize: '12px',
                                }">
                                    <el-icon>
                                        <View />
                                    </el-icon>&nbsp;{{ movie.viewCount }}
                                </div>
                                <div v-if="!loading" :style="{
                                    position: 'absolute',
                                    top: '160px',
                                    right: '8px',
                                    padding: '2px 4px',
                                    color: 'white',
                                    borderRadius: '3px',
                                    fontSize: '12px',
                                }">{{ formatDuration(movie.duration) }}
                                </div>
                                <div style="height: 180px;display: flex;justify-content: center;align-items:start;"
                                    @click="goToMoviePage(movie)">
                                    <img class="image" :src="movie.thumbnailPath"
                                        style="max-width: 240px; height: 180px;" @error="handleError" />
                                </div>
                                <div style="padding: 4px">
                                    <div class="bottom card-header"
                                        style="margin-bottom: 8px;;font-weight: bold;font-size: larger;">
                                        {{ movie.videoName }}
                                    </div>
                                    {{ movie.videoTitle }}
                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-space>
            </el-row>
        </el-row>
    </el-main>
</template>

<script>
import fallbackImage from '../../assets/Damaged.png'
import authService from "../../utils/authService";

export default {
    name: 'VideoList',
    props: {
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
                videoIsVip: this.videoIsVip,             //  父组件传来的值
                pageNum: 1, //  初始化页码
                pageSize: 28, //  设置加载每页大小
                isLoading: false, //  是否真正加载
                videoAlbum: {
                },
            },
            video: {
                pageNum: 1, //  初始化页码
                pageSize: 28, //  设置加载每页大小
            },
        };
    },
    methods: {
        // 格式化时长
        formatDuration(seconds) {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return `${h ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        },
        async fetchMovies() {
            try {
                if (this.req.isLoading) return;
                this.req.isLoading = true;
                // const response = await axios.post(`http://localhost:8080/api/videos`, this.req);
                const response = await authService.getIndexVideos(this.req)
                // console.log(response)
                if (response.status == 200) {

                    const newMovies = response.data.map(item => {
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

                    // const newMovies = response.data;
                    this.movies = [...this.movies, ...newMovies];
                    // console.log(this.movies)
                    this.req.pageNum++;
                    this.req.isLoading = false;
                } else if (response.status == 204) {
                    this.$message.warning({ message: '到底啦~~~~~', showClose: true })
                    console.log('没有数据了')
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
            // 检查是否滚动到底部
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                this.fetchMovies(); // 加载更多视频
            }
        },

        //跳转视频播放页
        goToMoviePage(movie) {
            //  动态生成跳转链接
            //  新窗口打开，并将视频id传出去
            window.open(`${window.location.origin}/videoPlay?movieId=${movie.videoId}&VIP=${movie.videoIsVip}&videoName=${movie.videoName}&videoTitle=${movie.videoTitle}`);
        },
        handleError(event) {
            event.target.src = fallbackImage
            // event.target.onError
        },
    },
    mounted() {
        this.fetchMovies();
    },
};
</script>