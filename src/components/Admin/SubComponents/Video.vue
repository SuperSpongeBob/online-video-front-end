<template>
    <div>
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="视频" name="1">

                <el-collapse>
                    <el-collapse-item title="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp条件查询" name="1-1">
                        <el-form :inline="true" :model="this.videoCondition" class="demo-form-inline">
                            <el-form-item label="编号">
                                <el-input-number v-model="videoCondition.videoId" :min="1" placeholder="视频id" />
                            </el-form-item>
                            <el-form-item label="编号">
                                <el-input-number v-model="videoCondition.videoAlbumId" :min="1" placeholder="专辑id" />
                            </el-form-item>

                            <el-form-item label="类型">
                                <el-select v-model="videoCondition.videoIsVip" placeholder="VIP" clearable>
                                    <el-option label="免费" value="1" />
                                    <el-option label="会员" value="2" />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="审核状态">
                                <el-select v-model="videoCondition.videoApprovalStatus" placeholder="审核" clearable>
                                    <el-option label="审核通过" value="审核通过" />
                                    <el-option label="待审核" value="待审核" />
                                    <el-option label="禁播" value="禁播" />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="视频名称">
                                <el-input v-model="videoCondition.videoName" placeholder="名称（模糊查询）" clearable />
                            </el-form-item>
                            <el-form-item label="标题">
                                <el-input type="textarea" autosize resize="both" v-model="videoCondition.videoTitle"
                                    placeholder="标题（模糊查询）" maxlength="30" clearable />
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="queryVideos">筛选</el-button>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>

                <el-table :data="videoData" @scroll.capture="handleScroll($event, 'queryVideo')" border stripe
                    max-height="600">
                    <el-table-column prop="videoId" label="视频id" width="80" show-overflow-tooltip />
                    <el-table-column prop="videoAlbumId" label="专辑id" width="80" show-overflow-tooltip />
                    <el-table-column prop="videoIsVip" label="视频类型" width="90" show-overflow-tooltip>
                        <template #default="scope">
                            <span>{{ getRule(scope.row.videoIsVip) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="videoChannel" label="频道" width="60" show-overflow-tooltip />
                    <el-table-column prop="videoName" label="视频名称" width="200" show-overflow-tooltip />
                    <el-table-column prop="videoPath" label="视频路径" width="160" show-overflow-tooltip />
                    <el-table-column prop="videoTitle" label="视频标题" show-overflow-tooltip />
                    <el-table-column prop="videoApprovalStatus" label="视频状态" width="100" show-overflow-tooltip />
                    <el-table-column prop="viewCount" label="播放量" width="80" show-overflow-tooltip/>
                    <el-table-column prop="duration" label="视频时长" width="90" show-overflow-tooltip>
                        <template #default="{ row }">
                            {{ formatDuration(row.duration) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="thunbnailPath" label="缩略图" width="160" header-align="center">
                        <template v-slot="scope">
                            <el-upload :show-file-list="false" :before-upload="beforeUploadPost"
                                :on-change="(file) => handleThumbnailChange(file, scope.row)" :auto-upload="false"
                                accept="image/*">
                                <el-image :src="scope.row.thumbnailPath"></el-image>
                            </el-upload>
                        </template>
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" width="100" header-align="center">
                        <template #default="scope">
                            <div style="font-size: 18px;">
                                <VideoPlay @click="playVideo(scope.row, 'video')"
                                    style="width: 1em; height: 1em; margin-right: 8px" />
                                <Edit @click="editVideo(scope.row)"
                                    style="width: 1em; height: 1em; margin-right: 8px" />
                                <el-popconfirm title="Are you sure to delete this?" @confirm="deleteVideo(scope.row)">
                                    <template #reference>
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </template>
                                </el-popconfirm>
                                <el-button link type="primary" @click="getDanmakus(scope.row); getComments();dialogComment=true">评论＆弹幕</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>

            <el-dialog v-model="playVideoDialog" width="1000" align-center>
                <video id="myVideo" controls controlsList="nodownload" :src="url"
                    style="width: 100%; height: 60%;object-fit: contain;max-width: 90vw;max-height:80vh;">
                    您的浏览器不支持视频播放。
                </video>
                <div>审核状态：<span :style="getStatusColor(this.dialogVideoData.videoApprovalStatus)">{{
                    this.dialogVideoData.videoApprovalStatus
                        }}</span>
                </div>
                <div>视频id：{{ this.dialogVideoData.videoId }}</div>
                <div>视频名称：{{ this.dialogVideoData.videoName }} </div>
                <span>视频标题：{{ this.dialogVideoData.videoTitle }}</span>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="editVideo(dialogVideoData)">编辑</el-button>
                        <el-button type="primary" plain @click="previousVideo(dialogVideoData)">上一个</el-button>
                        <el-button type="primary" plain @click="nextVideo(dialogVideoData, 'video')">下一个</el-button>
                    </div>
                </template>
            </el-dialog>

            <el-dialog v-model="dialogComment" draggable width="800">
        <p>评论</p>
        <el-table :data="commentData" height="250" @scroll.capture="handleScroll($event, 'dialogComment')">
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

            <el-dialog v-model="conterDialogVisible" title="编辑视频信息" width="500" draggable overflow align-center>
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
                        <el-input v-model="dialogVideoData.videoTitle" maxlength="200" placeholder="标题" clearable />
                    </el-form-item>
                    <el-form-item label="视频类型">
                        <el-select v-model="dialogVideoData.videoIsVip" placeholder="视频类型" clearable>
                            <el-option label="免费" value="1" />
                            <el-option label="VIP" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select v-model="dialogVideoData.videoApprovalStatus" placeholder="审核状态" clearable>
                            <el-option label="审核通过" value="审核通过" />
                            <el-option label="待审核" value="待审核" />
                            <el-option label="禁播" value="禁播" />
                        </el-select>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="conterDialogVisible = false">Cancel</el-button>
                        <el-button type="primary" @click="updateVideo"> 修改 </el-button>
                    </div>
                </template>
            </el-dialog>

            <el-collapse-item title="专辑" name="2">

                <el-collapse>
                    <el-collapse-item title="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp条件查询" name="2-1">
                        <el-form :inline="true" :model="this.albumCondition" class="demo-form-inline">
                            <el-form-item label="编号">
                                <el-input-number v-model="albumCondition.videoAlbumId" placeholder="专辑id" :min="1" />
                            </el-form-item>
                            <el-form-item label="编号">
                                <el-input-number v-model="albumCondition.userId" placeholder="用户id" :min="1" />
                            </el-form-item>
                            <el-form-item label="专辑名称">
                                <el-input v-model="albumCondition.videoAlbumName" placeholder="名称（模糊查询）" clearable />
                            </el-form-item>
                            <el-form-item label="简介">
                                <el-input type="textarea" autosize resize="both"
                                    v-model="this.albumCondition.videoSummary" placeholder="标题（模糊查询）" maxlength="300"
                                    clearable />
                            </el-form-item>
                            <el-form-item label="频道">
                                <el-select v-model="albumCondition.videoChannel" placeholder="频道" clearable>
                                    <el-option label="动漫" value="动漫" />
                                    <el-option label="电影" value="电影" />
                                    <el-option label="电视剧" value="电视剧" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="导演">
                                <el-input v-model="this.albumCondition.videoDirector" placeholder="导演（模糊查询）"
                                    maxlength="30" clearable />
                            </el-form-item>
                            <el-form-item label="演员">
                                <el-input v-model="this.albumCondition.videoActor" placeholder="演员（模糊查询）" maxlength="30"
                                    clearable />
                            </el-form-item>
                            <el-form-item label="地区">
                                <el-input v-model="this.albumCondition.videoArea" placeholder="地区（模糊查询）" maxlength="30"
                                    clearable />
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="queryAlbums">筛选</el-button>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>

                </el-collapse>

                <el-table :data="this.albumData" @scroll.capture="handleScroll($event, 'queryAlbum')" border
                    max-height="550">
                    <el-table-column prop="videoAlbumId" label="专辑id" width="70" show-overflow-tooltip />
                    <el-table-column prop="userId" label="用户id" width="70" show-overflow-tooltip />
                    <el-table-column prop="videoAlbumName" label="专辑名称" show-overflow-tooltip />
                    <el-table-column prop="videoReleaseDate" label="上映日期" width="100" show-overflow-tooltip />
                    <el-table-column prop="videoSummary" label="专辑简介" show-overflow-tooltip />
                    <el-table-column prop="videoChannel" label="频道" width="60" show-overflow-tooltip />
                    <el-table-column prop="videoDirector" label="导演" width="80" show-overflow-tooltip />
                    <el-table-column prop="videoArea" label="地区" width="60" show-overflow-tooltip />
                    <el-table-column prop="videoFavoriteNumber" label="收藏量" width="70" show-overflow-tooltip />
                    <el-table-column prop="videoUpdateTime" label="更新时间" width="100" show-overflow-tooltip />
                    <el-table-column prop="videoLastUpdate" label="最新集数" width="60" show-overflow-tooltip />
                    <el-table-column prop="videoActor" label="演员" width="80" show-overflow-tooltip />
                    <el-table-column prop="videoPostPath" label="海报" width="100" header-align="center">
                        <template v-slot="scope">
                            <el-upload :show-file-list="false" :before-upload="beforeUploadPost"
                                :on-change="(file) => handlePostChange(file, scope.row)" :auto-upload="false"
                                accept="image/*">
                                <el-image style="max-width: 100px;max-height: 100px;"
                                    :src="scope.row.videoPostPath"></el-image>
                            </el-upload>

                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100" header-align="center">
                        <template #default="scope">
                            <div style="font-size: 18px;">

                                <el-popover placement="left" :width="900" trigger="click">
                                    <template #reference>
                                        <More @click="viewDetail(scope.row)"
                                            style="width:1em;height: 1em;margin-right: 8px" />
                                    </template>
                                    <el-table :data="popoverVideoData" max-height="240">
                                        <el-table-column fixed="left" width="50" property="videoId" label="id" />
                                        <el-table-column width="150" property="videoName" label="视频名称" />
                                        <el-table-column prop="duration" :formatter="formatDuration" label="视频时长"
                                            width="90" show-overflow-tooltip>
                                            <template #default="{ row }">
                                                {{ formatDuration(row.duration) }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="100" property="videoApprovalStatus" label="审核状态">
                                            <template #default="scope">
                                                <span :style="getStatusColor(scope.row.videoApprovalStatus)">{{
                                                    scope.row.videoApprovalStatus }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="250" property="videoTitle" label="标题" />
                                        <el-table-column fixed="right" label="Operations" width="200">
                                            <template #default="scope">

                                                <div style="font-size: 18px;">
                                                    <VideoPlay @click="playVideo(scope.row, 'album')"
                                                        style="width: 1em; height: 1em; margin-right: 8px" />
                                                    <Edit @click="editVideo(scope.row)"
                                                        style="width: 1em; height: 1em; margin-right: 8px" />
                                                    <el-popconfirm title="Are you sure to delete this?"
                                                        @confirm="deleteVideo(scope.row)">
                                                        <template #reference>
                                                            <el-icon>
                                                                <Delete />
                                                            </el-icon>
                                                        </template>
                                                    </el-popconfirm>
                                                </div>

                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-popover>

                                <Edit @click="editAlbum(scope.row)" style="width:1em;height: 1em;margin-right: 8px" />
                                <el-popconfirm title="Are you sure to delete this?" @confirm="deleteAlbum(scope.row)">
                                    <template #reference>
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>

            <el-dialog v-model="albumDialog" title="编辑专辑信息" width="500" draggable overflow align-center>
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
                        <el-button @click="albumDialog = false">Cancel</el-button>
                        <el-button type="primary" @click="updateAlbum"> 修改 </el-button>
                    </div>
                </template>
            </el-dialog>

        </el-collapse>
    </div>
</template>

<script>
import authService from '../../../utils/authService';

export default {
    data() {
        return {
            activeName: '1',            //  默认打开name:1的折叠面板
            video: {
                userId: "",
                videoAlbumId: "",
                videoAlbum: {
                    userId: "",
                }
            },
            videoCondition: {
                pageNum: 1, //  初始化页码
                pageSize: 30, //  设置加载每页大小
                isLoading: false, //  是否真正加载
            },
            albumCondition: {
                pageNum: 1, //  初始化页码
                pageSize: 10, //  设置加载每页大小
                isLoading: false, //  是否真正加载
            },
            url: '',                     //  视频播放地址
            videoData: [],
            dialogVideoData: {},
            albumData: [],
            dialogAlbumData: {},
            conterDialogVisible: false, //  false时隐藏
            playVideoDialog: false,      //  播放视频
            albumDialog: false,         //  编辑专辑对话框
            popoverVideoData: [],                       //  存放弹出框所需的视频数据
            backendAddress: authService.backendAddress(),
            newAlbumPost: null,         //  新的专辑海报
            newThumbnail: null,          //  新的视频缩略图

            dialogComment: false,                        //  视频的评论和弹幕对话框
            tempVideoId: null,                           //  暂时存放用于查询评论内容的videoId
            commentData: [],                           //  评论
            danmakuData: null,                           //  弹幕
            commentCondition:{
                pageNum: 1,                                  //  每次请求的页数
                pageSize: 6,                                 //  每次请求的大小
                isLoading: false,                            //  是否正在请求
            },
            
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

        //  视频播放
        async playVideo(row) {
            console.log(row)
            this.dialogVideoData = row
            this.playVideoDialog = true
            console.log(row.videoId)
            this.url = await authService.videoURL(row.videoId)

        },

        //  编辑视频
        editVideo(row) {
            // console.log(row)
            this.dialogVideoData = JSON.parse(JSON.stringify(row));      //  创建row的深拷贝，避免数据的双向绑定
            // console.log(this.dialogVideoData)
            this.conterDialogVisible = true
        },

        //  更新视频
        async updateVideo() {
            const response = await authService.adminUpdateVideo(this.dialogVideoData)
            if (response.status == 200) {
                let videoItem = this.videoData.find(item => item.videoId == (this.dialogVideoData.videoId))   //  根据用户id找到数据
                Object.assign(videoItem, this.dialogVideoData)                                            //  将数据替换
                this.$message.success({ message: '更新成功', showClose: true })
            } else {
                this.$message.error({ message: '出错啦~~~~', showClose: true })
            }
        },

        //  根据视频id删除视频
        async deleteVideo(row) {
            const response = await authService.deleteVideo(row)
            if (response.status == 200) {
                const index = this.videoData.findIndex(item => item.videoId == row.videoId)           //  查找出需要删除的数据索引
                this.videoData.splice(index, 1)                                                       //  根据索引删除数据
                this.$message.success({ message: '删除成功', showClose: true })
            } else {
                this.$message.error({ message: '出错啦~~~~', showClose: true })
            }
        },

        //  根据专辑id查看详情视频信息
        async viewDetail(row) {
            this.video.videoAlbumId = row.videoAlbumId
            // 根据videoAlbumId 过滤出 videoData中的数据并赋值给 popoverVideoData
            const videoCondition = { videoAlbumId: row.videoAlbumId }
            const response = await authService.adminFindVideos(videoCondition)
            this.popoverVideoData = response.data
            console.log(this.popoverVideoData)
        },

        //  对话框中获取上一个视频
        async previousVideo(row) {
            if (this.activeName == "1") {
                this.popoverVideoData = this.videoData
            }
            const index = this.popoverVideoData.findIndex(item => item.videoId === row.videoId)
            if (index !== -1 && index > 0) {
                this.dialogVideoData = this.popoverVideoData[index - 1]
                this.url = await authService.videoURL(this.dialogVideoData.videoId)

            } else {
                this.$message.warning({ message: '已经是第一个视频啦', showClose: true })
            }
        },

        //  对话框中获取下一个视频
        async nextVideo(row) {
            if (this.activeName == "1") {
                this.popoverVideoData = this.videoData
            }
            const index = this.popoverVideoData.findIndex(item => item.videoId === row.videoId)
            if (index !== -1 && index + 1 < this.popoverVideoData.length) {
                this.dialogVideoData = this.popoverVideoData[index + 1]
                this.url = await authService.videoURL(this.dialogVideoData.videoId)

            } else if (row.videoId == this.dialogVideoData.videoId) {
                // console.log(row)
                const result = await this.getVideos()
                //  判断是否有数据，避免栈内存溢出
                if (result.lenght != 0 || result!= undefined) {
                    this.nextVideo(row)
                    return
                }

            } else {
                this.$message.warning({ message: '没有更多审核视频', showClose: true })
            }
        },

        //  编辑专辑
        editAlbum(row) {
            this.dialogAlbumData = JSON.parse(JSON.stringify(row))
            this.albumDialog = true
        },

        async updateAlbum() {
            // 深拷贝 dialogAlbumData，避免直接修改原数据
            const album = JSON.parse(JSON.stringify(this.dialogAlbumData));
            album.videoPostPath = null
            const response = await authService.adminUpdateAlbum(album)
            if (response.status == 200) {
                let albumItem = this.albumData.find(item => item.videoAlbumId == (this.dialogAlbumData.videoAlbumId))   //  根据用户id找到数据
                Object.assign(albumItem, this.dialogAlbumData)                                            //  将数据替换
                console.log(this.albumData)
                this.$message.success({ message: '更新成功', showClose: true })
            } else {
                this.$message.error({ message: '出错啦~~~~', showClose: true })
            }
        },
        //  删除专辑
        async deleteAlbum(row) {
            //  先判断该专辑下是否还有视频
            this.video.videoAlbumId = row.videoAlbumId
            const existsVideo = await authService.existsVideo(this.video)
            console.log(existsVideo)
            //  true表明该专辑下有视频
            if (existsVideo.data == true) {
                this.$message.warning({ message: '请先删除该专辑下的所有视频', showClose: true })
            }
            if (existsVideo.data == false) {
                const videoAlbum = { videoAlbumId: row.videoAlbumId,userId:row.userId }
                const response = await authService.deleteAlbum(videoAlbum)  //  删除专辑
                if (response.status == 200) {
                    this.albumData = this.albumData.filter(item => item.videoAlbumId !== row.videoAlbumId)
                    this.$message.success({ message: '删除专辑成功', showClose: true })
                } else {
                    this.$message.error({ message: '异常', showClose: true })
                }
            }
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

        //  查询视频
        async queryVideos() {
            this.videoData = []
            // this.albumData = []
            this.videoCondition.pageNum = 1
            this.videoCondition.isLoading = false

            this.getVideos()
        },

        //  获取视频
        async getVideos() {
            try {
                if (this.videoCondition.isLoading) return
                this.videoCondition.isLoading = true
                const response = await authService.adminFindVideos(this.videoCondition)
                console.log(response)
                if (response.status == 204) {
                    this.$message.warning({ message: '没有更多数据啦', showClose: true })
                    return
                }
                //  映射视频数据
                if (response.data != null || response.data != '') {
                    const formattedNewVideoData = response.data.map(item => ({
                        videoId: item.videoId,
                        videoAlbumId: item.videoAlbumId,
                        videoIsVip: item.videoIsVip.toString(),
                        videoName: item.videoName,
                        videoPath: item.videoPath,
                        videoTitle: item.videoTitle,
                        duration: item.duration,
                        viewCount:item.viewCount,
                        videoApprovalStatus: item.videoApprovalStatus,
                        thumbnailPath: this.backendAddress + '/images/' + item.thumbnailPath,
                        videoChannel: item.videoChannel
                    }))
                    //  将新数据合并到现有数据中
                    this.videoData = [...this.videoData, ...formattedNewVideoData]
                    // console.log(this.videoData)
                    this.videoCondition.pageNum++
                    this.videoCondition.isLoading = false
                    return formattedNewVideoData
                } else {
                    this.$message.warning({ message: '没有更多信息', showClose: true })
                }
            } catch (error) {
                console.error(error)
            }
        },

        // 查询album时会清空所有数据
        async queryAlbums() {
            this.albumData = []
            this.albumCondition.pageNum = 1
            this.albumCondition.isLoading = false
            this.getAlbums()

        },

        //  不会清空数据而是合并数据
        async getAlbums() {
            if (this.albumCondition.isLoading) return
            this.albumCondition.isLoading = true
            const response = await authService.adminFindAlbum(this.albumCondition);

            if (response.status == 204) {
                this.$message.warning({ message: '没有更多数据啦', showClose: true })
                return
            }

            if (response.data != null || response.data != '') {
                // 创建一个 Set 来存储已处理的 videoAlbumId
                const seenAlbumIds = new Set();

                const formattedNewAlbumData = response.data.filter(item => {
                    const albumId = item.videoAlbumId;
                    if (!seenAlbumIds.has(albumId)) {
                        // 如果这个 albumId 还没有被处理过，添加到 Set 中
                        seenAlbumIds.add(albumId);
                        return true; // 保留这个数据项
                    }
                    return false; // 忽略这个数据项
                }).map(item => ({
                    videoAlbumId: item.videoAlbumId,
                    userId: item.userId,
                    videoAlbumName: item.videoAlbumName,
                    videoReleaseDate: item.videoReleaseDate,
                    videoSummary: item.videoSummary,
                    videoChannel: item.videoChannel,
                    videoDirector: item.videoDirector,
                    videoArea: item.videoArea,
                    videoFavoriteNumber: item.videoFavoriteNumber,
                    videoUpdateTime: item.videoUpdateTime,
                    videoLastUpdate: Number(item.videoLastUpdate),
                    videoActor: item.videoActor,
                    videoPostPath: this.backendAddress + "/images/" + item.videoPostPath,
                }));
                // 根据 videoAlbumId 进行排序
                // formattedNewAlbumData.sort((a, b) => a.videoAlbumId - b.videoAlbumId);
                this.albumData = [...this.albumData, ...formattedNewAlbumData];
            }
            this.albumCondition.pageNum++
            this.albumCondition.isLoading = false
        },

        //  获取评论信息
        async getComments() {
            if (this.commentCondition.isLoading) return
            this.commentCondition.isLoading = true
            const condition = { videoId: this.tempVideoId, pageNum: this.commentCondition.pageNum, pageSize: this.commentCondition.pageSize }
            const response = await authService.videoComment(condition)
            // console.log(response)
            if (response.status == 200) {
                const newCommentData = response.data.map(item => ({
                    videoCommentId: item.videoCommentId,
                    userName: item.userName,
                    videoCommentContent: item.videoCommentContent,
                    videoCommentTime: item.videoCommentTime
                }))
                this.commentData = [...this.commentData, ...newCommentData]
            }
            this.commentCondition.isLoading = false
            this.commentCondition.pageNum++
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
            // console.log(response)
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
        handleScroll(event, where) {
            const { scrollTop, scrollHeight, clientHeight } = event.target;
            if (scrollTop + clientHeight >= scrollHeight - 5) { // Adjust the threshold as needed
                console.log('Scrolled to bottom');
                if (where == 'queryVideo') {
                    this.getVideos()
                } else if (where == 'queryAlbum') {
                    this.getAlbums()
                }else if(where == 'dialogComment'){
                    this.getComments();                         // 加载更多评论
                }
            }
        },

        // 格式化时长
        formatDuration(seconds) {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return `${h ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        },

    },
    mounted() {
        this.queryVideos()
        this.getAlbums()
    }
}
</script>



<style>
.demo-form-inline .el-input {
    --el-input-width: 200px;
}

.demo-form-inline .el-select {
    --el-select-width: 100px;
}
</style>