import Vue from 'vue'
import Router from 'vue-router'
import moment from 'moment'
import {
  setCookie,
  getCookie,
  delCookie,
} from '@/apis/cookie1'
import Tool from "@/apis/tool"
import wx from "weixin-js-sdk"; // 引入企业微信的sdk
import getData from '../apis/getData'

import mainFotter from '@/views/MainFotter'
// import punchHistory from '@/views/index/punchHistory'

// import leaderConfirm from "@/views/index/leaderConfirm"

// import attendanceAffirm from "@/views/index/attendanceAffirm"
// import attendanceAffirm from "@/views/index/leaderConfirm"

// import abnormalCheck from "@/views/abnormalCheck"
// import abnormalCheck from "@/views/index/leaderConfirm"

// import CheckAppeal from "@/views/CheckAppeal"
// import CheckAppeal from "@/views/index/leaderConfirm"

// import AppealCheck from "@/views/AppealCheck"
// import AppealCheck from "@/views/index/leaderConfirm"

// import checkDetail from "@/views/index/checkDetail"
// import dateList from "@/component/dateList"
// import mapDetail from "@/views/MapDetail"
// import workbench from "@/views/workBench"
// import attendanceTeam from "@/views/attendanceTeam"
// import attendanceMy from "@/views/attendanceMy"
// import abnormalClock from "@/views/abnormalClock"
// import Error from "@/views/Error"
// import confirmResult from "@/views/confirmResult"

// wxa
// import workplan from "@/views/workPlan/workPlan";
// import workplanRecord from "@/views/workPlan/workPlanRecord";
// import workplanAudit from '@/views/workPlan/workPlanAudit';
// import colleague from '@/views/workPlan/colleague';
// import toBeRead from '@/views/workPlan/toBeRead';
// wxa end
// import visitorDetail from '@/views/guestDirectory/detail';
// import visitorlist from '@/views/guestDirectory/list';
// import addressbook from '@/views/guestDirectory/addressbook';
Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      redirect: 'punch'
    },
    {
      path: '*',
      redirect: 'punch' //所有不匹配路径(*)punch
    },
    {
      path: '/mainFotter',
      name: 'mainFotter',
      component: mainFotter,
      children: [{
          path: '/punch',
          name: 'punch',
          component: () => import('@/views/index/punch.vue'),
        }, {
          path: '/punchHistory',
          name: 'punchHistory',
          component: () => import('@/views/index/punchHistory.vue'),
        },

        {
          path: '/attendanceRecord',
          name: 'attendanceRecord',
          component: () => import('@/views/index/attendanceRecord.vue'),
        },
        {
          path: '/mapDetail',
          name: "mapDetail",
          component: () => import('@/views/index/mapDetail.vue'),

        },

      ]
    },
    // 本地时间与实际时间相差较大提醒
    {
      path: '/abnormalClock',
      name: "abnormalClock",
      component: () => import('@/views/abnormalClock.vue'),
      meta: {
        notTimeCheck: true
      }
    },
    {
      path: '/punchHistory',
      name: 'punchHistory',
      component: () => import('@/views/index/punchHistory.vue'),
    },
    {
      path: '/leaderConfirm',
      name: 'leaderConfirm',
      component: () => import('@/views/index/leaderConfirm.vue'),
    },
    {
      path: '/AttendanceAffirm',
      name: 'attendanceAffirm',
      component: () => import('@/views/index/leaderConfirm.vue')
    },
    // 异常考勤确认
    {
      path: '/abnormalCheck',
      name: 'abnormalCheck',
      component: () => import('@/views/index/leaderConfirm.vue')
    },
    {
      path: '/CheckAppeal',
      name: "CheckAppeal",
      component: () => import('@/views/index/leaderConfirm.vue')
    },
    // 考勤申诉
    {
      path: '/AppealCheck',
      name: "AppealCheck",
      component: () => import('@/views/index/leaderConfirm.vue')
    },
    // 待确认考勤列表
    {
      path: '/workbench',
      name: "workbench",
      component: () => import('@/views/index/workBench.vue'),
      // meta:{
      //   keepAlive: true
      // }
    },
    // 下属异常考勤列表
    {
      path: '/attendanceTeam',
      name: "attendanceTeam",
      component: () => import('@/views/index/attendanceTeam.vue'),
      // meta:{
      //   keepAlive: true
      // }
    },
    // 我的异常考勤列表
    {
      path: '/attendanceMy',
      name: "attendanceMy",
      component: () => import('@/views/index/attendanceMy.vue')
    },

    // 错误页面
    {
      path: '/error',
      name: "error",
      component: () => import('@/views/error.vue'),
      meta: {
        notRequireAuth: true
      }
    },
    {
      path: '/confirmResult',
      name: "confirmResult",
      component: () => import('@/views/index/confirmResult.vue')
    },
    { // 工作计划
      path: '/workplan',
      name: 'workplan',
      component: () => import('@/views/workPlan/workPlan')
    },
    {
      path: '/record',
      name: 'record',
      component: () => import('@/views/workPlan/workPlanRecord')
    },
    { //审阅页面
      path: '/workplanAudit',
      name: 'workplanAudit',
      component: () => import('@/views/workPlan/workPlanAudit')
    },
    { // 同事圈
      path: '/colleague',
      name: 'colleague',
      component: () => import('@/views/workPlan/colleague')
    },
    { // 工作简报
      path: '/toBeRead',
      name: 'toBeRead',
      component: () => import('@/views/workPlan/toBeRead')
    },
    { // 工作简报
      path: '/toBeRead0',
      name: 'toBeRead0',
      component: () => import('@/views/workPlan/toBeRead0')
    },
    {
      path: '/visitorDetail',
      name: 'visitorDetail',
      // component: visitorDetail
      component: ()=>import('@/views/guestDirectory/detail')
    },
    {
      path: '/visitorlist',
      name: 'visitorlist',
      // component: visitorlist
      component: ()=>import('@/views/guestDirectory/list')
    },
    {
      path: '/addressbook',
      name: 'addressbook',
      // component: addressbook
      component: ()=>import('@/views/guestDirectory/addressbook')
    },
    //关键动作
    {
      path: '/keyAction',
      name: 'keyAction',
      components: {
        default: () => import('../views/keyAction.vue')
      },
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/actionSafe',
      name: 'actionSafe',
      components: {
        default: () => import('../views/actionSafe.vue')
      },
      // meta:{
      //   keepAlive: true
      // }
    },
    //出差计划
    {
      path: '/travelPlan',
      name: 'travelPlan',
      components: {
        default: () => import('../views/marketingManagement/travelPlan.vue')

      },
    },
    //添加拜访对象
    {
      path: '/visitDetails',
      name: 'visitDetails',
      components: {
        default: () => import('../views/marketingManagement/visitDetails.vue')

      },
    },
    //出差回顾
    {
      path: '/travelReview',
      name: 'travelReview',
      components: {
        default: () => import('../views/marketingManagement/travelReview.vue')
      },
    },
    //招待计划
    {
      path: '/servePlan',
      name: 'servePlan',
      components: {
        default: () => import('../views/marketingManagement/servePlan.vue')
      },
    },
    //招待计划列表
    {
      path: '/serverPlanList',
      name: 'serverPlanList',
      components: {
        default: () => import('../views/marketingManagement/serverPlanList.vue')
      },
    },
    //招待回顾列表
    {
      path: '/serveReviewList',
      name: 'serveReviewList',
      components: {
        default: () => import('../views/marketingManagement/serveReviewList.vue')
      },
    },
    //招待回顾
    {
      path: '/serveReview',
      name: 'serveReview',
      components: {
        default: () => import('../views/marketingManagement/serveReview.vue')
      },
    },
    //招待回顾访客记录
    {
      path: '/visitorlistReview',
      name: 'visitorlistReview',
      components: {
        default: () => import('../views/marketingManagement/visitorlistReview.vue')
      },
    },


  ]
});

router.beforeEach((to, from, next) => {
  // 判断是否需要鉴定篡改系统时间的页面
  const notTimeCheck = to.matched.some((item, index) => {
    return item.meta.notTimeCheck
  })
  if (!notTimeCheck) {
    getData
      .timeCheck({
        method: "post",
        headers: {
          'Authorization': null
        },
        data: {
          frontTime: new Date()
          // frontTime: moment().add(1, 'days')._d
        }
      }).then((res) => {}).catch((err) => {
        //frontTime-前端当前时间   currDate-系统当前时间
        const {
          currDate,
          frontTime
        } = err.data
        next(`/abnormalClock?currDate=${moment(currDate).valueOf()}&frontTime=${moment(frontTime).valueOf()}`)
      })
  }

  let url = window.location.href.split("#")[0];
  getData
    .getConfig({
      method: "post",
      data: {
        url: url
      },
      headers: {
        'Authorization': null
      }
    })
    .then(res => {
      if (res.code == 200) {
        wx.config({
          beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.appId, // 必填，企业微信的corpID
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
          jsApiList: [
            // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
            "getLocation", // 获取地理位置接口
            "checkJsApi",
            "hideAllNonBaseMenuItem" //自定义转发到会话
          ]
        });
        wx.error(function (res) {
          console.log(res);
        });
        wx.ready(function () {
          wx.hideAllNonBaseMenuItem()
        })
      } else {

      }
    })
  // 判断需要鉴权的页面
  const notRequireAuth = to.matched.some((item, index) => {
    return item.meta.notRequireAuth
  })
  if (notRequireAuth) {
    next()
  } else {
    const access_token = getCookie('access_token');
    if (access_token) {
      next()
    } else {
      const code = new Tool.UrlSearch().code;
      if (code) {
        getData.wechatLogin({
          method: 'post',
          data: {
            code
          }
        }).then((res) => {
          if (res.code === 200) {
            const {
              access_token,
              refresh_token,
              username
            } = res.data
            setCookie('access_token', access_token, 12)
            setCookie('refresh_token', refresh_token, 24 * 30)
            setCookie('accountName', username, 12)
            // next()
            window.location.reload()
          } else {
            Toast({
              message: res.msg,
              forbidClick: true,
              onClose: function () {
                next('/login')
              }
            });
          }
        })
      } else {
        getData.getWeChatUrl({
          method: 'post',
          data: {
            redirectUri: window.location.href
          },
          headers: {
            'Authorization': null
          }
        }).then((res) => {
          if (res.code === 200) {
            const {
              weChatUri
            } = res.data
            window.location.href = weChatUri
          }
        })
      }
      /**
       * @require 构造企业微信网页授权链接,拿取code
       * @link  必填，https://work.weixin.qq.com/api/doc#90000/90135/91022
       * @appid 必填，企业的CorpID
       * @redirect_uri 必填，授权后重定向的回调链接地址，请使用urlencode对链接进行处理
       * @response_type 必填，返回类型，此时固定为：code
       * @scope 必填，应用授权作用域。企业自建应用固定填写：snsapi_base
       * @state 非必填 重定向后会带上state参数，企业可以填写a-zA-Z0-9的参数值，长度不可超过128个字节
       * @#wechat_redirect	必填，终端使用此参数判断是否需要带上身份信息
       * @result 员工点击后，页面将跳转至 redirect_uri?code=CODE&state=STATE，企业可根据code参数获得员工的userid。code长度最大为512字节。
       */
      // const appid='wxdd725338566d6ffe'
      // const redirect_uri=encodeUR('')
      // const qiyeApi='https://open.weixin.qq.com/connect/oauth2/authorize?appid=CORPID&redirect_uri=REDIRECT_URI&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'

      // next()

    }
  }
})



export default router;
