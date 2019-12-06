/**
 * 配置编译环境和线上环境之间的切换
 *
 */
let Config = {
  baseUrl: '', //接口url
  imgBaseUrl: '', //图片url
  mallUrl: 'http://mall.sz.energy.js.cn', //商城地址
  portalUrl: 'http://portal.sz.energy.js.cn', //公共服务地址
}

// process.env.NODE_ENV == 'development'
if (process.env.NODE_ENV == 'development') { //开发环境
  // Config.baseUrl = 'http://10.32.38.131:8080/wps/checkin';   //获取工作流代办数量
  Config.baseUrl = 'http://172.16.85.112:8080/api-att/wps/checkin'
  Config.baseUrlWx = 'http://172.16.85.112:8080/api-cen/api/wechat' // 调用企业微信
  Config.baseUrlSaas = "http://172.16.85.112:8080/api-u"
  Config.baseUrlWps = 'http://172.16.85.112:8080/api-att'  //测试
  // Config.baseUrlWps = 'http://10.32.32.69:8080/api-att'  //开发
  // Config.baseUrlWps = 'http://10.32.32.16:8080/api-att/' //谢德杰本地
  // Config.baseUrlWps = 'http://10.32.34.17:8082/api-att/'
  Config.baseUrlMock = 'http://172.16.85.112:8080/api-mmp'
  Config.baseUrlMockvis = 'http://172.16.85.112:8080/api-att'
  Config.baseUrlUpload = 'http://172.16.85.112:8080/api-f/' //关键动作文件上传
  Config.baseUrlToken = 'http://172.16.85.112:8080'
  // Config.baseUrlWx = 'http://testwps.hongxinshop.com/api-cen/api/wechat/service/'
  // 注释

} else if (process.env.NODE_ENV === 'production') {
  // 生产环境地址
  Config.baseUrlWx = 'http://hxjf.fehorizon.com/api-cen/api/wechat'
  Config.baseUrl = ' http://hxjf.fehorizon.com/api-att/wps/checkin'
  Config.baseUrlSaas = "http://hxjf.fehorizon.com/api-u"
  Config.baseUrlWps = 'http://hxjf.fehorizon.com/api-att'
  Config.baseUrlToken = 'http://hxjf.fehorizon.com'
  Config.baseUrlMock = 'http://hxjf.fehorizon.com/api-mmp'
  Config.baseUrlMockvis = 'http://hxjf.fehorizon.com/api-att'
  Config.baseUrlUpload = 'http://hxjf.fehorizon.com/api-f/' //关键动作文件上传

} else if (process.env.NODE_ENV === 'test') {
  //测试环境
  Config.baseUrlWx = 'http://a.fehorizon.com/HXJFwpsTEST/api-cen/api/wechat'
  Config.baseUrl = 'http://a.fehorizon.com/HXJFwpsTEST/api-att/wps/checkin'
  Config.baseUrlSaas = "http://a.fehorizon.com/HXJFwpsTEST/api-u"
  Config.baseUrlWps = 'http://a.fehorizon.com/HXJFwpsTEST/api-att'
  Config.baseUrlUpload = 'http://a.fehorizon.com/HXJFwpsTEST/api-f/' //关键动作文件上传
  Config.baseUrlToken = 'http://a.fehorizon.com/HXJFwpsTEST'
  Config.baseUrlMock = 'http://a.fehorizon.com/HXJFwpsTEST/api-mmp'
  Config.baseUrlMockvis = 'http://a.fehorizon.com/HXJFwpsTEST/api-att'
}
export {
  Config
}
