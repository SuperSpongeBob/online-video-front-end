<template>
    <el-main @scroll="handleScroll" style="height: 100vh;position: relative;overflow-y: auto;scrollbar-width: none;">
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
import authService from "../../utils/authService";
import fallbackImage from '../../assets/Damaged.png'
export default {
    data() {
        return {
            loading: false,
            movies: [],
            req: {
                videoName: "",
                pageNum: 1, //  初始页码数
                pageSize: 28, //  每页获取数据条数
                isLoading: false,
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
                if (this.req.isLoading) return; //如果正在加载直接退出
                this.req.isLoading = true; //重新定义正在加载

                this.req.videoName = this.$route.params.searchText; //从路由中获取videoName
                console.log(this.$route.params.searchText);
                const response = await authService.searchVideo(this.req)
                if (response.data == '') {                  //  判断是否为空，如果为空直接退出，isLoading永远为true，将不再请求
                    console.log('视频到底了')
                    this.$message.warning({message:'没有更多视频了'})
                    this.req.isLoading=false
                    return
                }
                console.log(response)
                // 为每个元素的 videoAlbum.videoPostPath 属性添加前缀并处理 null 值
                const backendAddress = authService.backendAddress()
                const newMovies = response.data.map(item => {
                    if (item.thumbnailPath) {
                        return {
                            ...item,
                            thumbnailPath: `${backendAddress}/images/${item.thumbnailPath}`
                        }
                    } else {
                        return {
                            ...item,
                            thumbnailPath: fallbackImage
                        }
                    }
                });

                // const newMovies = response.data; //获取返回的数据
                this.movies = [...this.movies, ...newMovies]; //将新的数据合并
                console.log(this.movies)
                this.req.pageNum++; //再次请求数据时页码+1
                this.req.isLoading = false; //请求结束
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
                this.fetchMovies(); // 加载更多评论
            }
        },

        //跳转视频播放页
        goToMoviePage(movie) {
            //新窗口打开，并将视频id传出去
            window.open(`${window.location.origin}/videoPlay?movieId=${movie.videoId}&VIP=${movie.videoIsVip}&videoName=${movie.videoName}&videoTitle=${movie.videoTitle}`);
        },

        //更新获取的视频
        async updateMovies() {
            if (this.req.isLoading) return;
            this.req.isLoading = true;
            this.req.pageNum = 1; //初始化页码
            const response = await authService.searchVideo(this.req)

            // 为每个元素的 videoAlbum.videoPostPath 属性添加前缀并处理 null 值
            const backendAddress = authService.backendAddress()
            const newMovies = response.data.map(item => {
                if (item.thumbnailPath) {
                    return {
                        ...item,
                        thumbnailPath: `${backendAddress}/images/${item.thumbnailPath}`
                    }
                } else {
                    return {
                        ...item,
                        thumbnailPath: fallbackImage
                    }
                }
                return item;
            });
            this.movies = newMovies

            // this.movies = response.data; //直接替换掉原有的视频数据
            this.req.pageNum++;
            this.req.isLoading = false;
        },
    },

    //监测路由信息是否发生变动，如果变动则重新获取数据
    watch: {
        "$route.params.searchText": function (newName) {
            if (newName !== this.req.videoName) {
                this.req.videoName = newName;
                // 在这里处理数据更新的逻辑
                this.updateMovies();
            }
        },
    },
    mounted() {
        this.fetchMovies();
    },
};
</script>