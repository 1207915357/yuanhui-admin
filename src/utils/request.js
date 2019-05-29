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
      // config.headers['X-Token'] = getToken()
       config.headers.Authorization = getToken()
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
  // response => {
  //   const res = response

  //   // if the custom code is not 20000, it is judged as an error.
    
  //   if (res.status !== 200) {
  //    errorHandle(res.status)

  //     // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
  //     // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //     //   // to re-login
  //     //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
  //     //     confirmButtonText: 'Re-Login',
  //     //     cancelButtonText: 'Cancel',
  //     //     type: 'warning'
  //     //   }).then(() => {
  //     //     store.dispatch('user/resetToken').then(() => {
  //     //       location.reload()
  //     //     })
  //     //   })
  //     // }
  //     return Promise.reject(res.msg || 'error')
  //   } else {
  //     return res.data
  //   }
  // },
  res => res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res),
  error => {
   const {response} = error;
   console.log(response, 'res')
   if (response) {
     // 请求已发出，但是不在2xx的范围 
     errorHandle(response.status, response.data.msg);
     return Promise.reject(response);
   } else {
     // 处理断网的情况
     // eg:请求超时或断网时，更新state的network状态
     // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
     // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
     //   store.commit('changeNetwork', false);
     console.log('未知错误!')
   }
  }
)

const errorHandle = (status,msg) => {
  // 失败状态码判断
  switch (status) {
    //  case 0:
    //    Message.error('请求错误!');
    //  break;
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
      console.log(msg,'msg');
  }
}

export default service
