// http.js
import axios from "axios";

// const instance = axios.create({
//   baseURL: 'http://localhost:8080/api', // 你的 API 基础 URL
//   timeout: 1000,
//   headers: {'Content-Type': 'application/json'}
// });

// export default instance;

let baseUrl=''

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${baseUrl}${url}`,
        data: params || {},
        // 发送数据前的数据处理，就是对params进行格式处理，再发送，默认处理为转换成json格式。
        transformRequest: [function (data) {
            let ret = '';
            for (const item in data) {
                ret += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

export const getRequest = (url, param) => {
  return axios({
      method: 'get',
      url: `${baseUrl}${url}`,
      params: param || {}
  });
};
export default axios;
