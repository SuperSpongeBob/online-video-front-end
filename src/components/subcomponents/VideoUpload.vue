<template>
    <el-form :model="video" label-width="120px">
        <el-row>
            <div style="width: 50%;">
                <el-divider content-position="center">专辑信息</el-divider>
                <el-form-item label="专辑名">
                    <el-input v-model="videoAlbum.videoAlbumName" clearable></el-input>
                </el-form-item>
                <el-form-item label="上映日期">
                    <el-date-picker v-model="videoAlbum.videoReleaseDate" type="date"
                        placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="视频简介">
                    <el-input type="textarea" v-model="videoAlbum.videoSummary" clearable></el-input>
                </el-form-item>
                <el-form-item label="视频频道">
                    <el-select v-model="videoAlbum.videoChannel" placeholder="请选择">
                        <el-option label="电影" value="电影"></el-option>
                        <el-option label="电视剧" value="电视剧"></el-option>
                        <el-option label="动漫" value="动漫"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="导演">
                    <el-input v-model="videoAlbum.videoDirector" clearable></el-input>
                </el-form-item>
                <el-form-item label="地区">
                    <el-input v-model="videoAlbum.videoArea" clearable></el-input>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-input v-model="videoAlbum.videoUpdateTime" clearable></el-input>
                </el-form-item>
                <el-form-item label="最新更新集数">
                    <el-input v-model="videoAlbum.videoLastUpdate" clearable></el-input>
                </el-form-item>
                <el-form-item label="演员">
                    <el-input v-model="videoAlbum.videoActor" placeholder="演员1、演员2" clearable></el-input>
                </el-form-item>

                <el-divider content-position="center">视频信息</el-divider>

                <el-form-item label="视频名称">
                    <el-input v-model="video.videoName" placeholder="视频名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="视频标题">
                    <el-input v-model="video.videoTitle" placeholder="视频标题" clearable></el-input>
                </el-form-item>
                <el-form-item label="视频类型">
                    <el-select v-model="video.videoType" placeholder="请选择">
                        <el-option label="免费" value="免费"></el-option>
                        <el-option label="收费" value="收费"></el-option>
                        <el-option label="VIP" value="VIP"></el-option>
                        <el-option label="无版权" value="无版权"></el-option>
                        <el-option label="独播" value="独播"></el-option>
                    </el-select>
                </el-form-item>

                <el-divider content-position="center">上传视频</el-divider>

                <el-row style="margin-left: 120px;height: 75px;">
                    <el-upload ref="imageUpload" :auto-upload="false" :on-change="handleImageFileChange"
                        :before-upload="beforeImageUpload" :on-preview="handlePreview" :on-remove="handleRemove"
                        :before-remove="beforeRemoveImg" multiple :limit="1" accept="image/*">
                        <el-button slot="trigger" type="primary">选择海报</el-button>
                        <p slot="tip" class="el-upload__tip">
                            只能上传jpg, png格式的图片文件，且不超过5MB
                        </p>
                    </el-upload>
                    <el-divider direction="vertical" border-style="none" />
                    <el-upload ref="upload" :auto-upload="false" :on-change="handleFileChange"
                        :before-upload="beforeUpload" :on-preview="handlePreview" :on-remove="handleRemove"
                        :before-remove="beforeRemove" multiple :limit="1" accept="video/*">
                        <el-button slot="trigger" type="primary">选择视频</el-button>
                        <p slot="tip" class="el-upload__tip">
                            只能上传mp4, avi格式的视频文件，且不超过50MB
                        </p>
                    </el-upload>
                </el-row>

                <el-form-item style="display: flex; justify-content: center;">
                    <el-button type="success" @click="submitUpload">上传视频</el-button>
                    <el-button style="margin-left: 10px" plain @click="abortUpload">取消上传</el-button>
                </el-form-item>

                <el-progress :percentage="uploadPercentage" v-if="uploadPercentage > 0"></el-progress>
            </div>

            <div style="width: 1%;"><el-divider direction="vertical" border-style="dashed" /></div>

            <div style="width: 49%;">

                <el-divider content-position="center">历史专辑</el-divider>

                <el-table :data="tableData" style="width: 100%" max-height="250">
                    <el-table-column fixed="left" prop="name" label="Name" width="150" />
                    <el-table-column prop="director" label="Director" width="100" />
                    <el-table-column prop="channel" label="Channel" width="100" />
                    <el-table-column prop="area" label="Area" width="100" />
                    <el-table-column prop="actor" label="Actor" width="180" />
                    <el-table-column fixed="right" label="Operations" width="100">
                        <template #default="scope">
                            <el-button link type="primary" @click="editItem(scope.row)">Select</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-divider content-position="center">展示页面</el-divider>
                <!-- 替换为如下内容 -->
                <div class="video-grid" style="margin-bottom: 16px;">
                    <div class="video-card" style="width: 280px;">
                        <!-- VIP/免费标签 -->
                        <div :class="['video-badge', getVideoTypeClass(video.videoType)]">
                            {{ getVideoTypeText(video.videoType) }}
                        </div>
                        <!-- 视频缩略图 -->
                        <div class="video-thumbnail">
                            <img :src="thumbnailUrl" @load="handleImage" alt="视频缩略图" />
                        </div>
                        <!-- 视频信息 -->
                        <div class="video-info">
                            <div class="video-title">{{ video.videoName }}</div>
                            <div class="video-description">{{ video.videoTitle }}</div>
                            <div class="video-tags">
                                <span class="video-tag">{{ videoAlbum.videoChannel || '未知分类' }}</span>
                                <span class="video-tag">{{ getVideoTypeTag(video.videoType) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <el-upload ref="imageUpload" :auto-upload="false" :on-change="ChangeVideoThumbnail" multiple :limit="1"
                    accept="image/*">
                    <el-button slot="trigger" type="primary">选择视频封面</el-button>
                </el-upload>
                <el-button v-if="videoUrl" @click="this.dialogVideo = true" type="primary">从视频中截取封面</el-button>
                <!-- 视频预览 & 缩略图选择 -->
                <el-dialog v-model="dialogVideo">
                    <video ref="videoPlayer" :src="videoUrl" controls @loadedmetadata="onVideoLoaded"
                        style="max-width: 100%;max-height: 20%;"></video>

                    <div class="thumbnailUrl-controls">
                        <el-button @click="captureThumbnail" type="primary">截取当前帧作为缩略图</el-button>
                    </div>

                </el-dialog>
            </div>

        </el-row>
    </el-form>


    <el-dialog v-model="centerDialogVisible" title="Success" width="500" align-center>
        <span>视频上传成功</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="blackIndex">返回首页</el-button>
                <el-button type="primary" @click="centerDialogVisible = false">确定</el-button>
            </div>
        </template>
    </el-dialog>


</template>

<script>
import axios from "axios";
import { ElUpload, ElProgress, ElMessage } from "element-plus";
import { ref } from "vue";
import authService from "../../utils/authService";
import { getVideoTypeText, getVideoTypeClass, getVideoTypeTag } from '../../utils/videoTypeUtils';
import '../../assets/videoCard.css'

export default {
    components: {
        ElUpload,
        ElProgress,
    },
    data() {
        return {
            loading: false,
            video: {
                videoId: "",                    //  暂时没有他的用武之地
                videoType: "免费",                 //  默认视频为免费
                videoName: "",                  //  视频名称
                videoTitle: "",                 //  视频标题
                thumbnailPath: "",               //  暂时用于存储
                videoApprovalStatus: "待审核",  //   审核状态
            },
            tempVAData: ref([]),                //  暂时存放专辑
            tableData: ref([]),                 //  专辑表格数据
            videoAlbum: {
                videoAlbumName: "",             //   专辑名
                userId: "",                      //  上传用户id
                videoReleaseDate: "",           //   上映日期
                videoSummary: "",               //   视频简介
                videoChannel: "电影",               //   视频频道
                videoDirector: "",              //   导演
                videoArea: "",                  //   地区
                videoUpdateTime: "",             //   更新时间
                videoLastUpdate: "",            //   最新更新集数
                videoActor: "",                 //   演员
            },
            dialogVideo: ref(false),
            image: null,                        //  图片
            imageUrl: "",                       //  转成url用于展示示例
            imageSelected: false,                //  是否已选择album中的image
            file: null,                         //  video转成文件流
            videoUrl: "",                        //  视频预览URL
            thumbnail: null,
            thumbnailUrl: '',
            uploadPercentage: 0,                //  初始化进度为0
            cancelTokenSource: null,            //  取消请求的token source
            centerDialogVisible: false,         //  上传成功后弹出对话提示框
            backendAddress: authService.backendAddress(),
        };
    },

    methods: {
        handleImage() {
            this.imageSelected = true     //  true为已选择图片
        },
        handlePreview(file) {
            console.log("预览文件:", file);
        },
        handleRemove(file, fileList) {
            console.log("移除文件:", file, fileList);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`).then(() => {
                this.file = null;
                this.abortUpload();
            });
        },
        handleFileChange(file) {
            this.videoUrl = URL.createObjectURL(file.raw)   //  生成预览URL
            this.file = file.raw; // 获取原始文件对象
        },
        beforeRemoveImg(image) {
            this.image = null;
        },
        beforeUpload(file) {
            // 可以在这里进行文件验证，例如检查文件类型和大小
            const isJPG = file.type === "image/jpeg" || file.type === "image/png";
            const isLt50M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传图片只能是 JPG 或 PNG 格式!");
            }
            if (!isLt50M) {
                this.$message.error("上传图片大小不能超过 2MB!");
            }
            return isJPG && isLt50M;
        },
        handleImageFileChange(file) {
            this.image = file.raw; // 获取原始文件对象
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeImageUpload(file) {
            // 可以在这里进行文件验证，例如检查文件类型和大小
            return true; // 返回 true 表示允许上传，返回 false 表示阻止上传
        },

        //  选择视频缩略图
        ChangeVideoThumbnail(file) {
            this.thumbnail = file.raw
            this.thumbnailUrl = URL.createObjectURL(file.raw)

        },

        // 截取当前帧作为缩略图
        captureThumbnail() {
            const video = this.$refs.videoPlayer;
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // 设置canvas尺寸与视频一致
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // 绘制当前帧到canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 转为Base64
            this.thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8); // 可调整质量
            this.$message.success({ message: '截取成功', showClose: true })
            console.log(video.currentTime)

            // 转为Blob（用于上传）
            canvas.toBlob((blob) => {
                this.thumbnail = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
            }, 'image/jpeg', 0.8);
        },

        //  上传视频
        async submitUpload() {
            if (!this.file) {
                this.$message.warning({ showClose: true, message: "请选择一个视频" });
                return;
            } else if (!this.image && !this.imageSelected) {
                this.$message.warning({ showClose: true, message: "请选择一张海报" });
                return;
            } else if (this.videoAlbum.videoAlbumName == '') {
                this.$message.warning({ message: '专辑名不能为空' })
                return
            } else if (this.video.videoName == '') {
                this.$message.warning({ message: '视频名称不能为空' })
                return
            }
            // return
            const formData = new FormData();
            formData.append("imageFile", this.image); //  图片流
            formData.append("videoFile", this.file); //视频流MP4
            formData.append("thumbnailFile", this.thumbnail)
            formData.append("video", JSON.stringify(this.video));
            formData.append("videoAlbum", JSON.stringify(this.videoAlbum));
            this.cancelTokenSource = axios.CancelToken.source();
            // 如果还有其他需要提交的 videoAlbum 信息，可以继续添加到 formData 中
            console.log(formData);

            try {
                const response = await authService.uploadVideo(formData,
                    {
                        cancelToken: this.cancelTokenSource.token,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.upload) {
                                this.uploadPercentage = Math.round(
                                    (progressEvent.loaded * 100) / progressEvent.total
                                );
                            } else {
                                // 如果无法计算进度，则显示一个加载动画或其他提示
                                this.uploadPercentage = -1; // 使用 -1 表示正在加载，但不确定进度
                                console.log("无法计算进度"); // 打印无法计算进度的信息
                            }
                        },
                    }
                )

                // 处理成功响应
                if (response.data == true) {
                    console.log("上传成功", response);
                    this.uploadPercentage = 0; // 重置进度条

                    this.centerDialogVisible = true   //  成功后弹出对话框
                    console.log(this.videoAlbum)
                } else if (response.status == 200) {
                    this.$message.warning({ message: '请先登录', showClose: true })
                } else {
                    this.$message.error({ message: '异常警告', showClose: true })
                }

            } catch (error) {
                if (this.cancelTokenSource) {
                    console.log("上传终止");
                }
                // 处理错误响应
                console.error("上传失败", error);
                this.uploadPercentage = 0; // 重置进度条
            }
        },

        //  终止上传
        abortUpload() {
            if (this.cancelTokenSource) {
                ElMessage({ showClose: true, message: "已取消上传", type: "warning" });
                this.cancelTokenSource.cancel("取消上传");
            }
        },

        // 刚开始时获取各种数据，如userId，Album
        async start() {
            // const userId=localStorage.getItem("userId")
            const userId = JSON.parse(localStorage.getItem("userInfo")).userId
            this.videoAlbum.userId = userId
            if (userId != null) {
                try {
                    // const response = await axios.get(`http://localhost:8080/api/videoAlbum/${userId}`);
                    const response = await authService.getAlbumByUserId(userId)
                    console.log(response.data);
                    //   responseData.value=response.data
                    this.tempVAData = response.data;
                    this.tableData = response.data.map((item) => ({
                        date: item.videoReleaseDate,
                        name: item.videoAlbumName,
                        director: item.videoDirector,
                        channel: item.videoChannel,
                        area: item.videoArea,
                        actor: item.videoActor,
                        videoPostPath: this.backendAddress + '/images/' + item.videoPostPath,
                        id: item.videoAlbumId,
                    }));
                    console.log(this.tableData);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            } else {
                console.warn("No userId found in sessionStroage");
            }
        },

        //  编辑选择的专辑
        editItem(row) {
            const foundItem = this.tempVAData.find(
                (item) => item.videoAlbumId == row.id
            );
            this.videoAlbum = foundItem;
            this.imageUrl = this.backendAddress + '/images/' + this.videoAlbum.videoPostPath
            console.log(this.imageUrl)
            if (foundItem) {
                Object.assign(this.videoAlbum, foundItem)
                console.log(this.videoAlbum)
            } else {
                console.log("Item not found");
            }
        },
        //  返回首页
        blackIndex() {
            this.$router.push('/index')
        },
        
        // 视频类型工具方法
        getVideoTypeText,
        getVideoTypeClass,
        getVideoTypeTag,
    },

    mounted() {
        this.start();
    },

    // setup() {
    //     const tableData = ref([]);
    //     const responseData = ref([])
    //     const videoAlbum = ref([])
    //     onMounted(async () => {
    //         const urlParams = new URLSearchParams(window.location.search);
    //         const userId = urlParams.get("userId");
    //         if (userId) {
    //             try {
    //                 const response = await axios.get(`http://localhost:8080/api/videoAlbum/${userId}`);
    //                 console.log(response.data)
    //                 responseData.value = response.data
    //                 tableData.value = response.data.map(item => ({
    //                     date: item.videoReleaseDate,
    //                     name: item.videoAlbumName,
    //                     id: item.videoAlbumId
    //                 }));
    //             } catch (error) {
    //                 console.error('Error fetching data:', error);
    //             }
    //         } else {
    //             console.warn('No userId found in URL parameters');
    //         }
    //     });

    //     function editItem(row) {
    //         console.log(row.id)
    //         console.log(responseData)
    //         const foundItem = responseData.value.find(item => item.videoAlbumId == row.id)
    //         console.log(foundItem)
    //         this.videoAlbum = foundItem
    //         if (foundItem) {
    //             videoAlbum.value = foundItem
    //             console.log(this.videoAlbum)
    //         } else {
    //             console.log('Item not found')
    //         }
    //     }

    //     function deleteItem(row) {
    //         console.log('Delete item:', row)
    //     }

    //     return { tableData, editItem, videoAlbum };
    // }
};
</script>





<!-- <template>
    <div>
        <h2>上传视频</h2>
        <el-upload ref="upload" action="http://localhost:8080/upload" :auto-upload="false" :on-change="handleFileChange"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
            multiple
            :limit="1"
            accept="video/*"
            >
            <el-button slot="trigger" type="primary">选择视频</el-button>
            <div slot="tip" class="el-upload__tip">只能上传mp4, avi格式的视频文件，且不超过50MB</div>

        </el-upload>
        <el-button style="margin-left: 10px;" @click="submitUpload">上传视频</el-button>

    </div>
</template>

<script>
import axios from 'axios';
import { ElUpload } from 'element-plus';

export default {
    components:{
        ElUpload
    },
    data() {
        return {
            videoUploadRequest: {
                video: {
                    videoId: 1,
                    videoType: "免费",
                    videoName: "视频名称",
                    videoTitle: "视频标题"
                },
                videoAlbum: {
                    videoAlbumName: "videoAlbumName",  //专辑名
                    videoAddUser: "zyx",                  //上传用户名
                    videoReleaseDate: "2024/10/21",              //上映日期
                    videoSummary: "测试简介",                  //视频简介
                    videoChannel: "动漫",                  //视频频道
                    videoDirector: "ZYX",                 //导演
                    videoArea: "中国",                     //地区
                    videoUpdateTime: "2020/10/21",               //更新时间
                    videoLastUpdate: "1",               //最新更新集数
                    videoActor: "演员1、演员2",                    //演员
                    videoApprovalStatus: "未审核"            //审核状态
                },
                file: null
            }
        };
    },
    methods: {
        handlePreview(file) {
        console.log('预览文件:', file);
      },
      handleRemove(file, fileList) {
        console.log('移除文件:', file, fileList);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },



        handleFileChange(file) {
            this.videoUploadRequest.file = file.raw; // 获取原始文件对象
        },
        beforeUpload(file) {
            // 可以在这里进行文件验证，例如检查文件类型和大小
            return true; // 返回 true 表示允许上传，返回 false 表示阻止上传
        },
        async submitUpload() {
            if (!this.videoUploadRequest.file) {
                alert('请选择一个文件')
                return
            }
            const formData = new FormData();
            formData.append('videoFile', this.videoUploadRequest.file);   //视频流MP4
            formData.append('video', JSON.stringify(this.videoUploadRequest.video));
            formData.append('videoAlbum', JSON.stringify(this.videoUploadRequest.videoAlbum));
            // 如果还有其他需要提交的 videoAlbum 信息，可以继续添加到 formData 中
            console.log(formData);
            try {
                const response = await axios.post('http://localhost:8080/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // 处理成功响应
                console.log('上传成功', response);
            } catch (error) {
                // 处理错误响应
                console.error('上传失败', error);
            }
        }
    }
};
</script> -->



<!-- <template>
    <div>
      <el-upload
        ref="upload"
        action="http://localhost:8080/upload"
        :auto-upload="false"
        :on-change="handleFileChange"
        :before-upload="beforeUpload"
        :data="formData"
      >
        <el-button slot="trigger" type="primary">选择视频</el-button>
        <el-button style="margin-left: 10px;" @click="submitUpload">上传视频</el-button>
      </el-upload>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  
  export default {
    data() {
      return {
        file: null,
        formData: new FormData(),
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    },
    methods: {
    handleFileChange(file) {
        this.file = file;
        this.formData = new FormData(); // 清空之前的表单数据
        this.formData.append('videoFile', file); // 确保字段名一致
    },
    beforeUpload(file) {
        // 这里可以添加文件类型或大小的验证逻辑
        return true; // 返回 false 会阻止文件上传
    },
    async submitUpload() {
        if (!this.file) {
            ElMessage.error('请先选择一个视频文件');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/upload', this.formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });
            ElMessage.success('上传成功');
            console.log('上传成功', response);
        } catch (error) {
            ElMessage.error('上传失败');
            console.error('上传失败', error);
        }
    },
}

  };
  </script> -->




<!-- <template>
    <div id="app">
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        accept="video/*"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传mp4, avi格式的视频文件，且不超过50MB</div>
      </el-upload>
    </div>
  </template>
  
  <script>
  import { ElUpload } from 'element-plus';
  
  export default {
    name: 'App',
    components: {
      ElUpload
    },
    methods: {
      handlePreview(file) {
        console.log('预览文件:', file);
      },
      handleRemove(file, fileList) {
        console.log('移除文件:', file, fileList);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      }
    }
  };
  </script>
  
  <style>
  #app {
    text-align: center;
    margin-top: 60px;
  }
  </style> -->




<!-- <template>
    <el-form :model="video" label-width="120px">
        <el-row>
            <el-card style="width: 40%;">
                <el-form-item label="视频名称">
                    <el-input v-model="video.videoName"></el-input>
                </el-form-item>
                <el-form-item label="视频标题">
                    <el-input v-model="video.videoTitle"></el-input>
                </el-form-item>
                <el-form-item label="专辑名">
                    <el-input v-model="videoAlbum.videoAlbumName"></el-input>
                </el-form-item>
                <el-form-item label="上传用户名">
                    <el-input v-model="videoAlbum.videoAddUser"></el-input>
                </el-form-item>
                <el-form-item label="上映日期">
                    <el-date-picker v-model="videoAlbum.videoReleaseDate" type="date"
                        placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="视频简介">
                    <el-input type="textarea" v-model="videoAlbum.videoSummary"></el-input>
                </el-form-item>
                <el-form-item label="视频频道">
                    <el-select v-model="videoAlbum.videoChannel" placeholder="请选择">
                        <el-option label="电影" value="电影"></el-option>
                        <el-option label="电视剧" value="电视剧"></el-option>
                        <el-option label="动漫" value="动漫"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="导演">
                    <el-input v-model="videoAlbum.videoDirector"></el-input>
                </el-form-item>
                <el-form-item label="地区">
                    <el-input v-model="videoAlbum.videoArea"></el-input>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-date-picker v-model="videoAlbum.videoUpdateTime" type="date"
                        placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="最新更新集数">
                    <el-input v-model="videoAlbum.videoLastUpdate"></el-input>
                </el-form-item>
                <el-form-item label="演员">
                    <el-input v-model="videoAlbum.videoActor"></el-input>
                </el-form-item>
                <el-form-item>
        <el-button type="primary" @click="handleSubmit">上传视频</el-button>
      </el-form-item>
          
            </el-card>

            <el-card style="width: 40%;">
                {{ this.video }}
                <br /><br />
                {{ this.videoAlbum }}
            </el-card>
        </el-row>
    </el-form>
</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

export default {
    data() {
        return {
            video: {
                videoId: 1,
                videoType: "免费",
                videoName: "视频名称",
                videoTitle: "视频标题"
            },
            videoAlbum: {
                videoAlbumName: "videoAlbumName",  //专辑名
                videoAddUser: "zyx",                  //上传用户名
                videoReleaseDate: "2024/10/21",              //上映日期
                videoSummary: "测试简介",                  //视频简介
                videoChannel: "动漫",                  //视频频道
                videoDirector: "ZYX",                 //导演
                videoArea: "中国",                     //地区
                videoUpdateTime: "2020/10/21",               //更新时间
                videoLastUpdate: "1",               //最新更新集数
                videoActor: "演员1、演员2",                    //演员
                videoApprovalStatus: "未审核"            //审核状态
            },
            file: null

        };
    },
    methods: {
        onFileChange(event) {
            const file = event.target.files[0];
            // 处理文件，例如读取文件内容、生成缩略图等
            // 将处理后的结果存储到 videoUploadRequest.video 中
            this.videoUploadRequest.file = file; // 假设我们直接使用文件对象作为视频数据
        },
        async uploadVideo() {
            // 使用 axios 或其他 HTTP 库发送 POST 请求，将 videoUploadRequest 对象发送到后端 API
            const formData = new FormData();
            formData.append('videoFile', this.file)   //视频流MP4
            // formData.append('videoUpload',JSON.stringify(this.videoUploadRequest))
            formData.append('video', JSON.stringify(this.video))
            formData.append('videoAlbum', JSON.stringify(this.videoAlbum))
            // 如果还有其他需要提交的 videoAlbum 信息，可以继续添加到 formData 中
            // 示例代码：
            axios.post('http://localhost:8080/upload', formData
                , {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
                .then(response => {
                    // 处理成功响应
                    console.log('上传成功', response);
                })
                .catch(error => {
                    // 处理错误响应
                    console.error('上传失败', error);
                });
            console.log(this.videoUploadRequest)
            console.log(formData)
        }
    }



    // name: 'VideoUpload',
    // setup() {
    //   const video = ref({
    //     videoId: 1,
    //     videoIsVip: 1,
    //     videoName: '',
    //     videoTitle: ''
    //   });

    //   const videoAlbum = ref({
    //     videoAlbumName: '',
    //     videoAddUser: '',
    //     videoReleaseDate: '',
    //     videoSummary: '',
    //     videoChannel: '',
    //     videoDirector: '',
    //     videoArea: '',
    //     videoUpdateTime: '',
    //     videoLastUpdate: '',
    //     videoActor: ''
    //   });

    //   const handleSubmit = () => {
    //     // 这里可以添加你的上传逻辑，比如调用API等
    //     ElMessage.success('视频信息已提交');
    //     console.log(video.value);
    //     console.log(videoAlbum.value);
    //   };

    //   return {
    //     video,
    //     videoAlbum,
    //     handleSubmit
    //   };
    // },

};
</script>

<style scoped>
/* 你可以在这里添加一些自定义样式 */
</style> -->