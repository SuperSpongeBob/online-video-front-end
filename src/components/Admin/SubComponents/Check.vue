<template>

    <el-divider content-position="center">待审核视频</el-divider>

    <el-card>
        <el-table :data="videoData" max-height="700" stripe>
            <el-table-column fixed="left" width="100" property="videoId" label="视频id" />
            <el-table-column width="180" property="videoName" label="视频名称" />
            <el-table-column width="120" property="duration" label="视频时长">
                <template #default="{ row }">
                    {{ formatDuration(row.duration) }}
                </template>
            </el-table-column>
            <el-table-column prop="videoIsVip" label="视频类型" width="100" show-overflow-tooltip>
                <template #default="scope">
                    <span>{{ getRule(scope.row.videoIsVip) }}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" property="videoApprovalStatus" label="审核状态">
                <template #default="scope">
                    <span :style="getStatusColor(scope.row.videoApprovalStatus)">{{ scope.row.videoApprovalStatus
                        }}</span>
                </template>
            </el-table-column>
            <el-table-column property="videoTitle" label="标题" show-overflow-tooltip />
            <el-table-column prop="thunbnailPath" label="缩略图" width="160" header-align="center">
                <template v-slot="scope">
                    <el-image :src="scope.row.thumbnailPath"></el-image>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Operations" width="220" header-align="center">
                <template #default="scope">
                    <el-button link @click="centerDialogVisible = true; viewVideo(scope.row)">查看视频</el-button>
                    <el-button link type="primary" @click="approval(scope.row, false)">审核通过</el-button>
                    <el-button link type="danger" @click="ban(scope.row)">禁播</el-button>
                </template>
            </el-table-column>
        </el-table>

    </el-card>


    <el-dialog v-model="centerDialogVisible" width="1000" align-center>

        <video id="myVideo" controls controlsList="nodownload" :src="url"
            style="width: 100%; height: 60%;object-fit: contain;max-width: 90vw;max-height: 80vh;">
            您的浏览器不支持视频播放。
        </video>
        <div>审核状态：<span :style="getStatusColor(this.subVideoData.videoApprovalStatus)">{{
            this.subVideoData.videoApprovalStatus }}</span></div>
        <div>视频id：{{ this.subVideoData.videoId }}</div>
        <div>视频名称：{{ this.subVideoData.videoName }} </div>
        <span>视频标题：{{ this.subVideoData.videoTitle }}</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" plain @click="previousVideo(subVideoData)">上一个</el-button>
                <el-button type="danger" @click="ban(subVideoData, true)">禁播</el-button>
                <el-button type="primary" @click="approval(subVideoData, true)">审核通过</el-button>
                <el-button type="primary" plain @click="nextVideo(subVideoData)">下一个</el-button>
            </div>
        </template>

    </el-dialog>
</template>

<script>
import { ref } from 'vue';
import authService from '../../../utils/authService';


export default {
    data() {
        return {
            video: {
                userId: "",
                videoAlbumId: "",
                videoApprovalStatus: "待审核",  //  获取待审核的视频
                videoAlbum: {}
            },
            videoAlbum: {
                userId: ""
            },

            videoData: [],                      //  表格数据
            subVideoData: [],                   //  用于对话框的数据显示
            AlbumData: [],
            centerDialogVisible: ref(false),    //  对话框是否显示
            url: '',                            //  视频播放路径
            videoItem: {}
        }
    },
    methods: {

        //  根据不同状态显示不同颜色字体
        getStatusColor(status) {
            switch (status) {
                case "审核通过":
                    return { color: 'green' };
                case "待审核":
                    return { color: 'orange' };
                case "禁播":
                    return { color: 'red' };
                default:
                    return {}
            }
        },

        //  根据数据显示对应的状态
        getRule(videoIsVip) {
            console.log(videoIsVip)
            switch (videoIsVip) {
                case '0':
                    return "免费";
                case '1':
                    return "免费";
                case '2':
                    return "VIP";
                default:
                    return ""
            }
        },

        // 格式化时长
        formatDuration(seconds) {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return `${h ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        },

        //  查看视频
        async viewVideo(row) {
            this.subVideoData = row
            // const response = await axios.get(`http://localhost:8080/api/video/${row.videoId}`);
            // this.url = response.data
            // this.url=`http://localhost:8080/static/video?videoId=${row.videoId}`
            this.url = await authService.videoURL(row.videoId)
            // this.$message.warning({ message: '查看视频', showClose: true })
        },
        //  审核通过
        async approval(row, isDialog) {
            row.videoApprovalStatus = "审核通过"
            const response = await authService.adminUpdateVideo(row)
            if (response.status == 200 && response.data == true) {
                const videoItem = this.videoData.find(item => item.videoId === row.videoId);
                videoItem.videoApprovalStatus = "审核通过";                                     //  成功更新后表格中的审核状态也实时更新
                this.$message.success({ message: '审核通过', showClose: true })
            } else {
                this.$message.error({ message: '出错啦~~~~~', showClose: true })
            }

            // if (videoItem) {
            //  判断是否为dialog里面的按钮来决定跳转到下一个视频
            // if (isDialog) {

            // const nextVideoResult = this.nextVideo(row);
            // if (!nextVideoResult) {                                             //  根据nextVideo函数的返回值判断是否继续执行
            //     this.$message.success({ message: '审核通过', showClose: true })
            //     return; // 终止approval函数中的后续代码
            // }
            // this.$message.success({ message: '审核通过、已跳至下一个视频', showClose: true })
            // } else {
            //     this.$message.success({ message: '审核通过', showClose: true })
            // }
            // } else {
            //     this.$message.warning({ message: '没有找到的视频数据', showClose: true })
            //     console.log("没有找到的视频数据");
            // }
        },
        //  禁播视频
        async ban(row, isDialog) {
            row.videoApprovalStatus = "禁播"
            const response = await authService.adminUpdateVideo(row)
            if (response.status == 200) {
                const videoItem = this.videoData.find(item => item.videoId === row.videoId);
                videoItem.videoApprovalStatus = "禁播"                                           //  成功更新后表格中的审核状态也实时更新
                this.$message.warning({ message: '禁播视频', showClose: true })
            } else {
                this.$message.error({ message: '出错啦~~~~~', showClose: true })
            }


            // this.nextVideo(row)
            // const videoItem = this.videoData.find(item => item.id === row.id);
            // if (videoItem) {
            //     videoItem.status = "禁播";

            //     //  判断是否为dialog里面的按钮来决定跳转到下一个视频
            //     if (isDialog) {
            //         const nextVideoResult = this.nextVideo(row);
            //         if (!nextVideoResult) {                                             //  根据nextVideo函数的返回值判断是否继续执行
            //             this.$message.warning({ message: '禁播视频', showClose: true })
            //             return; // 终止approval函数中的后续代码
            //         }
            //         this.$message.warning({ message: '禁播视频、已跳至下一个视频', showClose: true })
            //     } else {
            //         this.$message.warning({ message: '禁播视频', showClose: true })
            //     }
            // } else {
            //     this.$message.warning({ message: '没有找到的视频数据', showClose: true })
            //     console.log("没有找到的视频数据");
            // }
        },

        //  根据专辑id查看视频信息
        async view(row) {
            this.video.videoAlbumId = row.videoAlbumId
            // 过滤出 VAId 为 row.id 的数据并赋值给 subVideoData
            this.subVideoData = this.videoData.filter(item => item.videoAlbumId === row.videoAlbumId);

        },

        //  dialog中上一个视频
        async previousVideo(row) {
            const index = this.videoData.findIndex(item => item.videoId === row.videoId)
            if (index !== -1 && index > 0) {
                this.subVideoData = this.videoData[index - 1]
                this.url = await authService.videoURL(this.subVideoData.videoId)
                return true
            } else {
                this.$message.warning({ message: '已经是第一个视频啦', showClose: true })
                return false
            }
        },

        //  dialog中下一个视频
        async nextVideo(row) {
            const index = this.videoData.findIndex(item => item.videoId === row.videoId)
            if (index !== -1 && index + 1 < this.videoData.length) {
                this.subVideoData = this.videoData[index + 1]
                this.url = await authService.videoURL(this.subVideoData.videoId)
                return true
            } else {
                this.$message.warning({ message: '没有更多审核视频', showClose: true })
                return false;
            }
        },

        //  根据用户id获取专辑
        async getVideoAlbum() {
            // const userId = 41
            // this.videoAlbum.userId = 41
            try {
                // const response = await axios.post(`http://localhost:8080/api/videoAlbums`, this.videoAlbum);
                const response = await authService.getVideoAlbums(this.videoAlbum)
                // console.log(response.data)

                //  将数据映射到AlbumData中
                this.AlbumData = response.data.map(item => ({
                    videoAlbumId: item.videoAlbumId,
                    videoLastUpdate: item.videoLastUpdate,
                    videoReleaseDate: item.videoReleaseDate,
                    videoAlbumName: item.videoAlbumName,
                    videoDirector: item.videoDirector,
                    videoChannel: item.videoChannel,
                    videoArea: item.videoArea,
                    videoActor: item.videoActor,
                }))


            } catch (error) {
                console.error(error)
            }
        },

        //  获取待审核的视频
        async getVideo() {
            // const response = await axios.post('http://localhost:8080/api/videos', this.video)
            const response = await authService.adminFindVideos(this.video)
            console.log(response)
            if (response.status == 204) {
                this.$message.warning({ message: '没有更多数据', showClose: true })
                return
            }

            //  将数据映射到videoData中
            this.videoData = response.data.map(item => ({
                videoId: item.videoId,
                videoIsVip: item.videoIsVip.toString(),
                videoAlbumId: item.videoAlbumId,
                videoName: item.videoName,
                videoApprovalStatus: item.videoApprovalStatus,
                videoTitle: item.videoTitle,
                videoPath: item.videoPath,
                duration: item.duration,
                thumbnailPath: authService.backendAddress() + "/images/" + item.thumbnailPath
            }))
        }
    },
    mounted() {
        this.getVideoAlbum()
        this.getVideo()
    }
}
</script>
