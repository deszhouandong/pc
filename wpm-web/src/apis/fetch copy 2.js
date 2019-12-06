import axios from 'axios'
// import loading from './loading'
import {
  Config
} from "./env";
import cookieOperation from "@/apis/cookie.js"
import getData from '../apis/getData'
import router from '@/router/index'
import {
  Toast
} from "vant";
let maxRefresh=0
// import {Message} from "element-ui"
//添加拦截器
// axios.interceptors.request.use(function (config) {
//   if(config.data instanceof FormData && config.data.get("loading")){
//     loading.open()
//   }
//   if(config.data && config.data.loading){
//     loading.open()
//   }
//   return config
// })
// import utils from '../utils'

// 新增代码
const getEvironment=(environment,api=[],config)=>{
  let prefix;
  switch (environment) {
    case 'test':
      prefix='http://a.fehorizon.com/HXJFwpsTEST'
      break;
    case 'production':
        prefix='http://hxjf.fehorizon.com'
        break;
    default:
        prefix='http://172.16.85.112:8080'
      break;
  }
  const aim=api.map((item,index)=>{
    return prefix+item
  })
  // let arr=[]
  // aim.map((item,index)=>{
  //   if(item==config){
  //     arr.push(true)
  //   }else{
  //     arr.push(false)
  //   }
  // })

  return aim;
}
const aim =  getEvironment(process.env.NODE_ENV,api);
const api=['/api-cen/api/wechat/getConfig',
'/api-att/wps/checkin/appealConfirm',
'/api-att/wps/checkin/abnormalConfirm',
'/api-att/wps/checkin/attendanceConfirm',
'/api-att/wps/workPlan/selOneWeekPlan',
'/api-u/api/sass/user/getAccAndNameByToken']

// 根据不同环境配置不同的token
const my_access_token = ((environment)=>{
  switch (environment) {
    case 'test':
        return cookieOperation.cookie.get('access_token');

      case 'production':
        return cookieOperation.cookie.get('access_token');

      default:
        return 'fc9eb5ef-d2d6-4ff4-ac80-6718bc83ef89';
  }
})(process.env.NODE_ENV);

export function fetch(options, me) {
  options = options || {};
  let contentType = 'application/json;charset=UTF-8'
  return new Promise((resolve, reject) => {
    axios({
      url: options.url,
      method: options.method || 'get',
      baseURL: options.baseURL || Config.baseUrl,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Methods": "POST,GET",
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Expose-Headers': 'Authorization',
        "Authorization": 'Bearer ' + my_access_token
      },
      //`params`选项是要随请求一起发送的请求参数----一般链接在URL后面
      //他的类型必须是一个纯对象或者是URLSearchParams对象

      params: options.data,
      // //`paramsSerializer`是一个可选的函数，起作用是让参数（params）序列化
      // //例如(https://www.npmjs.com/package/qs,http://api.jquery.com/jquery.param)
      paramsSerializer: function (params) {

      },
      //`data`选项是作为一个请求体而需要被发送的数据
      //该选项只适用于方法：`put/post/patch`
      //当没有设置`transformRequest`选项时dada必须是以下几种类型之一
      //string/plain/object/ArrayBuffer/ArrayBufferView/URLSearchParams
      //仅仅浏览器：FormData/File/Bold
      //仅node:Stream
      data: options.data,
      //`timeout`选项定义了请求发出的延迟毫秒数
      //如果请求花费的时间超过延迟的时间，那么请求会被终止

      timeout: options.timeout || 12*1000,
      // //`withCredentails`选项表明了是否是跨域请求

      withCredentials: true,//default
      //`adapter`适配器选项允许自定义处理请求，这会使得测试变得方便
      //返回一个promise,并提供验证返回
      // adapter: function(config){
      // /*..........*/
      // },
      dataType: 'json',
      // timeout:options.data.timeout || 20000,
      responseType: 'json',//default
      //`xsrfCookieName`是要用作 xsrf 令牌的值的cookie的名称
      xsrfCookieName: 'XSRF-TOKEN',//default
      // `xsrfHeaderName`是携带xsrf令牌值的http头的名称
      xsrfHeaderName: 'X-XSRF-TOKEN',//default
      //`onUploadProgress`上传进度事件
      onUploadProgress: function (progressEvent) {
        // console.log(progressEvent)
      },
      //下载进度的事件
      onDownloadProgress: function (progressEvent) {
        // console.log(progressEvent)
      },
      //相应内容的最大值
      maxContentLength: 2000,
      //`validateStatus`定义了是否根据http相应状态码，来resolve或者reject promise
      //如果`validateStatus`返回true(或者设置为`null`或者`undefined`),那么promise的状态将会是resolved,否则其状态就是rejected
      validateStatus: function (status) {
        return status >= 200 && status < 300;
        //default
      },
      // //`maxRedirects`定义了在nodejs中重定向的最大数量
      maxRedirects: 5,//default
      // //`httpAgent/httpsAgent`定义了当发送http/https请求要用到的自定义代理
      // //keeyAlive在选项中没有被默认激活
      // httpAgent: new http.Agent({keeyAlive:true}),
      // httpsAgent: new https.Agent({keeyAlive:true}),
      //proxy定义了主机名字和端口号，
      //`auth`表明http基本认证应该与proxy代理链接，并提供证书
      //这将会设置一个`Proxy-Authorization` header,并且会覆盖掉已经存在的`Proxy-Authorization`  header
    })
      .then((response) => {
        if (response.data) {
          // if (response.data.code == '-1') {
          //   // Message.info({message:'登录超时，请重新登录！',showClose:true})
          //   setTimeout(function () {
          //     Toast(response.data.msg)
          //     reject(response);
          //   }, 1000)
          //   return
          // }
          //后台接口请求成功统一返回200，如果非200即请求失败
          if (response.data.code !== 200) {
            setTimeout(function () {
              Toast(response.data.msg)
              reject(response);
            }, 1000)
            return
          }
          resolve(response.data)
        } else {
          resolve(response)
        }
      })
      .catch((error) => { //http://hxjf.fehorizon.com
        if(error&&error.response){
          if (error.response.status === 401 &&
            error.response.data.error === 'invalid_token') {
            if(maxRefresh>=5){
              maxRefresh=0;
              return
            }
            let refresh_token = cookieOperation.cookie.get('refresh_token')
            getData
              .refreshLogin({
                method: "post",
                data: {
                  refreshToken: refresh_token
                }
              })
              .then(
                res => {
                  if (res.code == 200&&res.data) {
                    maxRefresh=0;
                    cookieOperation.cookie.set('access_token', res.data.access_token, 1000 * 60 * 60 * 12)
                    cookieOperation.cookie.set('refresh_token', res.data.refresh_token, 1000 * 60 * 60 * 24)
                    router.go(0)
                  } else {
                    // Toast(res.msg)
                    // router.push('/error')
                  }
                }).catch(()=>{
                  maxRefresh++;
                })
          }else{
            switch (error.response.status) {
              case 400: error.message = '请求错误(400)' ; break;
              case 403: error.message = '拒绝访问(403)'; break;
              case 404: error.message = '请求出错(404)'; break;
              case 408: error.message = '请求超时(408)'; break;
              case 500: error.message = '服务器错误(500)'; break;
              case 501: error.message = '服务未实现(501)'; break;
              case 502: error.message = '网络错误(502)'; break;
              case 503: error.message = '服务不可用(503)'; break;
              case 504: error.message = '网络超时(504)'; break;
              case 505: error.message = 'HTTP版本不受支持(505)'; break;
              default: error.message = `连接出错(${error.response.status})!`;
            }
            Toast(error.message)
          }
          // return Promise.reject(error)
        }else{
          // 请求超时状态
          if (error.message.includes('timeout')) {
            // Toast('请求超时，请检查网络是否连接正常')
            error.message='请求超时，请检查网络是否连接正常'
          } else {
            // 可以展示断网组件
            console.log('断网了')
            // Toast('请求失败，请检查网络是否已连接')
            error.message='请求失败，请检查网络是否已连接'
          }
        }
        reject(error)
      })
  })
}

function checkTime() {
  if (Storage.get('loginTime', true)) {
    let time = new Date().getTime() / 1000,
      time2 = Storage.get('loginTime', true);
    if (parseInt(time) - parseInt(time2) > 1800) {
      Storage.remove("user", true);
      Storage.remove("loginTime", true);
      // MyVue.$router.push({name:'login'})
    }
  }
}

