import axios from 'axios'
import getData from '../apis/getData'
import {
  Config
} from './env'
import {
  setCookie,
  getCookie,
  delCookie,
} from '@/apis/cookie1'
import router from '@/router/index'
import {
  Toast
} from "vant";
// const Authorization=getLocalToken()?`}`:''
// 创建一个axios实例
const instance = axios.create({
  baseURL: Config.baseUrl,
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getLocalToken()}` // headers塞token
  }
})
// 从localStorage中获取token
function getLocalToken() {
  const access_token = getCookie('access_token')
  return access_token
}


function refreshToken() {
  // instance是当前request.js中已创建的axios实例
  return getData.refreshLogin
}



// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []
instance.interceptors.request.use(config => {
  if(getLocalToken()!=null){
    config.headers.Authorization = `Bearer ${getLocalToken()}`;
  }
  return config
}, error => {return Promise.reject(error)
})
instance.interceptors.response.use(response => {
  const responseCode =  response.data.code
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
  // 否则的话抛出错误
  if (responseCode === 200) {
    return Promise.resolve(response.data)
  } else {
    setTimeout(() => {
      Toast(response.data.msg)
    }, 300);
    return Promise.reject(response.data)
  }
  // return response.data
}, error => {
  if (error && error.response) {
    const {
      status
    } = error.response
    if (status === 401) {
      const config = error.response.config
      if (!isRefreshing) {
        isRefreshing = true
        let refresh_token = getCookie('refresh_token')
        return getData.refreshLogin({method:'post',data:{
          refreshToken:refresh_token
        }}).then(res => {
          const { access_token,refresh_token } = res.data
          // const access_token = '4a00f579-626f-4c4e-9d24-02b5e00ffdf5'
          setCookie('access_token', access_token, 12)
          // instance.setToken(access_token,12)
          setCookie('refresh_token', refresh_token, 24*30)
          setCookie('accountName',  getCookie('accountName'), 12)


          config.headers['Authorization'] = `Bearer ${access_token}`
          config.baseURL = ''
          // 已经刷新了token，将所有队列中的请求进行重试
          requests.forEach(cb => cb(access_token))
          requests = []
          return instance(config)
        }).catch(res => {
          console.error('refreshtoken error =>', res)
          // const loginUrl=process.env.NODE_ENV === 'production'?'http://hxjf.fehorizon.com/#/login':'http://a.fehorizon.com/HXJFwpsTEST/#/login'
          // window.location.href = loginUrl
          router.push('/login')
        }).finally(() => {
          isRefreshing = false
        })
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push((access_token) => {
            config.baseURL = ''
            config.headers['Authorization'] = `Bearer ${access_token}`
            resolve(instance(config))
          })
        })
      }
    } else {
      switch (error.response.status) {
        case 400:
          error.message = error.response.data.msg;
          break;
        case 403:
          error.message = '拒绝访问(403)';
          break;
        case 404:
          error.message = '请求出错(404)';
          break;
        case 408:
          error.message = '请求超时(408)';
          break;
        case 500:
          error.message = '服务器错误(500)';
          break;
        case 501:
          error.message = '服务未实现(501)';
          break;
        case 502:
          error.message = '网络错误(502)';
          break;
        case 503:
          error.message = '服务不可用(503)';
          break;
        case 504:
          error.message = '网络超时(504)';
          break;
        case 505:
          error.message = 'HTTP版本不受支持(505)';
          break;
        default:
          error.message = `连接出错(${error.response.status})!`;
      }
      Toast(error.message)
    }
  } else {
    // 请求超时状态
    if (error.message.includes('timeout')) {
      Toast('请求超时，请检查网络是否连接正常')
      error.message = '请求超时，请检查网络是否连接正常'
    } else {
      // 可以展示断网组件
      console.log('断网了')
      Toast('请求失败，请检查网络是否已连接')
      error.message = '请求失败，请检查网络是否已连接'
    }
  }

  return Promise.reject(error)
})
const fetch=instance.request
export default fetch;
