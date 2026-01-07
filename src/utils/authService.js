import axios from "axios";
import { ElMessage } from 'element-plus';

const backendAddress = `http://localhost`      // 你的 API 基础 URL
// const backendAddress = `http://192.168.1.1`      // 你的 API 基础 URL
// const backendAddress = `http://114.132.173.236`
// const backendAddress = `https://online-video.online`

const http = axios.create({
    baseURL: backendAddress,
    // timeout: 6000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

// 请求拦截器 - 添加 token
http.interceptors.request.use(
    config => {
        // 从 localStorage 中获取 token
        const token = localStorage.getItem('VideoToken')
        // 如果 token 存在，添加到请求头
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加调试信息
        console.log('请求配置:', config);
        console.log('请求数据:', config.data);

        return config;
    },
    error => {
        // 请求错误处理
        return Promise.reject(error);
    }
);

//  响应拦截器
http.interceptors.response.use(
    response => {
        // 对响应数据做些处理，比如统一处理某些返回格式
        if (response.data && response.data.token) {
            // 如果有新 token，可以在这里更新
            localStorage.setItem('VideoToken', response.data.token);
        }
        return response
    },
    error => {
        if (error.response) {
            //  服务器返回了响应，但是状态码不在 200 - 299 之间
            const status = error.response.status;
            let errorMessage = '';
            switch (status) {
                case 400:
                    errorMessage = '请求参数错误';
                    break;
                case 401:
                    errorMessage = '用户未登录或登录已过期,请重新登录';
                    localStorage.removeItem("VideoToken")
                    localStorage.removeItem("LoginState")
                    localStorage.removeItem("userInfo")
                    ElMessage.error({ message: '登录已过期，请重新登录', showClose: true })
                    break;
                case 403:
                    errorMessage = '权限不足，禁止访问';
                    error.isUnauthorizedError = true; // 标记为 403 错误
                    break;
                case 404:
                    errorMessage = '请求的资源不存在';
                    break;
                case 413:
                    errorMessage = '请求实体过大';
                    break;
                case 429:
                    errorMessage = '请求过于频繁，请稍后再试';
                    break;
                case 500:
                    errorMessage = '服务器内部错误';
                    break;
                default:
                    errorMessage = `未知错误，状态码: ${status}`;
            }
            //  显示错误信息
            ElMessage.error({ message: errorMessage, showClose: true })
        } else if (error.request) {
            //  请求已经发出，但没有收到服务器响应
            ElMessage.error({ message: '没有收到服务器响应', showClose: true })
        } else {
            //  在设置请求时发生了错误
            ElMessage.error({ message: '请求设置发生错误', showClose: true })
        }
        return Promise.reject(error)    //  确保返回的 error 对象结构完整
    }
)

export default {
    //  后端地址
    backendAddress() {
        return backendAddress
    },

    async tempToken() {
        return await http.get(`/api/generate-temporary-token`)

    },

    async login(userData) {
        return await http.post('/api/auth/login', userData)

    },

    async logout() {
        return await http.post('/api/auth/logout')
    },

    async registerCode(form) {
        return await http.post('/api/auth/register/code', form)
    },
    async registerInsert(userData) {
        return await http.post('/api/auth/register/insert', userData)
    },

    async forgetPasswordCode(userData) {
        return await http.post('/api/auth/forget-password/code', userData)
    },

    async forgetPasswordReset(form) {
        return await http.post('/api/auth/forget-password/reset', form)
    },

    async verify(videoId) {
        return await http.get(`/api/verify?videoId=${videoId}`)
    },

    async updateUserInfo(userData) {
        return await http.post('/api/updateUserInfo', userData);
    },

    //  uploadVideo

    async uploadVideo(videoDate, config) {
        return await http.post('/api/upload', videoDate, config)
    },

    async updateUserPassword(userData) {
        return await http.post('/api/updateUserPassword', userData);
    },

    //  Video

    async videoURL(videoId) {
        const response = await http.get(`/api/generate-temporary-token`)
        let url = `${backendAddress}/api/static/video?videoId=${videoId}`;
        return url + `&&token=${response.data}`;
    },

    async getIndexVideos(VideoDate) {
        return await http.post('/api/IndexVideos', VideoDate)
    },

    async getRecommendVideos(page, size) {
        return await http.get('/api/recommendVideos', { params: { page: page, size: size } })
    },

    async getVideos(videoDate) {
        return await http.post('/api/videos', videoDate)
    },

    async videosByUserId(userId) {
        return await http.get(`/api/videosByUserId?userId=${userId}`)
    },

    async searchVideo(condition) {
        return await http.post('/api/searchVideo', condition)
    },

    async videosInSameAlbum(videoId) {
        return await http.get(`/api/videosInSameAlbum?videoId=${videoId}`)
    },

    async updateVideo(video) {
        return await http.post(`/api/updateVideo`, video)
    },

    async reiterateVideo(video) {
        return await http.post(`/api/reiterateVideo`, video)
    },

    async deleteVideo(video) {
        return await http.delete(`/api/deleteVideo`, { data: video })
    },

    async existsVideo(video) {
        return await http.post('/api/existsVideo', video)
    },

    async increaseViewCount(videoId) {
        return await http.post('/api/increaseViewCount', { videoId: videoId })
    },

    //  Album

    async getVideoAlbums(videoAlbum) {
        return await http.post(`/api/videoAlbums`, videoAlbum)
    },

    async getAlbumByUserId(userId) {
        return await http.get(`/api/videoAlbum/${userId}`)
    },

    async updateAlbum(albumData) {
        return await http.post('/api/updateAlbum', albumData)
    },

    async deleteAlbum(videoAlbum) {
        return await http.post('/api/deleteAlbum', videoAlbum)
    },

    // Comment

    async videoComment(reqComment) {
        return await http.post('/api/videoComment', reqComment)
    },

    async addComment(addComment) {
        return await http.post('/api/addComment', addComment)
    },

    async deleteComment(condition) {
        console.log('deleteComment 参数:', condition);
        const response = await http.post('/api/deleteComment', condition);
        console.log('deleteComment 响应:', response);
        return response;
    },


    //  Danmaku
    async getDanmakus(danmaku) {
        return await http.post('/api/getDanmaku', danmaku)
    },

    async addDanmaku(addDanmaku) {
        return await http.post('/api/addDanmaku', addDanmaku)
    },

    async deleteDanmaku(condition) {
        return await http.post('/api/deleteDanmaku', condition)
    },

    //  history

    insertHistory(options) {
        const token = localStorage.getItem("VideoToken");
        fetch(`${backendAddress}/api/insertHistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(options),
            keepalive: true,
        })
    },

    async detailHistory(history) {
        return await http.post('/api/detailHistory', history)
    },

    async historyByHistoryId(history) {
        return await http.post('/api/historyByHistoryId', history)
    },

    async deleteHistory(history) {
        return await http.delete('/api/deleteHistory', { data: history })
    },

    //  admin

    async adminUsers(queryUser, startTime, endTime) {
        return await http.post(`/api/admin/users`, queryUser, { params: { startTime, endTime } })
    },

    async adminInsertUser(userData) {
        return await http.post('/api/admin/insertUser', userData);
    },

    async adminUpdateUser(userData) {
        return await http.post('/api/admin/updateUser', userData)
    },

    async adminDeleteUser(userId) {
        return await http.delete(`/api/admin/deleteUser/${userId}`)
    },

    async adminFindVideos(videoDate) {
        return await http.post('/api/admin/videos', videoDate)
    },

    async adminUpdateVideo(videoDate) {
        return await http.post('/api/admin/updateVideo', videoDate)
    },

    async adminFindAlbum(albumData) {
        return await http.post('/api/admin/Albums', albumData)
    },

    async adminUpdateAlbum(albumData) {
        return await http.post('/api/admin/updateAlbum', albumData)
    },

    //  Video Report
    async submitReport(reportData) {
        return await http.post('/api/submitReport', reportData)
    },

    async checkReport(videoId) {
        return await http.get(`/api/checkReport?videoId=${videoId}`)
    },

    async getMyReports(userId) {
        return await http.get(`/api/myReports?userId=${userId}`)
    },

    // Admin: 获取所有举报记录
    async adminGetReports(reportQuery) {
        return await http.post('/api/admin/reports', reportQuery)
    },

    // Admin: 处理举报
    async handleReport(handleData) {
        return await http.post('/api/admin/handleReport', handleData)
    },
};
