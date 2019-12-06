import {
  Config
} from './env.js'
import fetch from './fetch'

// import jsdApi from './jds'
let getData = {
  //待办总条数
  // clueFlowCount(params) {
  //  params.url = '/api/saas/activiti/clueFlowCount'
  //  return fetch(params)
  // },
  // 检测是否更改系统时间
  timeCheck(params) {
    params.baseURL = Config.baseUrlWps;
    params.url = '/users-anon/timeCheck'
    return fetch(params)
  },
  // 上班打卡
  punchClock(params) {
    params.url = '/punchClock'
    return fetch(params)
  },
  //打卡考勤默认加载
  attendanceInfoLoading(params) {
    params.url = '/attendanceInfoLoading'
    return fetch(params)
  },
  //获取企业微信信息
  getConfig(data) {
    data.url = '/getConfig'
    data.baseURL = Config.baseUrlWx;
    return fetch(data)
  },
  //重复打卡
  againPunchClock(params) {
    params.url = '/againPunchClock'
    return fetch(params)
  },
  //考勤查看
  checkinInfo(params) {
    params.url = '/checkinInfo'
    return fetch(params)
  },
  //异常确认
  checkinConfirm(params) {
    params.url = '/checkinConfirm'
    return fetch(params)
  },
  //考勤确认
  attendanceConfirm(params) {
    params.url = 'attendanceConfirm'
    return fetch(params)
  },
  //异常考勤确认
  appealConfirm(params) {
    params.url = 'appealConfirm'
    return fetch(params)
  },
  //考勤申诉提交
  appealSubmit(params) {
    params.url = 'appealSubmit'
    return fetch(params)
  },
  //在线考勤地图
  attendanceMap(params) {
    params.url = 'attendanceMap'
    return fetch(params)
  },
  // 单个员工异常考勤记录
  individualAbnormalRecordsList(params) {
    params.url = 'individualAbnormalRecordsList'
    return fetch(params)
  },
  //待确认考勤次数-团队
  unconfirmedList(params) {
    params.url = 'unconfirmedList'
    return fetch(params)
  },
  // 异常考勤-团队
  abnormalAttendanceList(params) {
    params.url = "abnormalAttendanceList"
    return fetch(params)
  },
  // 单个员工考勤记录
  NextLevelAttendanceRecords(params) {
    params.url = 'NextLevelAttendanceRecords'
    return fetch(params)
  },
  //单个员工考勤记录-地图
  individualCardingRecords(params) {
    params.url = 'individualCardingRecords'
    return fetch(params)
  },
  //单个员工待确认考勤记录(月)
  unconfirmedRecordsList(params) {
    params.url = 'unconfirmedRecordsList'
    return fetch(params)
  },
  //异常考勤确认
  abnormalConfirm(params) {
    params.url = 'abnormalConfirm'
    return fetch(params)
  },
  //获取当前前用户的信息
  getCurrent(params) {
    params.url = '/api/saas/user/getAccAndNameByToken'
    params.baseURL = Config.baseUrlSaas;
    return fetch(params)
  },
  // 微信登录
  wechatLogin(params) {
    params.url = '/sys/wechat/login'
    params.baseURL = Config.baseUrlToken;
    return fetch(params)
  },
  // 获取微信拼接code地址
  getWeChatUrl(params){
    params.url = '/api-cen/api/wechat/getWeChatUrl'
    params.baseURL = Config.baseUrlToken;
    return fetch(params)
  },
  // 刷新登录
  refreshLogin(params) {
    params.url = '/sys/refresh_token'
    params.baseURL = Config.baseUrlToken;
    return fetch(params)
  },
  //查看工作计划与回顾
  selOneDayPlan(params) {
    params.url = '/wps/workPlan/selOneDayPlan'
    params.baseURL = Config.baseUrlWps;
    return fetch(params)
  },

  /**
   * wxa
   */
  getWorkDay(params) { //  查询用户本周的请假和工作日
    params.url = "/wps/workPlan/selLeaveDay"; // /wps/workPlan/selOneWeekPlan
    // /wps/workPlan/selLeaveDay selLeaveDay
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  addWeekWorkPlan(params) { //  添加周计划和工作日
    params.url = "/wps/workPlan/addWeekWorkPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  selOneWeekPlan(params) { // 查询某周的计划
    params.url = "/wps/workPlan/selOneWeekPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  submitWeekWorkPlan(params) { // 提交周计划和日计划
    params.url = "/wps/workPlan/submitWeekWorkPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  revokeWeekWorkPlan(params) { // 撤回周计划和日计划
    params.url = "/wps/workPlan/revokeWeekWorkPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  selWorkPlanLog(params) { // 查询操作记录
    params.url = "/wps/workPlan/selWorkPlanLog";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  examineWeekWorkPlan(params) { // 领导审核周计划和日计划
    params.url = "/wps/workPlan/examineWeekWorkPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  addWeekWorkReview(params) { // 添加周回顾和日回顾
    params.url = "/wps/workPlan/addWeekWorkReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  submitWeekWorkReview(params) { // 提交周回顾和日回顾
    params.url = "/wps/workPlan/submitWeekWorkReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  revokeWeekWorkReview(params) { // 撤回周回顾和日回顾 或审核
    params.url = "/wps/workPlan/revokeWeekWorkReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  examineWeekWorkReview(params) { // 回顾 审核
    params.url = "/wps/workPlan/examineWeekWorkReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  // selColleagueCircle
  selColleagueCircle(params) { // 查询用户同事圈
    params.url = "/wps/workPlan/selColleagueCircle";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  selPersonByFuzzyName(params) { // 搜索公司的人
    params.url = "/wps/workPlan/selPersonByFuzzyName";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  selSubordinates(params) { // 查询当前用的的下级
    params.url = "/wps/workPlan/selSubordinates";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  addConcern(params) { // 添加关注
    params.url = "/wps/workPlan/addConcern";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  selConcernList(params) { // 查询用户的关注
    params.url = "/wps/workPlan/selConcernList";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  cancelConcern(params) { // 取消关注
    params.url = "/wps/workPlan/cancelConcern";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  getVisitorCount(params){ // 查询访客记录
    params.url = "/wps/visitors/getVisitorCount";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  queryHomeDataForPerson(params){ // 查询出差和招待的图标
    // /wps/tripEntertain/queryHomeDataForPerson
    params.url = "/wps/tripEntertain/queryHomeDataForPerson";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  queryTripEntertainPlanDataForLeader(params){ // 查询计划审批界面 出差和招待的数据
    // /wps/tripEntertain/queryTripEntertainPlanDataForLeader
    params.url = "/wps/tripEntertain/queryTripEntertainPlanDataForLeader";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  queryTripEntertainReviewDataForLeader(params){ // 查询回顾审批界面 出差和招待的数据
    // /wps/tripEntertain/queryTripEntertainReviewDataForLeader
    params.url = "/wps/tripEntertain/queryTripEntertainReviewDataForLeader";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  selectMouthExamineWorkCnt(params){ // 工作简报 查询用户某年月的待阅数
    // /wps/workPlan/selectMouthExamineWorkCnt
    params.url = "/wps/workPlan/selectMouthExamineWorkCnt";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  selectMouthExamineWork(params){ // 工作简报 查询用户某年月的待阅详情
    // /wps/workPlan/selectMouthExamineWork
    params.url = "/wps/workPlan/selectMouthExamineWork";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  queryTripEntertainReviewDataForLeader(params){ // 获取 回顾 招待出差
    // /wps/tripEntertain/queryTripEntertainReviewDataForLeader
    params.url = "/wps/tripEntertain/queryTripEntertainReviewDataForLeader";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  queryTripEntertainPlanDataForLeader(params){ // 获取 计划 招待出差
    // /wps/tripEntertain/queryTripEntertainPlanDataForLeader
    params.url = "/wps/tripEntertain/queryTripEntertainPlanDataForLeader";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  queryPersonUnitMsgByAd(params){ // 获取 计划 招待出差
    // /api/saas/account/queryPersonUnitMsgByAd
    params.url = "/api/saas/account/queryPersonUnitMsgByAd";
    params.baseURL = Config.baseUrlSaas;
    return fetch(params);
  },

  /**
   * wxa end
   */


  keyAction(params) { // 关键动作查询
    params.url = "/wps/monitor/getApplyRecord";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  keyActionSave(params) { // 关键动作保存
    params.url = "/wps/monitor/save";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  keyActionSubmit(params) { // 关键动作保存
    params.url = "/wps/monitor/submit";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

//文件上传
  keyUpload(params) {
    params.url = "/fast/files/uploadRes";
    params.baseURL = Config.baseUrlUpload;
    return fetch(params);
  },


  /**
   * wxa end
   */

  travelPlanFind(params) {//出差计划查询
    params.url = "/wps/businesstrip/findLastPlanDateByWpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  travelPlanSearch(params) {//出差计划模糊查询
    params.url = "/wps/integration/searchVisitNameForTrip";
    params.baseURL =  Config.baseUrlWps;
    return fetch(params);
  },

  travelPlanSave(params) { //出差计划保存
    params.url = "/wps/businesstrip/saveTripPlanByAdcount";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  travelPlanDel(params) { //出差计划删除
    params.url = "/wps/businesstrip/logicDelTripPlanByWpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  travelReviewFind(params) { //出差回顾查询
    params.url = "/wps/businesstrip/findTripReviewByWpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  travelReviewSave(params) { //出差回顾保存
    params.url = "/wps/businesstrip/saveTripReviewByAdCount";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  travelReviewDel(params) { //出差回顾删除
    params.url = "/wps/businesstrip/logicDelTripReviewByWrId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },


  /**
   * wxa end
   */
  servePlanFind(params) { //招待计划查询
    params.url = "/entertain/findEntertainPlanByEpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  servePlanListFind(params) { //招待计划列表查询
    params.url = "/entertain/findEntertainPlanList";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  servePlanDel(params) { //招待计划删除
    params.url = "/entertain/logicDelEntertainPlanByEpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  servePlanSave(params) { //招待计划保存
    params.url = "/entertain/addEntertainPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  servePlanUpdate(params) { //招待计划修改
    params.url = "/entertain/updateEntertainPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  servePlanListFind(params) { //招待计划列表查询
    params.url = "/entertain/findEntertainPlanList";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },
  serveRewSave(params) { //招待回顾保存
    params.url = "/entertain/addEntertainReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  serveRewUpdete(params) { //招待回顾修改
    params.url = "/entertain/updateEntertainReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  serveRewDel(params) { //招待回顾删除
    params.url = "/entertain/logicDelEntertainReviewByEpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  serveRewFind(params) { //招待回顾查询
    params.url = "/entertain/findEntertainReviewDetailById";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

  serveRewVis(params) { //访客对象
    params.url = "/wps/visitors/listVisitorsRecordForState";
    params.baseURL = Config.baseUrlMockvis;
    return fetch(params);
  },

  serveReviewList(params) { //招待回顾列表查询
    params.url = "/entertain/findEntertainReviewList";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },



  mock(params) { //招待计划模糊查询mock
    params.url = "/mock";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  },

};
// Object.assign(getData, jsdApi);
export default getData
// function beforeHttp(params){
//   params.data = params.data || {};
//   let userObj = Storage.get("user",true);
//   if(params&&params.data){
//     params.data = Object.assign({
//       companyId:userObj.companyId,
//       token:userObj.token,
//       userId:userObj.userId,
//       accountId:userObj.accountId
//     },params.data);
//     if(!params.data.timestamp){
//       let timestamp = new Date().getTime();
//       Object.assign(params.data,{timestamp:timestamp})
//     }
//   }
// }
