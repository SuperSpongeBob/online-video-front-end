<template>
    <el-divider content-position="center">历史专辑</el-divider>

    <el-card>
        <el-table :data="albumData" style="width: 99%" max-height="330" border stripe>
            <el-table-column fixed="left" prop="videoAlbumId" label="专辑id" width="70" />
            <el-table-column prop="videoAlbumName" label="专辑名" width="120" header-align="center" />
            <el-table-column prop="videoReleaseDate" label="上映日期" width="100" show-overflow-tooltip />
            <el-table-column prop="videoSummary" label="专辑简介" show-overflow-tooltip />
            <el-table-column prop="videoDirector" label="导演" width="100" />
            <el-table-column prop="videoChannel" label="频道" width="60" />
            <el-table-column prop="videoArea" label="地区" width="60" />
            <el-table-column prop="videoActor" label="演员" width="120" />
            <el-table-column prop="videoLastUpdate" label="最新集数" width="90" />
            <el-table-column prop="videoFavoriteNumber" label="收藏量" width="70" show-overflow-tooltip />
            <el-table-column prop="videoUpdateTime" label="更新时间" width="90" show-overflow-tooltip />
            <el-table-column prop="videoPostPath" label="海报" width="120" header-align="center">
                <template v-slot="scope">
                    <el-upload :show-file-list="false" :before-upload="beforeUploadPost"
                        :on-change="(file) => handlePostChange(file, scope.row)" :auto-upload="false" accept="image/*">
                        <el-image style="max-width: 100px;max-height: 100px; object-fit: contain;"
                            :src="scope.row.videoPostPath"></el-image>
                    </el-upload>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150" header-align="center">

                <template #default="scope">
                    <el-button link type="primary" @click="editAlbum(scope.row)">编辑</el-button>
                    <el-popover placement="bottom-start" :width="900" trigger="click">
                        <template #reference>

                            <el-button link type="primary" @click="viewDetail(scope.row)">详情</el-button>
                        </template>
                        <el-table :data="popoverVideoData" max-height="240" border stripe>
                            <el-table-column fixed="left" width="50" property="videoId" label="id" />
                            <el-table-column width="150" property="videoName" label="视频名称" />
                            <el-table-column width="250" property="videoTitle" label="标题" />
                            <el-table-column width="100" property="duration" label="视频时长">
                                <template #default="{ row }">
                                    {{ formatDuration(row.duration) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="videoIsVip" label="视频类型" width="90" show-overflow-tooltip>
                                <template #default="{ row }">
                                    <span>{{ getRule(row.videoIsVip) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="100" property="videoApprovalStatus" label="审核状态">
                                <template #default="scope">
                                    <span :style="getStatusColor(scope.row.videoApprovalStatus)">{{
                                        scope.row.videoApprovalStatus }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="Operations" width="200">
                                <template #default="scope">
                                    <el-button link type="primary" @click="playVideo(scope.row)">播放视频</el-button>
                                    <el-popconfirm title="Are you sure to delete this?"
                                        @confirm="deleteVideo(scope.row)">
                                        <template #reference>
                                            <el-button link type="danger">下架视频</el-button>
                                        </template>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>

                    </el-popover>

                    <el-popconfirm title="Are you sure to delete this?" @confirm="deleteAlbum(scope.row)">
                        <template #reference>
                            <el-button link type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>

            </el-table-column>
        </el-table>
    </el-card>

    <el-dialog v-model="editAlbumDialog" title="编辑专辑信息" width="500" draggable overflow align-center>
        <el-form ref="dialogAlbumData" :model="dialogAlbumData" label-width="100px">
            <el-form-item label="专辑id">
                <span>{{ dialogAlbumData.videoAlbumId }}</span>
            </el-form-item>
            <el-form-item label="用户id">
                <span>{{ dialogAlbumData.userId }}</span>
            </el-form-item>
            <el-form-item label="专辑名称">
                <el-input v-model="dialogAlbumData.videoAlbumName" placeholder="名称" clearable />
            </el-form-item>
            <el-form-item label="最新集数">
                <el-input-number v-model.number="dialogAlbumData.videoLastUpdate" placeholder="最新集数" clearable
                    :min="0" />
            </el-form-item>
            <el-form-item label="更新时间">
                <el-input v-model="dialogAlbumData.videoUpdateTime" placeholder="更新时间" clearable />
            </el-form-item>
            <el-form-item label="简介">
                <el-input v-model="dialogAlbumData.videoSummary" maxlength="300" placeholder="简介" clearable />
            </el-form-item>
            <el-form-item label="频道">
                <el-input v-model="dialogAlbumData.videoChannel" maxlength="10" placeholder="频道" clearable />
            </el-form-item>
            <el-form-item label="导演">
                <el-input v-model="dialogAlbumData.videoDirector" maxlength="10" placeholder="导演" clearable />
            </el-form-item>
            <el-form-item label="地区">
                <el-input v-model="dialogAlbumData.videoArea" maxlength="10" placeholder="地区" clearable />
            </el-form-item>
            <el-form-item label="演员">
                <el-input v-model="dialogAlbumData.videoActor" maxlength="300" placeholder="演员" clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="editAlbumDialog = false">Cancel</el-button>
                <el-button type="primary" @click="updateAlbum"> 修改 </el-button>
            </div>
        </template>
    </el-dialog>

    <el-divider content-position="center">历史视频</el-divider>

    <el-card>
        <el-table :data="videoData" style="width: 99%;" max-height="330" border stripe>
            <el-table-column fixed="left" width="50" property="videoId" label="id" header-align="center" />
            <el-table-column width="180" property="videoName" label="视频名称" header-align="center" />
            <el-table-column property="videoTitle" label="标题" header-align="center" />
            <el-table-column width="80" property="viewCount" label="播放量" />
            <el-table-column width="100" property="duration" label="视频时长">
                <template #default="{ row }">
                    {{ formatDuration(row.duration) }}
                </template>
            </el-table-column>
            <el-table-column prop="videoIsVip" label="视频类型" width="90" show-overflow-tooltip>
                <template #default="{ row }">
                    <span>{{ getRule(row.videoIsVip) }}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" property="videoApprovalStatus" label="审核状态">
                <template #default="scope">
                    <span :style="getStatusColor(scope.row.videoApprovalStatus)">{{ scope.row.videoApprovalStatus
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column property="thumbnailPath" label="缩略图" width="120" header-align="center">
                <template v-slot="scope">
                    <el-upload :show-file-list="false" :before-upload="beforeUploadPost"
                        :on-change="(file) => handleThumbnailChange(file, scope.row)" :auto-upload="false"
                        accept="image/*">
                        <el-image style="max-width: 100px;max-height: 100px;" :src="scope.row.thumbnailPath"></el-image>
                    </el-upload>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Operations" width="200" header-align="center">
                <template #default="scope">
                    <el-button link type="primary" @click="editVideo(scope.row)">编辑</el-button>
                    <el-button link type="primary" @click="playVideo(scope.row)">播放</el-button>
                    <el-popconfirm title="Are you sure to delete this?" @confirm="deleteVideo(scope.row)">
                        <template #reference>
                            <el-button link type="danger">下架</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button link type="primary"
                        @click="getDanmakus(scope.row); getComments(); dialogComment = true; pageNum = 1">评论</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <el-dialog v-model="centerDialogVisible" width="1000" align-center>
        <video id="myVideo" controls controlsList="nodownload" :src="url"
            style="width: 100%; height: 60%;object-fit: contain;max-width: 90vw;max-height: 80vh;;">
            您的浏览器不支持视频播放。
        </video>
        <div>审核状态：<span :style="getStatusColor(this.dialogVideoData.videoApprovalStatus)">{{
            this.dialogVideoData.videoApprovalStatus }}</span>
        </div>
        <div>视频id：{{ this.dialogVideoData.videoId }}</div>
        <div>视频名称：{{ this.dialogVideoData.videoName }} </div>
        <span>视频标题：{{ this.dialogVideoData.videoTitle }}</span>
        <template #footer>
            <div class="dialog-footer">
                <el-tooltip content="申诉重新审核" placement="bottom">
                    <el-button type="warning" plain :disabled="this.dialogVideoData.videoApprovalStatus != '禁播'"
                        @click="reiterate(dialogVideoData)">重申</el-button>
                </el-tooltip>
                <el-button type="primary" plain @click="previousVideo(dialogVideoData)">上一个</el-button>
                <el-button type="primary" plain @click="nextVideo(dialogVideoData)">下一个</el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog v-model="editVideoDialog" title="编辑视频信息" width="500" draggable overflow align-center>
        <el-form ref="dialogVideoData" :model="dialogVideoData" label-width="100px">
            <el-form-item label="视频id">
                <span>{{ dialogVideoData.videoId }}</span>
            </el-form-item>
            <el-form-item label="专辑id">
                <span>{{ dialogVideoData.videoAlbumId }}</span>
            </el-form-item>

            <el-form-item label="视频名称">
                <el-input v-model="dialogVideoData.videoName" placeholder="名称" clearable />
            </el-form-item>
            <el-form-item label="视频标题">
                <el-input v-model="dialogVideoData.videoTitle" maxlength="100" placeholder="标题" clearable />
            </el-form-item>
            <el-form-item label="视频类型">
                <el-select v-model="dialogVideoData.videoIsVip" placeholder="视频类型" clearable>
                    <el-option label="免费" value="1" />
                    <el-option label="VIP" value="2" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="editVideoDialog = false">Cancel</el-button>
                <el-button type="primary" @click="updateVideo"> 修改 </el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogComment" draggable width="800">
        <p>评论</p>
        <el-table :data="commentData" height="250" @scroll.capture="handleScroll">
            <el-table-column property="videoCommentId" label="评论Id" width="120" />
            <el-table-column property="userName" label="用户名" width="150" />
            <el-table-column property="videoCommentContent" label="评论内容" />
            <el-table-column property="videoCommentTime" label="评论时间" width="200" />
            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click.prevent="deleteComment(scope)">
                        Remove
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <p>弹幕</p>
        <el-table :data="danmakuData" height="250">
            <el-table-column property="danmakuId" label="弹幕Id" width="150" />
            <el-table-column property="text" label="弹幕内容" width="200" />
            <el-table-column property="time" label="出现时间" />
            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click.prevent="deleteDanmaku(scope)">
                        Remove
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
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
            },
            videoAlbum: {
                userId: ""
            },

            videoData: [],                              //  获取所有的视频数据
            popoverVideoData: [],                       //  存放弹出框所需的视频数据
            albumData: [],                              //  专辑数据
            centerDialogVisible: ref(false),             //  对话框是否显示
            editAlbumDialog: false,                     //  编辑专辑对话框
            dialogAlbumData: {},
            editVideoDialog: ref(false),                 //  编辑视频数据对话框
            dialogComment: false,                        //  视频的评论和弹幕对话框
            url: '',                                     //  对话框中的视频url
            dialogVideoData: [],                         //  存放对话框所需的视频数据
            tempVideoId: null,                           //  暂时存放用于查询评论内容的videoId
            commentData: [],                           //  评论
            danmakuData: null,                           //  弹幕
            pageNum: 1,                                  //  每次请求的页数
            pageSize: 10,                                 //  每次请求的大小
            isLoading: false,                            //  是否正在请求
        }
    },
    methods: {
        //  根据不同状态显示不同颜色字体
        getStatusColor(videoApprovalStatus) {
            switch (videoApprovalStatus) {
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

        //  重新申述视频，只针对禁播的视频
        async reiterate(row) {
            //  这里更改videoApprovalStatus为“待审核”即可
            const response = await authService.reiterateVideo(row)
            // console.log(response)
            if (response.status == 200 && response.data == true) {
                this.$message.warning({ message: '已重申视频：' + row.videoId, showClose: true })
                return
            }
            this.$message.error({ message: '出错啦！！！' + row.videoId, showClose: true })
        },

        //  对话框中获取上一个视频
        async previousVideo(row) {
            const index = this.videoData.findIndex(item => item.videoId === row.videoId)
            if (index !== -1 && index > 0) {
                this.dialogVideoData = this.videoData[index - 1]
                // const response = await axios.get(`http://localhost:8080/api/video/${this.dialogVideoData.id}`);
                // this.url = response.data
                this.url = await authService.videoURL(this.dialogVideoData.videoId)
            } else {
                this.$message.warning({ message: '已经是第一个视频啦', showClose: true })
            }
        },

        //  对话框中获取下一个视频
        async nextVideo(row) {
            console.log(row.videoId)
            const index = this.videoData.findIndex(item => item.videoId === row.videoId)
            if (index !== -1 && index + 1 < this.videoData.length) {
                this.dialogVideoData = this.videoData[index + 1]
                // const response = await axios.get(`http://localhost:8080/api/video/${this.dialogVideoData.id}`);
                // this.url = response.data
                this.url = await authService.videoURL(this.dialogVideoData.videoId)
            } else {
                this.$message.warning({ message: '没有更多审核视频', showClose: true })
            }
        },

        //  播放视频
        async playVideo(row) {
            console.log(row.videoId)
            this.dialogVideoData = row
            this.centerDialogVisible = true
            this.url = await authService.videoURL(row.videoId)
        },

        //  编辑专辑
        editAlbum(row) {
            this.dialogAlbumData = JSON.parse(JSON.stringify(row))
            // console.log(row)
            this.editAlbumDialog = true
        },

        //  更新专辑
        async updateAlbum() {
            // 深拷贝 dialogAlbumData，避免直接修改原数据
            const album = JSON.parse(JSON.stringify(this.dialogAlbumData));
            album.videoPostPath = null
            // console.log(album)
            const response = await authService.updateAlbum(album)
            if (response.status == 200) {
                let albumItem = this.albumData.find(item => item.videoAlbumId == (this.dialogAlbumData.videoAlbumId))   //  根据用户id找到数据
                Object.assign(albumItem, this.dialogAlbumData)                                            //  将数据替换
                // console.log(this.albumData)
                this.$message.success({ message: '更新成功', showClose: true })
            } else {
                this.$message.error({ message: '出错啦~~~~', showClose: true })
            }
        },

        //  删除专辑
        async deleteAlbum(row) {
            // const hasData = this.videoData.some(item => item.videoAlbumId === row.id)
            //  先判断该专辑下是否还有视频
            const video = { videoAlbumId: row.videoAlbumId }
            const existsVideo = await authService.existsVideo(video)
            if (existsVideo.data == true) {      //  判断该专辑下是否还有视频
                this.$message.warning({ message: '请先删除该专辑下的所有视频' + row.videoAlbumId, showClose: true })
            } else {
                const album = {
                    videoAlbumId: row.videoAlbumId,
                    userId: row.userId
                }
                const response = await authService.deleteAlbum(album)
                if (response.status == 200) {
                    this.albumData = this.albumData.filter(item => item.videoAlbumId !== row.videoAlbumId)
                    this.$message.warning({ message: '删除专辑' + row.videoAlbumId, showClose: true })
                } else {
                    this.$message.error({ message: 'error!!!删除异常' })
                }

            }
        },

        //  删除视频
        async deleteVideo(row) {
            //  根据id过滤掉数据、根据id删除数据
            const response = await authService.deleteVideo(row)
            if (response.status == 200) {
                this.videoData = this.videoData.filter(item => item.videoId !== row.videoId)
                this.popoverVideoData = this.popoverVideoData.filter(item => item.videoId !== row.videoId)
                this.$message.warning({ message: '下架视频：' + row.videoId, showClose: true })
            } else {
                this.$message.error({ message: 'error!!!删除视频失败' })
            }

        },

        //  编辑视频
        editVideo(row) {
            console.log(row)
            this.dialogVideoData = JSON.parse(JSON.stringify(row));      //  创建row的深拷贝，避免数据的双向绑定
            // console.log(this.dialogVideoData)
            this.editVideoDialog = true
        },

        //  更新视频
        async updateVideo() {
            const response = await authService.updateVideo(this.dialogVideoData)
            if (response.status == 200) {
                let videoItem = this.videoData.find(item => item.videoId == (this.dialogVideoData.videoId))   //  根据用户id找到数据
                Object.assign(videoItem, this.dialogVideoData)                                            //  将数据替换
                this.$message.success({ message: '更新成功', showClose: true })
            } else {
                this.$message.error({ message: '出错啦~~~~', showClose: true })
            }
        },

        //  根据专辑id查看详情视频信息
        async viewDetail(row) {
            this.video.videoAlbumId = row.videoAlbumId
            // 过滤出 videoAlbumId 为 row.videoAlbumId 的数据并赋值给 popoverVideoData
            this.popoverVideoData = this.videoData.filter(item => item.videoAlbumId === row.videoAlbumId);
            console.log(row)
            console.log(this.popoverVideoData)
        },

        //  图片文件上传前校验
        beforeUploadPost(file) {
            // 可以在这里进行文件验证，例如检查文件类型和大小
            const isJPG = file.raw.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png";
            const isLt50M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传图片只能是 JPG 或 PNG 格式!");
            }
            if (!isLt50M) {
                this.$message.error("上传图片大小不能超过 2MB!");
            }
            return isJPG && isLt50M
        },

        //  选择海报更新
        async handlePostChange(file, row) {
            const isValid = this.beforeUploadPost(file);
            if (!isValid) {
                return; // 如果验证不通过，直接返回，不进行上传
            }
            this.newAlbumPost = file.raw
            const videoAlbum = { videoAlbumId: row.videoAlbumId }
            const formData = new FormData()
            formData.append("imageFile", this.newAlbumPost); //  图片流
            formData.append("videoAlbum", JSON.stringify(videoAlbum))
            const response = await authService.uploadVideo(formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            )
            // 处理成功响应
            if (response.data == true) {
                row.videoPostPath = URL.createObjectURL(file.raw)
                this.$message.success({ message: '海报更新成功', showClose: true })
                console.log("更新成功", response);
            }
        },

        //  选择缩略图更新
        async handleThumbnailChange(file, row) {
            const isValid = this.beforeUploadPost(file);
            if (!isValid) {
                return; // 如果验证不通过，直接返回，不进行上传
            }
            this.newThumbnail = file.raw
            const video = { videoId: row.videoId }
            const formData = new FormData()
            formData.append("thumbnailFile", this.newThumbnail); //  图片流
            formData.append("video", JSON.stringify(video))
            const response = await authService.uploadVideo(formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            )
            // 处理成功响应
            if (response.data == true) {
                row.thumbnailPath = URL.createObjectURL(file.raw)
                this.$message.success({ message: '海报更新成功', showClose: true })
                console.log("更新成功", response);
            }
        },

        //  根据用户id获取专辑
        async getVideoAlbum() {
            this.videoAlbum.userId = JSON.parse(localStorage.getItem('userInfo')).userId
            try {
                const response = await authService.getVideoAlbums(this.videoAlbum)
                console.log(response.data)

                //  将数据映射到albumData中
                this.albumData = response.data.map(item => ({
                    videoAlbumId: item.videoAlbumId,
                    userId: item.userId,
                    videoLastUpdate: Number(item.videoLastUpdate),
                    videoReleaseDate: item.videoReleaseDate,
                    videoUpdateTime: item.videoUpdateTime,
                    videoAlbumName: item.videoAlbumName,
                    videoSummary: item.videoSummary,
                    videoFavoriteNumber: item.videoFavoriteNumber,
                    videoDirector: item.videoDirector,
                    videoChannel: item.videoChannel,
                    videoArea: item.videoArea,
                    videoActor: item.videoActor,
                    videoPostPath: authService.backendAddress() + "/images/" + item.videoPostPath
                }))


            } catch (error) {
                console.error(error)
            }
        },

        //  根据用户id获取视频信息
        async getVideo() {
            //  从当前会话中获取用户Id
            const userId = JSON.parse(localStorage.getItem('userInfo')).userId
            const response = await authService.videosByUserId(userId)
            console.log(response)
            if (response.status == 204) {
                this.$message.warning({ message: '未查询到数据' })
                return
            }

            //  将数据映射到videoData中
            this.videoData = response.data.map(item => ({
                videoId: item.videoId,
                videoAlbumId: item.videoAlbumId,
                videoIsVip: item.videoIsVip.toString(),
                videoName: item.videoName,
                videoApprovalStatus: item.videoApprovalStatus,
                videoTitle: item.videoTitle,
                videoPath: item.videoPath,
                duration: item.duration,
                viewCount: item.viewCount,
                thumbnailPath: authService.backendAddress() + "/images/" + item.thumbnailPath
            }))
            // console.log(this.videoData)
        },

        //  获取评论信息
        async getComments() {
            if (this.isLoading) return
            this.isLoading = true
            const condition = { videoId: this.tempVideoId, pageNum: this.pageNum, pageSize: this.pageSize }
            const response = await authService.videoComment(condition)
            console.log(response)
            if (response.status == 200) {
                const newCommentData = response.data.map(item => ({
                    videoCommentId: item.videoCommentId,
                    userName: item.userName,
                    videoCommentContent: item.videoCommentContent,
                    videoCommentTime: item.videoCommentTime
                }))
                this.commentData = [...this.commentData, ...newCommentData]

            }
            this.isLoading = false
            this.pageNum++
        },
        //  删除评论
        async deleteComment(scope) {
            const response = await authService.deleteComment({ videoCommentId: scope.row.videoCommentId })
            if (response.data == true && response.status == 200) {
                this.$message.warning({ message: `删除评论成功：${scope.row.videoCommentId}`, showClose: true })
                //  删除表格中的数据
                this.commentData.splice(scope.$index, 1)
            }
        },

        //  获取弹幕信息
        async getDanmakus(row) {
            //  将videoId暂时存下来     ，因为genDanmakus只查询一次，getComment查询多次
            this.tempVideoId = row.videoId
            const condition = { videoId: row.videoId }
            const response = await authService.getDanmakus(condition)
            console.log(response)
            if (response.status == 200) {
                this.danmakuData = response.data.map(item => ({
                    danmakuId: item.danmakuId,
                    text: item.text,
                    time: item.time
                }))
            }
        },
        //  删除弹幕
        async deleteDanmaku(scope) {
            const response = await authService.deleteDanmaku({ danmakuId: scope.row.danmakuId })
            if (response.data == true && response.status == 200) {
                this.$message.warning({ message: `删除弹幕成功：${scope.row.danmakuId}`, showClose: true })
                //  删除表格中的数据
                this.danmakuData.splice(scope.$index, 1)
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
                this.getComments();                         // 加载更多评论
            }
        },
    },
    mounted() {
        this.getVideoAlbum()
        this.getVideo()
    }
}
</script>







<!-- <template>
    <el-card>
        <h3>历史专辑</h3>
        <el-table :data="tableData" style="width: 100%" max-height="250">
            <el-table-column fixed="left" prop="videoAlbumName" label="Name" width="180" />
            <el-table-column prop="id" label="id" width="120" />
            <el-table-column prop="videoLastUpdate" label="最新集数" width="120" />
            <el-table-column prop="videoDirector" label="Director" width="120" />
            <el-table-column prop="videoChannel" label="Channel" width="120" />
            <el-table-column prop="videoArea" label="Area" width="120" />
            <el-table-column prop="videoActor" label="Actor" width="180" />
            <el-table-column fixed="right" label="Operations" width="180">
                <template #default="scope">
                    <el-button link type="primary" @click="editItem(scope.row)">Select</el-button>
                    <el-button link type="primary" @click="deleteItem(scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';


export default {
    data() {
        return {
            tempVAData: ref([]),
            tableData: ref([]),
            videoAlbum: {
                userId: ""
            }
        }
    },
    methods: {
        editItem(row){
            console.log(row.id)
        },
        async getVideoAlbum() {
            // const userId = 41
            this.videoAlbum.userId = 41
            try {
                const response = await axios.post(`http://localhost:8080/api/videoAlbums`, this.videoAlbum);
                console.log(response.data)
                //   responseData.value=response.data
                this.tempVAData = response.data
                this.tableData = response.data.map(item => ({
                    id: item.videoAlbumId,
                    videoLastUpdate: item.videoLastUpdate,
                    videoReleaseDate: item.videoReleaseDate,
                    videoAlbumName: item.videoAlbumName,
                    videoDirector: item.videoDirector,
                    videoChannel: item.videoChannel,
                    videoArea: item.videoArea,
                    videoActor: item.videoActor,
                    id: item.videoAlbumId
                }));
                console.log(this.tableData)
            } catch (error) {
                console.error(error)
            }
        }
    },
    mounted() {
        this.getVideoAlbum()
    }
}
</script> -->