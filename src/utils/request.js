import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 ,// request timeout
})

// 设置post请求头
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
service.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1) {
     errorHandle(res.code)

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(res.message || 'error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

const errorHandle = (status, msg) => {
  // 失败状态码判断
  switch (status) {
    case 400:
      Message.info('缺少必要参数!');
      break;
      // 401: 未登录状态，跳转登录页
    case 401:
      // toLogin();
      Message.info('请登录');
      break;
      // 403 token过期
      // 清除token并跳转登录页
    case 403:
      Message.info('登录过期，请重新登录!');
      setTimeout(() => {
        // localStorage.removeItem('token');
        // store.commit('setToken', null);
        store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
      }, 1000);
      break;
      // 404请求不存在
    case 404:
      Message.info('请求的资源不存在!');
      break;
    case 500:
      Message.info('服务器错误!');
      break;
    default:
      console.log(msg);
  }
}

export default service
