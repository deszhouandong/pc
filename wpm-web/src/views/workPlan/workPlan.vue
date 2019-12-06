<template>
  <div class="workplan">
    
    <div id="review" :style="viewShow == 'review'?'':'display:none'">
      <van-nav-bar  class="vanNavBar">
        <div slot="left" @click="workPlanClick" v-if="h3Active == 1" >
          <van-icon name="arrow-left" /> <span> 第{{lastNumberOfweeks}}周 </span>
        </div>
        <div slot="left" @click="workPlanClick" v-if="h3Active == 2">
          <van-icon name="arrow-left" /> <span>计划</span>
        </div>
        <div slot="title" @click="optionDate()">
          <div class="center">
            <div class="title_h3" v-if="h3Active == 1">工作计划
              <!-- <div v-show="thisName" style="
                position:absolute;left:67%;top:0;bottom:0;margin:auto 0;
                font-size:12px;font-weight:400;color:rgba(72,72,72,1);line-height:15px;
                border-left:1px solid #007AFF;height:15px;padding-left:3px;
              ">{{thisName}}</div> -->
            </div>
            <div class="title_h3" v-if="h3Active == 2">工作回顾
              <!-- <div v-show="thisName" style="
                position:absolute;left:67%;top:0;bottom:0;margin:auto 0;
                font-size:12px;font-weight:400;color:rgba(72,72,72,1);line-height:15px;
                border-left:1px solid #007AFF;height:15px;padding-left:3px;
              ">{{thisName}}</div> -->
            </div>
            <div class="title_span">{{year}}年 第{{numberOfWeeks}}周 {{getXDate}}</div>
          </div>
        </div>
        <div slot="right" @click="workReviewClick" v-if="h3Active == 1"> <span>回顾</span> <van-icon name="arrow" /></div>
        <div slot="right" @click="workReviewClick" v-if="h3Active == 2"><span>第{{nextNumberOfWeeks}}周</span><van-icon name="arrow" /></div>
      </van-nav-bar>

      <div @touchstart="start($event)" @touchmove="moveFn($event)" @touchend="end($event)" 
        :class="move" id='tabDiv' 
      >
        <div class="first" ref="first">
          <div class="title">
            <div style="display:inline-block;vertical-align: middle;height:100%;">{{numberOfWeeks}}周</div>

            <!-- 显示访客次数 -->
            <div v-if="h3Active == 2 && visitNumber!=0" style="height:100%;width:1px;display:inline-flex;align-items:center;vertical-align: middle;">
              <div style="height:18px;width:0px;border-right:1px solid #007AFF;"></div>
            </div>

            <div v-if="h3Active == 2 && visitNumber!=0" id="visitNumber" @click="toVisitorlist"> 
                <van-image :src="imgSrc" />
                <span class="visitNumber_span">{{visitNumber}}次拜访</span>
            </div> 
            <!-- 出差预算 -->
            <!-- <div style="display:inline-flex;vertical-align:middle;">
              <i style="border-left:1px solid #007AFF;font-size:12px;margin-right:10px;"></i>
              <van-image :src="chuchaiImgSrc" />
              <span style="font-size:11px;font-weight:500;color:rgba(0,122,255,1);margin-left:5px;line-height:16px;">预算：400 实际：380.8</span>
            </div> -->
            
          </div>
          <!-- :required="(h3Active == 1 && wworkPlanReviewDes.length == 0)||(h3Active == 2 && newDate.getDay() == 5 && wworkPlanReviewDes.length == 0)?true:false"  -->
          <!-- :error-message="wworkPlanReviewDes.length == 0?'该出为必填项':''" -->
          <van-field v-model="wworkPlanReviewDes" :readonly="(wstatus != 1 && h3Active == 1) || ( h3Active == 2 && dstatus != 3 ) || !(numberOfWeeks>=numberOfWeeksNow && numberOfWeeks<=(numberOfWeeksNow+3)  )"
            :error-message="required?'该处为必填项':''"
            :required="required" 
            type="textarea"
            :maxlength="textLength" :rows='firstRows' 
            style="border-radius:4px;border:1px solid rgba(75,119,175,0.2);box-sizing: border-box;min-height:63px"
            :placeholder="placeholderShow" 
            @click="(wstatus != 1 && h3Active == 1) || ( h3Active == 2 && dstatus != 3 )?clickInput(wworkPlanReviewDes,numberOfWeeks+'周'):null"
            @focus="firstFocus"
          />
        </div>
        <div class="list" :style="(h3Active == 2 && numberOfWeeks<numberOfWeeksNow )||(h3Active == 1 && wstatus == 3)||(h3Active == 2&&dstatus == 5)||(h3Active == 2&&wstatus != 3)||(h3Active == 1 && (numberOfWeeks<numberOfWeeksNow || numberOfWeeks>numberOfWeeksNow+3) ) ?'padding-bottom:0px;':''"
          @scroll="listScroll"  ref="list"
        >
          
          <ul class="main">
            <li  v-for="(item,index) in weekArr" :key="index">
              <div class="title">
                <span>周{{fontChange(index)}}</span><span>{{item.date}}日</span>
                <!-- 出差图标 -->
                <van-image v-show="item.isTrip" 
                  width="17" height="17"
                  :src="item.isTrip==3&&item.approvalTripStatus == 1?chuchaiImgSrc :chuchaiImgGSrc" 
                  @click="()=>{$router.push(
                    h3Active == 1?{ path:'/travelPlan',query:{  id:item.imgTripId,time:item.dateAll,weekNum:numberOfWeeks,year,startDate,  } }:
                    { path:'/travelReview',query:{ id:item.imgTripId ,startDate:item.dateAll, } }
                  )}"
                />
                <!-- 招待图标 -->
                <van-image v-show="item.isEntertain" 
                  width="17" height="17"
                  :src="item.isEntertain==3&&item.approvalEntertainStatus == 1?zhaodaiImgSrc :zhaodaiImgGSrc" 
                  @click="()=>{$router.push(
                    h3Active == 1?{ path:'/serverPlanList', query:{ time:item.dateAll,adAcount } }:
                    { path:'/serveReviewList', query:{ time:item.dateAll,adAcount} }
                  )}" 
                />
                
              </div>
              <div class="itemUp itemText">
                <div class="itemTextTitle">上午</div>
                  <!-- :placeholder="(wstatus == 1 && butisShow()) ? '请填写当日工作计划' : ''"  -->
                <van-field v-if="h3Active == 1 && !item.disabledUp" v-model="item.dworkPlanDesAm" 
                  :placeholder="placeholderPlanShow" 
                  :maxlength="textLength"  type="textarea" :rows="3"
                  @click="(wstatus != 1 && h3Active == 1)?clickInput(item.dworkPlanDesAm,'周'+fontChange(index)+'  '+item.date+'日'):null"
                  :disabled="!butisShow()" @focus.stop="fieldFocus($event)" @blur="fieldFocus($event)"
                  style="color:#fff;"
                ></van-field>
                  <!-- :readonly="wstatus != 1 && wstatus >= 3"  -->
                <van-field v-if="h3Active == 2 && !item.disabledUp" v-model="item.dworkReviewDesAm" 
                  :placeholder="placeholderReviewShow(item)" 
                  :maxlength="textLength" :rows="3" type="textarea"
                  :disabled="disabledReview(item)"
                  @click="disabledReview(item)?clickInput(item.dworkReviewDesAm,'周'+fontChange(index)+'  '+item.date+'日'):null"
                  @focus.stop="onFocus(index);fieldFocus($event)" @blur="fieldFocus($event)"
                ></van-field>
                <!-- 休假 -->
                <div v-show="item.disabledUp"  style="width:340px;height:18px;background:rgba(255,232,182,1);text-align:center;font-size:12px;font-weight:600;color:rgba(255,167,0,1);line-height:17px;"  >{{item.disabledUp}}</div>
              </div>
              <div style="height:0;width:100%;border-top:1px dashed rgba(75,119,175,0.2);"></div>
              <div class="itemDown itemText">
                <div class="itemTextTitle">下午</div>
                <van-field v-if="h3Active == 1 && !item.disabledDown" v-model="item.dworkPlanDesPm" 
                  :placeholder="placeholderPlanShow" :maxlength="textLength"
                  :rows="3" type="textarea"
                  :disabled="!butisShow()" @focus.stop="fieldFocus($event)" @blur="fieldFocus($event)"
                  @click="(wstatus != 1 && h3Active == 1)?clickInput(item.dworkPlanDesPm,'周'+fontChange(index)+'  '+item.date+'日'):null"
                />
                
                <van-field v-if="h3Active == 2 && !item.disabledDown" v-model="item.dworkReviewDesPm" 
                  :placeholder="placeholderReviewShow(item)" 
                  :maxlength="textLength"
                  :rows="3" type="textarea"
                  :disabled="disabledReview(item)"
                  @click="disabledReview(item)?clickInput(item.dworkReviewDesPm,'周'+fontChange(index)+'  '+item.date+'日'):null"
                  @focus.stop="onFocus(index);fieldFocus($event)" @blur="fieldFocus($event)"
                />
                <!-- 休假 -->
                <div v-show="item.disabledDown"  style="width:340px;height:18px;background:rgba(255,232,182,1);text-align:center;font-size:12px;font-weight:600;color:rgba(255,167,0,1);line-height:17px;"  >{{item.disabledDown}}</div>
              </div>
              
            </li>
          </ul>

          <!-- 领导的回顾审核意见 -->
          <div id="opinion" v-if="(dstatus == 5 && h3Active == 2) || (dreviewVerifiedOpinionArr.length>0 && h3Active == 2)">
            <h3>管理者意见</h3>
            <div v-for="(item,index) in dreviewVerifiedOpinionArr" :key="index" :style="index!=0?'margin-top:0px;':''">
              <div style="width:100%;border:none" >
                <p @click="clickInput(item.dreviewVerifiedOpinion1,'管理者意见',item.dverifiedUserName1,wdDate(1,item.dreviewVerifiedDate1))"
                >{{item.dreviewVerifiedOpinion1}}</p>
                <div><span>{{item.dverifiedUserName1}}</span><br/><span>{{wdDate(1,item.dreviewVerifiedDate1)}}</span></div>
              </div>
            </div>
            
          </div>
          <!-- 领导的计划审核意见 -->
          <div id="opinion" v-if="(wstatus == 3 && h3Active == 1)">
            <h3>管理者意见</h3>
            <div v-if="!wverifiedUserName2">
              <div style="width:100%;border:none" >
                <p @click="clickInput(wplanDreviewVerifiedOpinio(1),'管理者意见',wverifiedUserName1,wdDate(1))">{{wplanDreviewVerifiedOpinio(1)}}</p>
                <div><span>{{wverifiedUserName1}}</span><br/><span>{{wdDate(1)}}</span></div>
              </div>
            </div>
            <div v-if="wverifiedUserName2"> 
              <div>
                <p @click="clickInput(wplanDreviewVerifiedOpinio(1),'管理者意见')">{{wplanDreviewVerifiedOpinio(1)}}</p>
                <div><span>{{wverifiedUserName1}}</span></div>
                <div><span>{{wdDate(1)}}</span></div>
              </div>
              <div>
                <p @click="clickInput(wplanDreviewVerifiedOpinio(2),'管理者意见')">{{wplanDreviewVerifiedOpinio(2)}}</p>
                <div><span>{{wverifiedUserName2}}</span></div>
                <div><span>{{wdDate(1)}}</span></div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      
     
      <!-- 弹出日期插件 -->
      <van-popup v-model="show" position="bottom" :style="{ height: '70%' }">
        <div>
          <calendar v-model="calendarShow"></calendar>
          <inlineCalendar @change="handelChange" :defaultDate="defaultDate" ref="popDate"/>
        </div>
      </van-popup>
      <div class="but_b" v-on:click.stop="butSubmit($event)" 
        v-if="butisShow()"
      >
        <van-button plain type="primary"> 提交</van-button>
        <van-button type="info">保存</van-button>
        <van-button @click.stop="toTravelPlan($event)">出差/招待计划</van-button>
      </div>
      <div class="but_b" v-on:click.stop="butSubmit($event)" 
        v-if="(dstatus == 3 && h3Active == 2)"
      >
        <van-button plain type="primary">提交</van-button>
        <van-button type="info">保存</van-button>
        <van-button @click.stop="toTravelPlan($event)">出差/招待回顾</van-button>
      </div>
      <div class="but_b" v-if="(wstatus == 2 && h3Active == 1)">
        <van-button plain type="primary" @click.stop="withdraw" style="width:100%;background: #4B77AF;color: #fff;">撤回</van-button>
        <!-- <button class="withdraw" >撤回</button> -->
      </div>
      <div class="but_b" v-if="(dstatus == 4 && h3Active == 2)">
        <van-button plain type="primary" @click.stop="withdraw" style="width:100%;background: #4B77AF;color: #fff;">撤回</van-button>
        <!-- <button class="withdraw" @click="withdraw">撤回</button> -->
      </div>


      <!-- 弹出层 -->
      <van-popup v-model="popupShow" style="padding:10px;width:100%;height:100%;" @click="()=>{this.popupShow = false;}">
        <!-- <div id="myPopup"> -->
          <ul class="main" style="padding:15px;">
            <li >
              <div class="title">
                <span>{{popupTitle}}</span>
              </div>
              <div class="" style="font-size:16px;font-weight:400;color:rgba(72,72,72,1);line-height:18px; word-wrap: break-word;word-break: break-all;overflow: hidden;">
                {{popupText}}
              </div>
              
            </li>
            <div style="text-align:right;">{{popupName}}</div>
            <div style="text-align:right;">{{popupDate}}</div>
          </ul>

        <!-- </div> -->
        
      </van-popup>
      <!-- 遮罩层 用于加载 -->
      <van-popup v-model="overlayShow" :style="{ height: '20%',width:'35%' }" :close-on-click-overlay="false" round>
        <div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;flex-flow:row wrap;">
          <van-loading type="spinner" vertical>
            加载中……
          </van-loading>
        </div>

      </van-popup>




      
    </div>
    
  </div>
</template>

<script>
import axios from 'axios';
import { CellGroup,Dialog } from 'vant';
import moment from "moment";
import Cookie from '@/apis/cookie';
export default {
  name: "workplan",
  data() {
    return {
      isFocusType:false, // 判断所有输入框是否聚焦
      adAcount:'', // 当前用户的adAcount
      initialScoll:null, //填写列表距离顶部的距离
      firstRows:4, // 头部框所占行数

      thisName:localStorage.getItem('personName'),
      zhaodaiImgSrc:require("../../../static/imgs/zhaodai.svg"),
      zhaodaiImgGSrc:require("../../../static/imgs/zhaodai-zhihui.svg"),
      chuchaiImgSrc:require("../../../static/imgs/chuchai.svg"),
      chuchaiImgGSrc:require("../../../static/imgs/chuchai-zhihui.svg"),
      required: false, // 表单效验
      visitNumber:0, //拜访次数
      imgSrc:require("../../../static/imgs/visit.png"), // 拜访次数的icon

      isFocus:true, // 判断回顾输入框是否已聚焦过

      textLength:1000, // 输入框的可输入最大字符长度

      overlayShowTime:null, //login的计时器
      overlayShow:false, // 遮罩层状态

      onceStr:'未填写',
      dreviewVerifiedOpinionArr:[], // 领导审核回顾意见列表

      // 弹出层状态
      popupObj:{}, // 弹出层展示数据
      popupShow:false,
      popupText:'',
      popupTitle:'',
      popupName:'',
      popupDate:'',


      // 轮播图
      move:null,
      startX:null,
      moveDire:'',

      // 同事圈 start
      colleagueCircleRespList:[], // 当前用户的下级
      superiorName:'', // 当前用户的上级
      colleagueSearchList:[], // 搜索获得的数据
      concernList:[], // 关注的同事列表
      // 同事圈 end

      active:1,
      viewShow:"review", //顶部导航切换状态
      // review 界面的数据
      selected:"",
      weekArrNull:[
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        
      ],
      weekArr:[
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        {
          "date":'',
          disabledUp:false, // 是否可编辑 
          disabledDown:false, // 是否可编辑
          dworkPlanDesAm:'', // 当日上午的工作计划
          dworkPlanDesPm:'', // 当日下午的工作计划
        },
        
      ],
      year:null,
      numberOfWeeks:1, // 当前周数
      numberOfWeeksNow:1, // 当前周数
      wworkPlanDes:'', // 周计划
      wworkReviewDes:'', // 周回顾
      startDate: null,
      endDate:null,
      // 弹出日期选择框的状态
      show:false, // 决定日期组件的显示与否
      calendarShow:false,
      defaultDate: new Date(), 
      newDate: new Date(), // 当前最新的

      h3Active:1, // 标题“工作计划”被选中的状态
      subDisabled:true, //提交按钮是否可提交

      wid:null,
      did:null,
      wstatus:1,  // 计划状态
      dstatus:null, //回顾状态
      wplanVerifiedOpinion1:'', // 管理者 计划意见1
      wverifiedUserName1:'', // 管理者1
      wplanVerifiedOpinion2:'', // 管理者 计划意见2
      wverifiedUserName2:'', // 管理者2
      wplanVerifiedDate1:'',
      wplanVerifiedDate2:'',

      dreviewVerifiedOpinion1:'', // 管理者 回顾意见1
      dreviewVerifiedOpinion2:'', // 管理者 回顾意见2
      dreviewVerifiedDate1:'',
      dreviewVerifiedDate2:'',

      dverifiedUserName1:'',
      dverifiedUserName2:'',

      // #search 搜索块数据
      focus:false,
      searchText:'',
      // transpond界面的状态
      transpondList:[1,2,3,4],
      // colleague界面的数据
      activeNames: ['1'],
    };
  },
  created() {
    this.dateFormat();
    this.createDate();
    this.numberOfWeeksNow = this.getWeekOfYear(); // 缓存当前周数
    document.title = '计划与回顾'
   
  },
  mounted(){
    this.initialScoll = this.$refs.list.offsetTop; // 获取页面初始化top
    // this.initialScoll = this.$refs.list.style.top; // 获取页面初始化top

    let obj = this.$route.query;
    this.adAcount = obj.adAcount?obj.adAcount:Cookie.cookie.get("accountName");
    this.did = obj.did;
    if(obj.planReviewStatus == 1){
      this.h3Active = 1;
      this.numberOfWeeks = obj.numberOfWeeks?obj.numberOfWeeks:this.numberOfWeeks + 1;
    }else if(obj.planReviewStatus == 2){
      this.h3Active = 2;
      this.numberOfWeeks = obj.numberOfWeeks?obj.numberOfWeeks:this.numberOfWeeks;
    }

    this.showBtripServe(); // 查询出差和招待的图标
  },
  
  updated(){
    // this.listPosition();
  },
  methods: {
    firstFocus(){ // 头部输入框聚焦事件
      this.firstRows = 4;
      this.$refs.list.style.top = this.initialScoll + 'px';
    },
    listScroll(){ // 滚动事件
      // this.$refs.first.style.display = 'block';
      if(!this.isFocusType){
        this.$refs.list.style.top = this.initialScoll - 40 +'px';
        this.firstRows = 1;
      }
    },
    showBtripServe(){ // 决定展示计划和招待的图标
      let data = {
        "endDate": this.endDate,
        "queryType": this.h3Active,
        "startDate": this.startDate
      }
      this.$getData.queryHomeDataForPerson({
        method:'post',
        data
      }).then(res => {
        if(res.code == 200 && res.msg == 'success'){
          let { entertain,trip } = res.data;
          
          this.weekArr.map(el =>{
            entertain.length <= 0?el.isEntertain = false:entertain.map((item)=>{ // 招待
              if(item.itemDate == el.dateAll){
                if(item.num != 0){
                  el.isEntertain = item.status;
                  el.imgEntertainId = item.id;
                  el.approvalEntertainStatus = item.approvalStatus;
                }else{
                  el.isEntertain = false;
                }
              }
            })
            trip.length <= 0?el.isTrip = false:trip.map((item)=>{ // 出差
              if(item.itemDate == el.dateAll ){
                if(item.num != 0){
                  el.imgTripId = item.id;
                  el.isTrip = item.status;
                  el.approvalTripStatus = item.approvalStatus;
                }else{
                  el.isTrip = false;
                }
              }
            })

          })
          this.$forceUpdate();
        }
      })
    },
    toTravelPlan(e){ // 跳转到出差计划 或 回顾
      switch(e.target.innerText){
        case '出差/招待计划':
          this.$router.push({ 
            path:'/travelPlan',
            query:{ 
              weekNum:this.numberOfWeeks,
              year:this.year,
              startDate: this.startDate,
              id:null
            } 
          
          });
          break;
        case '出差/招待回顾':
          this.$router.push({
            path:'/travelReview',
            query:{
              weekNum:this.numberOfWeeks,
              year:this.year,
              startDate: this.startDate,
              id:null,
            }
          });
          break;
      }
    },

    fieldFocus(e){ // 输入框聚焦事件
      if(e.type == 'focus'){
        e.target.rows = 6;
        this.$refs.list.style.top = '0px';
        this.$refs.first.style.display = 'none';
        this.isFocusType = true;
      }else if(e.type == 'blur'){
        this.firstRows = 4;
        e.target.rows = 3;
        this.$refs.list.style.top = this.initialScoll + 'px';
        this.$refs.first.style.display = 'block';
        this.isFocusType = false;
      }
    },
    listPosition(){ // 页面锚点定位
      this.$forceUpdate();
      if(this.h3Active == 1){
        this.$el.querySelector('#tabDiv>.list').scrollTop = 0;
      }else if(this.h3Active == 2){
        // this.dstatus == 3 &&
        if(this.numberOfWeeks == this.numberOfWeeksNow &&  this.newDate.getDay()!=5){
          let i = null;
          let arr = JSON.parse(JSON.stringify(this.weekArr));
          this.weekArr.map((item,index)=>{
            var it = JSON.parse(JSON.stringify(this.weekArr[index]));
            if(this.weekArr[index].dateAll == moment(this.newDate).format('YYYY-MM-DD')){
              i = index;
              return index;
            }
          })
          let dom = this.$el.querySelector(`#tabDiv>.list>ul.main>li:nth-of-type(${i+1})`)
          this.$el.querySelector('#tabDiv>.list').scrollTop = dom.offsetTop;
        }
      }
    },
    getWorkDay(){ // 查询用户某周的请假和节假日
      let data = {
        "endDate": moment(this.endDate).format(),
        "startDate": moment(this.startDate).format(),
        "wweekNum": this.numberOfWeeks.toString(),
        "wyear": this.year.toString()
      }
      this.$getData.getWorkDay({
        method:'post',
        data
      }).then(res =>{
        if(res.code == 200 && res.msg == 'success'){
          let dataArr = res.data;
          this.weekArr.map((item,index)=>{
            dataArr.map((value)=>{
              let date = moment(value.nowDate).format('YYYY-MM-DD');
              if(item.dateAll == date){
                switch(value.time){
                  case '全天':
                    item.disabledUp = value.leaveType;
                    item.disabledDown = value.leaveType;
                    break;
                  case '上午':
                    item.disabledUp = value.leaveType;
                    break;
                  case '下午':
                    item.disabledDown = value.leaveType;
                    break;
                }
              }

            })
          })
        }else{
          this.visitNumber = 0;
        }
      })
    },
    toVisitorlist(){ // 跳转到访客记录界面
      let query = {
        startTime:this.startDate,
        endTime:this.endDate,
        modelType:10
      };
      this.$router.push({ path: "/visitorlist", query });
    },
    getVisitorCount(){ // 获取访客记录
      this.$getData.getVisitorCount({
        method:'post',
        data:{
          startTime:this.startDate,
          endTime:this.endDate  
        }
      }).then(res =>{
        if(res.code == 200 && res.msg == 'success'){
          this.visitNumber = res.data.visitorCount;
        }else{
          this.visitNumber = 0;
        }
      })
    },
    onFocus(i){ // 输入框聚焦 触发同步工作计划      
      if(this.isFocus && Cookie.cookie.get('isFocus') != this.weekArr[i].dateAll){
        this.isFocus = false;
        Cookie.cookie.set('isFocus',this.weekArr[i].dateAll,60*60*24);
        Dialog.confirm({
          message: '确定将当日计划内容同步到回顾吗？'
        }).then(() => {
          this.$set(this.weekArr[i],"dworkReviewDesPm",this.weekArr[i].dworkPlanDesPm);
          this.$set(this.weekArr[i],"dworkReviewDesAm",this.weekArr[i].dworkPlanDesAm);
          this.$forceUpdate();
          // this.weekArr[i].dworkReviewDesPm = this.weekArr[i].dworkPlanDesPm;
          // this.weekArr[i].dworkReviewDesAm = this.weekArr[i].dworkPlanDesAm; // 当日上午的工作计划
        }).catch(() => {
        });;
      }
    },

    butisShow(){ // 判断计划的提交保存按钮是否展示
      return this.wstatus == 1 && this.h3Active == 1 && (this.numberOfWeeks>=this.numberOfWeeksNow && this.numberOfWeeks<=(this.numberOfWeeksNow+2)  )   ;
    },

    clickInput(txt,title,name,date){ // 点击输入框展示内容

      this.popupText = txt;
      this.popupTitle = title;
      this.popupName = name;
      this.popupDate = date;
      if(this.popupText && this.popupText.length > 0){
        this.popupShow = true;
      }
    },
    weekDay(str){ // 处理当前为星期几
      let s = '';
      switch(str){
        case 'Monday': s = '一'; break;
        case 'Tuesday': s = '二'; break;
        case 'Wednesday': s = '三'; break;
        case 'Thursday': s = '四'; break;
        case 'Friday': s = '五'; break;
        case 'Saturday': s = '六'; break;
        case 'Sunday': s = '日'; break;
      }
      return '星期' + s;
    },
    wdDate(i,date){ // 展示审阅的日期
      var str;
      if(date){
        var weekDay = moment(date).format('dddd');
        return moment(date).format('YYYY-MM-DD HH:mm:ss') + " " + this.weekDay(weekDay);
      }
      if(this.h3Active == 1){
        var weekDay = moment(this['wplanVerifiedDate'+i]).format('dddd');
        return moment(this['wplanVerifiedDate'+i]).format('YYYY-MM-DD HH:mm:ss') + " " + this.weekDay(weekDay);

      }else if(this.h3Active == 2){
        var weekDay = moment(this['dreviewVerifiedDate'+i]).format('dddd');
        return moment(this['dreviewVerifiedDate'+i]).format('YYYY-MM-DD HH:mm:ss') + " " + this.weekDay(weekDay);
      }
    },
    wplanDreviewVerifiedOpinio:function(i){ // 决定显示审核内容
      if(this.h3Active == 1){
        return this['wplanVerifiedOpinion'+i];
      }else if(this.h3Active == 2){
        return this['dreviewVerifiedOpinion'+i];
      }
    },
    placeholderReviewShow:function(item){ // 决定回顾的提示信息
      
      if(this.newDate.format('yyyy-MM-dd') == item.dateAll && this.h3Active == 2 && this.dstatus == 3 ){
        return '请填写工作回顾';
      }else if( new Date(item.dateAll).getTime() > this.newDate.getTime() && this.h3Active == 2 && this.dstatus == 3 && this.wstatus == 3){
        return '未到回顾时间';
      }else if( new Date(item.dateAll).getTime() < this.newDate.getTime() && this.h3Active == 2){
        return '未填写';
      }else if(this.wstatus == 1 && this.h3Active == 2 && new Date(item.dateAll).getTime() < this.newDate.getTime()){
        return '未填写'
      }else if(new Date(item.dateAll).getTime() > this.newDate.getTime() && this.h3Active == 2 && this.wstatus <= 3){
        return '请先完成本周工作计划';
      }
      // !disabledReview(item) ? '请填写工作回顾！' : ''
    },
    disabledReview:function(item){ // 决定非当日不能填写 回顾
      return !(this.newDate.format('yyyy-MM-dd') == item.dateAll) || ( this.h3Active == 2 && this.dstatus != 3 ) ;
    },
    // 轮播方法start
    start(e){
      this.startX = e.touches[0].clientX;
      e.currentTarget.style.left = '0%';
      this.move = '';
    },
    moveFn(e){
      let endX = e.changedTouches[0].clientX;
      if((endX - this.startX) < -150){ // 向左划
        e.currentTarget.style.left = '100%';
        this.moveDire = 'moveLeft';
      }else if((endX - this.startX) > 150){ // 向右划
        e.currentTarget.style.left = '-100%';
        this.moveDire = 'moveRight';
      }
    },
    end(e){
      this.move = this.moveDire;
      if(this.move == 'moveLeft'){
        this.workReviewClick();
      }else if(this.move == 'moveRight'){
        this.workPlanClick();
      }
      this.moveDire = '';

    },
    // 轮播方法 end

    clearView(){ // 清除当前界面的数据
      this.wworkPlanDes = '';
      this.wworkReviewDes = '';
      this.weekArr = JSON.parse(JSON.stringify(this.weekArrNull));
      this.wstatus = 1;
      this.dstatus = 1;
      this.dreviewVerifiedOpinionArr = [];
      this.getWorkDay();
      this.showBtripServe();
    },
    workReviewClick(){ // 工作回顾点击按钮
      if(this.h3Active == 1){
        this.h3Active = 2;
      }else if(this.h3Active == 2){
        this.dateRight();
        this.h3Active = 1;
      }
    },
    workPlanClick(){ // 工作计划点击按钮
      if(this.h3Active == 2){
        this.h3Active = 1;
      }else if(this.h3Active == 1){
        this.dateLeft();
        this.h3Active = 2;
      }
    },
    // 接口方法 start
    revokeWeekWorkReview(){ // 撤回工作回顾
      this.$dialog.confirm({
        title: '工作回顾',
        message: '是否撤回工作回顾？'
      }).then(() => {
        this.$getData.revokeWeekWorkReview({
          method:'post',
          data:{
            "did": this.did
          }
        }).then(res => {
          this.subDisabled = true;
          if(res.code == 200 && res.msg == 'success'){
            this.dstatus = 3;
            this.myNotify('撤回成功');
            _this.showBtripServe(); // 撤回成功后再查询一次图标
          }
        })
      }).catch(() => {
        // on cancel
      });
      
    },
    submitWeekWorkReview(data){ // 提交工作回顾
      this.$dialog.confirm({
        title: '工作回顾',
        message: '是否提交工作回顾？'
      }).then(() => {
        this.$getData.submitWeekWorkReview({
          method:'post',
          data
        }).then( res => {
          if(res.code == 200 && res.msg == "success"){
            this.subDisabled = true;
            this.myNotify('回顾提交成功');
            // this.wstatus = 4;
            this.dstatus = 4;
          }else if(res.code == -1 && res.msg == "当前日期无工作计划"){
            this.myNotify('当前日期无工作计划');
          }
        })
      }).catch(() => {
        // on cancel
      });
      
    },
    addWeekWorkReview(data){ // 保存工作回顾
      this.$dialog.confirm({
        title: '工作回顾',
        message: '是否保存工作回顾？'
      }).then(() => {
        this.$getData.addWeekWorkReview({
          method:'post',
          data
        }).then( res => {
          if(res.code == 200 && res.msg == "success"){
            this.subDisabled = true;
            this.myNotify('回顾保存成功');
          }else if(res.code == -1 && res.msg == "当前日期无工作计划"){
            this.myNotify('当前日期无工作计划');
          }
        })
      }).catch(() => {
        // on cancel
      });
      
    },
    toRecord(){ // 跳转操作记录界面
      this.$router.push({ path: '/record', query: {  
        data: {
          "endDate": this.endDate + 'T24:00:00.000Z',
          // "endDate": new Date(2019,9,14,0,0,0),
          "startDate": this.startDate + 'T00:00:00.000Z'
          // "startDate": new Date(2019,9,20,23,59,59)
        }
      }})
    },
    myNotify(str){ // 提示框方法
      this.$notify({
        message: str,
        duration: 2000,
        className: 'myNotify'
      });
    },

    withdraw(){ // 撤回按钮总方法
      this.subDisabled = false;
      if(this.h3Active == 1){
        this.revokeWeekWorkPlan();
      }else if(this.h3Active == 2){
        this.revokeWeekWorkReview();
      }
    },
    revokeWeekWorkPlan(){ // 撤回工作计划
      var _this = this;
      this.$dialog.confirm({
        title: '工作计划',
        message: '是否撤回工作计划？'
      }).then(() => {
        this.$getData.revokeWeekWorkPlan({
          method:'post',
          data:{
            "wid": this.wid,
            "wweekNum": this.numberOfWeeks.toString(),
            "wyear": this.year.toString()
          }
        }).then(res => {
          this.subDisabled = true;
          if(res.code == 200 && res.msg == 'success'){
            this.wstatus = 1;
            this.myNotify('撤回成功');
            _this.selOneWeekPlan();
            _this.showBtripServe(); // 撤回成功后再查询一次图标
          }
        })
      }).catch(() => {
        // on cancel
      });

      
    },
    butSubmit(e){ // 提交和保存的事件委托
      let data = {
        "wweekNum": this.numberOfWeeks.toString(),
        "wyear": this.year.toString(),
      }
      if(this.h3Active == 1){
        if(!this.wworkPlanReviewDes){
          // this.myNotify('周工作计划为必填项！');
          this.required = true;
          return;
        }else{
          this.required = false;
        }
        data = { ...data,
          "oneDayPlanList": [{},{},{},{},{},{},{}],
          "wworkPlanDes": this.wworkPlanReviewDes,
          "wendDate": this.endDate,
          "wstartDate": this.startDate,
        }
        let obj = {};
        this.weekArr.map(function(item,index){
          let i = index == 6? 0 : index + 1;
          obj = {
            "dworkPlanDate": item.dateAll,
            "dworkPlanDesAm": item.dworkPlanDesAm,
            "dworkPlanDesPm": item.dworkPlanDesPm
          }
          if(item.did){
            obj.did = item.did;
          }
          data.oneDayPlanList[i] = obj;
        })
      }else if(this.h3Active == 2){
        if(!this.wworkPlanReviewDes && new Date().getDay() == 5){
          // this.myNotify('周回顾为必填项！');
          this.required = true;
          return;
        }else{
          this.required = false;
        }
        var arr = this.weekArr[4];
        let _this = this;
        this.weekArr.map(function(item){
          if(item.dateAll == _this.newDate.format('yyyy-MM-dd')){
            arr = item;
          }
        });
        if(!arr.dworkReviewDesAm && !arr.dworkReviewDesPm){
          this.myNotify('回顾至少填一项！');
          return;
        }
        data = { ...data,
          "oneDayReviewReq": {
            "dworkReviewDesAm": arr.dworkReviewDesAm,
            "dworkReviewDesPm": arr.dworkReviewDesPm
          },
          "wworkReviewDes": this.wworkPlanReviewDes,
        }
        if(arr.did){
          data.oneDayReviewReq.did = arr.did;
          this.did = arr.did;
        }
      }
      if(this.wid){
        data.wid = this.wid;
      }
      if(this.subDisabled){
      }
      
      this.subDisabled = false;
      switch(e.target.innerText){
        case '保存':
          if(this.h3Active == 1){
            this.addWeekWorkPlan(data);
          }else if(this.h3Active == 2){
            this.addWeekWorkReview(data);
          }
          break;
        case '提交':
          if(this.h3Active == 1){
            this.subDisabled = false;
            this.submitWeekWorkPlan(data);
          }else if(this.h3Active == 2){
            this.subDisabled = false;
            this.submitWeekWorkReview(data);
          }
          break;
      }
    },
    submitWeekWorkPlan(data){ // 提交 计划
      this.$dialog.confirm({
        title: '工作计划',
        message: '确认提交工作计划吗？'
      }).then(() => {
        this.overlayShow = true;
        this.$getData.submitWeekWorkPlan({
          method:'post',
          data
        }).then( res =>{
          this.overlayShow = false; // 加载中的状态
          this.subDisabled = true;
          if(res.code == 200){
            this.wstatus = 2;
            this.wid = res.msg;
            this.myNotify('计划提交成功');
          }
        }).catch(error => {
          // this.wstatus = 2;
          this.subDisabled = true;
        })
      }).catch(() => {
        // on cancel
      });
      
    },
    addWeekWorkPlan(data){ //保存 计划
      var _this = this;
      this.$dialog.confirm({
        title: '工作计划',
        message: '确认保存吗？'
      }).then(() => {
        this.overlayShow = true;
        this.$getData.addWeekWorkPlan({
          method:'post',
          data
        }).then(res => {
          this.overlayShow = false; // 加载中的状态
          this.subDisabled = true;
          if(res.code == 200){
            this.myNotify('计划保存成功',res.data);
            _this.selOneWeekPlan(); // 保存成功后再次查询数据
            _this.showBtripServe(); // 再次查询图标数据
          }
        }).catch(err => {
          this.subDisabled = true;
        })
      }).catch(() => {
      });
      
    },
    selOneWeekPlan(){ // 查询某周的计划 和 回顾
      let wweekNum = this.numberOfWeeks
      let wyear = this.year;
      this.overlayShow = true;

      // 清楚数据缓存 start
      this.clearView();
      // end
      this.$getData.selOneWeekPlan({
        method:'post',
        data:{
          "wweekNum": wweekNum.toString(),
          "wyear": wyear.toString()
        }
      }).then(res => {
        // 将加载中隐藏
        this.overlayShow = false;
        if(res.code == 200 && res.data){
          let data = res.data;
          this.wworkPlanDes = data.wworkPlanDes;
          this.wworkReviewDes = data.wworkReviewDes;
          this.wid = data.wid;
          this.wstatus = data.wstatus;
          this.adAcount = data.adAcount;// 新增 保存adAcount
          if(data.wstatus >= 3){
            this.wplanVerifiedOpinion1 = data.wplanVerifiedOpinion1;
            this.wverifiedUserName1 = data.wverifiedUserName1;
            this.wplanVerifiedOpinion2 = data.wplanVerifiedOpinion2;
            this.wverifiedUserName2 = data.wverifiedUserName2;

            this.wplanVerifiedDate1 = data.wplanVerifiedDate1 ;
            this.wplanVerifiedDate2 = data.wplanVerifiedDate2 ;
          }
          data.workPlanDayList.map((item,index) => {
            let i = index == 0? this.weekArr.length - 1 : index - 1;
            this.weekArr[i].did = item.did;
            this.weekArr[i].dworkPlanDesPm = item.dworkPlanDesPm;
            this.weekArr[i].dworkPlanDesAm = item.dworkPlanDesAm; // 当日上午的工作计划
            this.weekArr[i].dworkReviewDesAm = item.dworkReviewDesAm;
            this.weekArr[i].dworkReviewDesPm = item.dworkReviewDesPm; 
            if(item.dworkPlanDate == this.newDate.format('yyyy-MM-dd')){
              this.did = item.did;
              this.dstatus = item.dstatus;
              this.dreviewVerifiedOpinion1 = item.dreviewVerifiedOpinion1;
              this.dreviewVerifiedOpinion2 = item.dreviewVerifiedOpinion2;
              this.dreviewVerifiedDate1 = item.dreviewVerifiedDate1;
              this.dreviewVerifiedDate2 = item.dreviewVerifiedDate2;
              this.dverifiedUserName1 = item.dverifiedUserName1;
              this.dverifiedUserName2 = item.dverifiedUserName2;
            }
            if(item.dreviewVerifiedOpinion1){
              let verifObj = {
                dreviewVerifiedOpinion1 : item.dreviewVerifiedOpinion1,
                dreviewVerifiedOpinion2 : item.dreviewVerifiedOpinion2,
                dreviewVerifiedDate1 : item.dreviewVerifiedDate1,
                dreviewVerifiedDate2 : item.dreviewVerifiedDate2,
                dverifiedUserName1 : item.dverifiedUserName1,
                dverifiedUserName2 : item.dverifiedUserName2,
              }
              this.dreviewVerifiedOpinionArr.push(verifObj);
            }
          });
        }else{
          this.clearView();
        }
      })

    },
    // 接口方法 end

    handelChange(date){
      console.log('date',date.$d);
      this.getWeekOfYear(date.$d);
    },
    dateFormat(){ // date格式处理函数
      Date.prototype.format = function (fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
        
      }

    },
    dateRight(){ // 日期下一周按钮事件
      // this.getXDate(this.year,this.numberOfWeeks);
      this.numberOfWeeks++;
    },
    dateLeft(){ // 日期上一周按钮事件
      this.numberOfWeeks--;
    },
    optionDate(){ // 控制日期弹出组件的状态
      this.show = true;
      this.calendarShow = true;
    },

    headerUlClick(e){ // 顶部菜单切换
      switch(e.target.innerHTML){
        case "计划与回顾":
          this.active = 1;
          this.viewShow = "review";
          break;
        case "同事圈":
          this.active = 2;
          this.viewShow = "colleague";
          break;
        case "转发":
          this.active = 3;
          this.viewShow = "transpond";
          break;
      }
    },
    createDate(){ // 获取当前年
      var date = new Date();
      this.year = date.getFullYear();
    },
    getWeekOfYear(date){ // 返回当前是第几周
      var today;
      if(date){
        today = date;
      }else{
        today = new Date();
      }
      var year = today.getFullYear(); //获取选中的当前年
      var firstDay = new Date(year,0, 1);
      var dayOfWeek = firstDay.getDay();  //返回表示星期几的数字 0~6
      var spendDay= 1;
      if (dayOfWeek !=1 && dayOfWeek != 0) {
        spendDay=7-dayOfWeek+1+1;
      }else if(dayOfWeek == 0){
        spendDay = 2;
      }
      firstDay = new Date(year,0, spendDay); // 一年中第一周的开始时间 2019-01-07
      console.log(firstDay.format('yyyy-MM-dd') );
      console.log(today.format('yyyy-MM-dd') );
      // firstDay = new Date(today.getFullYear(),0, 1+spendDay);
      var d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);  // 计算时间差 向上取整
      var result;
      if(d == 0){
        result = 1;
      }else if(d < 0){
        result = -1;
        var _week;
        year --;
        var date = new Date(year,"0","1");
        _week = date.getDay();
        if(_week!=1){ // 一年53周的情况
          result = 52;       // 应该为53周 2018 1
        }else{//一年54周情况
          result = 53;       // 52 
        }
      }else if(d % 7 == 0){
        // result = Math.ceil(d/7) ;
        result = d/7 + 1; // 最新版本 保证周一为本周
      }else{
        result = (Math.ceil(d/7) == 0) ? 1 : Math.ceil(d/7);
        // result = Math.ceil(d/7) + 1;
      }
      this.year = year;
      this.numberOfWeeks = result;
      return result;
    },
    
  },
  computed:{
    placeholderPlanShow:function(){ // 决定当日计划的提示信息
      if(this.wstatus == 1 && this.butisShow()){
        return '请填写当日工作计划';
      }else if( (this.numberOfWeeks>=this.numberOfWeeksNow && this.numberOfWeeks<=(this.numberOfWeeksNow+3)) && this.h3Active == 1 && this.wstatus != 1 ){
        return '未填写';
      }
    },
    placeholderShow:function(){ // 决定周计划和回顾的提示信息
      if(!((this.wstatus != 1 && this.h3Active == 1) || ( this.h3Active == 2 && this.dstatus != 3 ))){
        if( this.h3Active == 1 && this.butisShow()){
          return '请填写本周重点工作';
        }else if(this.h3Active == 2){
          return '请填写本周总结报告';
        }
      }else if(this.h3Active == 2 && this.wstatus == 3 && this.numberOfWeeks > this.numberOfWeeksNow){
        return '未到回顾时间';
      }else if(this.h3Active == 2 && this.dstatus > 3){
        return '未填写';
      }else if(this.h3Active == 2 && this.numberOfWeeksNow > this.numberOfWeeks){
        return '未填写';
      }else if(this.h3Active == 2 && this.numberOfWeeksNow < this.numberOfWeeks && this.wstatus < 3){
        return '请先完成本周工作计划';
      }else{
        return '';
      }
    },
    lastNumberOfweeks:function(){ // 上一周展示按钮
      var last = this.numberOfWeeks - 1;
      if(last<1){
        var year = this.year;
        var date = new Date(year-1,"0","1");
        var _week = date.getDay();
        if(_week!=1){ // 一年53周的情况
          last = 52;       // 应该为53周 2018 1
        }else{//一年54周情况
          last = 53;       // 52 
        }
      }
      return last;

      var _week;
      var year = this.year;
      var date = new Date(year,"0","1");
      
      if(this.numberOfWeeks < 1){
        this.year--;
        var time = date.getTime();
        _week = date.getDay();
        
      }else{
        if(_week!=1){ // 一年52周的情况
          if(this.numberOfWeeks > 52){
            this.year ++;
            this.numberOfWeeks = 1;
            var date = new Date(this.year,"0","1");
            var time = date.getTime();
            _week = date.getDay();
          }
        }else{//一年53周情况
          if(this.numberOfWeeks > 53){
            this.year ++;
            this.numberOfWeeks = 1;
            var date = new Date(this.year,"0","1");
            var time = date.getTime();
            _week = date.getDay();
          }
        }
      }


    },
    nextNumberOfWeeks:function(){ // 下一周展示按钮
      var next = parseInt(this.numberOfWeeks) + 1
      var year = this.year;
      var date = new Date(year+1,"0","1");
      var _week = date.getDay();

      if(_week!=1){ // 一年52周的情况
        if(next > 52){
          next = 1;
        }
      }else{//一年53周情况
        if(next > 53){
          next = 1;
        }
      }
      return next;
    },
    // wplanVerifiedOpinion dreviewVerifiedOpinion
    
    wworkPlanReviewDes:{ // 展示周计划 或 回顾
      set: function (newValue) {
        newValue = newValue.replace(/(^\s*)|(\s*$)/g, "");
        if(this.h3Active == 1){
          this.wworkPlanDes = newValue;
        }else if(this.h3Active == 2){
          this.wworkReviewDes = newValue;
        }
      },
      get:function(){
        if(this.h3Active == 1){
          return this.wworkPlanDes;
        }else if(this.h3Active == 2){
          return this.wworkReviewDes;
        }
      }
      
    },
    getXDate:function(){ // 根据周数获取当前周的日期范围
      var _week;
      if(!this.year){
        return '';
      }
      var year = this.year;
      var date = new Date(year,"0","1");
      var time = date.getTime();
      _week = date.getDay();
      if(this.numberOfWeeks < 1){
        this.year--;
        // let _week0 = new Date(this.year,"0","1").getDay();

        var date = new Date(this.year,"0","1");
        var time = date.getTime();
        _week = date.getDay();
        // date = new Date(this.year,"0","1");
        // _week = date.getDay();
        if(_week!=1){ // 一年53周的情况
          this.numberOfWeeks = 52;       // 应该为53周 2018 1
        }else{//一年54周情况
          this.numberOfWeeks = 53;       // 52 
        }
      }else{
        // var _week0 = new Date((this.year-1),"0","1").getDay();
        if(_week!=1){ // 一年52周的情况
          if(this.numberOfWeeks > 52){
            this.year ++;
            this.numberOfWeeks = 1;
            var date = new Date(this.year,"0","1");
            var time = date.getTime();
            _week = date.getDay();
          }
        }else{//一年54周情况
          if(this.numberOfWeeks > 53){
            this.year ++;
            this.numberOfWeeks = 1;
            var date = new Date(this.year,"0","1");
            var time = date.getTime();
            _week = date.getDay();
          }
        }
      }
      // 当这一年的1月1日为周日时则本年有54周，否则没有54周，没有则去除第54周的提示
      var cnt = 0; // 获取距离周末的天数
      switch(_week){
        case 2:
          cnt = 5;
          break;
        case 3:
          cnt = 4;
          break;
        case 4:
          cnt = 3;
          break;
        case 5:
          cnt = 2;
          break;
        case 6:
          cnt = 1;
          break;
      }
      if(_week == 1){
        cnt = 0;
      }else{
        cnt += 1;//加1表示以星期一为一周的第一天
      }
      var _start = date.format("MM月dd日");
      // 将这个长整形时间加上第N周的时间偏移
      time += cnt*24*3600000; //第1周开始时间
      var nextYear = new Date(parseInt(year,10)+1,"0","1"); // parseInt(str,10) 10进制解析字符串
      var nextWeek = nextYear.getDay();
      var lastcnt = 0;//获取最后一周开始时间到周末的天数
      switch(nextWeek){
        case 0:
          cnt = 6;
          break;
        case 1:
          cnt = 0;
          break;
        case 2:
          cnt = 1;
          break;
        case 3:
          cnt = 2;
          break;
        case 4:
          cnt = 3;
          break;
        case 5:
          cnt = 4;
          break;
        case 6:
          cnt = 5;
          break;
      }
      
      date.setTime(time);
      // var _start = date.format("MM-dd");
      var start = time+(this.numberOfWeeks-1)*7*24*3600000; //第n周开始时间
      date.setTime(start);
      this.startDate = date.format('yyyy-MM-dd');
      var _start = date.format("MM-dd");
      // var arr = [];
      // arr.push(date.getDate());
      this.weekArr[0].date = date.getDate();
      this.weekArr[0].dateAll = date.format("yyyy-MM-dd");
      this.weekArrNull[0].dateAll = date.format("yyyy-MM-dd");
      for(var i = 1;i<=6;i++){
        start += 24*3600000;
        date.setTime(start);
        // arr.push(date.getDate());
        this.weekArr[i].date = date.getDate();
        this.weekArr[i].dateAll = date.format("yyyy-MM-dd");
        this.weekArrNull[i].dateAll = date.format("yyyy-MM-dd");
      }
      // this.weekArr = arr;
      var end = start;
      var end = time+(this.numberOfWeeks)*7*24*3600000- 24*3600000; //第n周结束时间
      // var end = time+(this.numberOfWeeks*7 - 1)*24*3600000- 24*3600000; //第n周结束时间
      // 为日期对象 date 重新设置成时间 time
      date.setTime(end);
      this.endDate = date.format('yyyy-MM-dd');
      var _end = date.format("MM-dd");

      return _start +'至'+ _end;
    },
    fontChange:function(){ // 根据索引决定星期几
      return function (i){
        switch(i){
          case 0:
            return "一";
          case 1:
            return "二";
          case 2:
            return "三";
          case 3:
            return "四";
          case 4:
            return "五";
          case 5:
            return "六";
          case 6:
            return "日";
        }
      }
    },
    h3ActiveS:{ // h3Active 的特殊算法
      set: function (newValue) {
        this.h3Active = newValue;
      },
      get:function(){
        if(this.h3Active == 0){
          this.h3Active = 2
        }else if(this.h3Active == 3){
          this.h3Active = 1;
        }
        return this.h3Active;
      }
    }
  },
  watch:{
    h3Active:function(val){
      this.$nextTick(function(){ // 在下次 DOM 更新循环结束之后执行延迟回调。
        this.listPosition();
        this.showBtripServe(); // 查询出差和招待的图标
      });
      this.required = false;
    },
    getXDate:function(){
      this.getVisitorCount(); // 获取访客记录数
    },
    overlayShow:function(val,val0){
      let _this = this;
      if(val){
        this.overlayShowTime = setTimeout(function(){
          _this.myNotify('数据加载失败');
          _this.overlayShow = false;
        },5000)
      }else{
        clearTimeout(this.overlayShowTime);
      }
    },
    numberOfWeeks:function(val,val0){
        this.selOneWeekPlan();
        this.getWorkDay();
        
    },
  }
};
</script>

<style lang="scss" scoped >
$blue:#4B77AF;
$int:26px;
p{ margin:0; }
// 顶部导航 start
.blue{
  $h:40px;
  background-color:$blue;width:100%;height: $h;
  .headerUl{
    height: $h;
    padding-left: $int;margin:0;float: left;
    li{ float: left;margin-right: 10.5px;line-height: 30px;font-weight: 700;color:#8bbdde ;height: 80%;
      font-size: 17px;
      &.active{ border-bottom: 2px solid #fff;color: #fff; }
    }

  }
  img{ width:28px;height:28px;display: inline-block; vertical-align: middle;} 
  .close{
    float: right;margin:0; padding-right:17px; line-height: $h;height: 100%;
  }
  .record{
    float:right;margin-right: 20px;height: 100%;line-height: $h;
  }
}
// 顶部导航end

input:disabled{
  color:#000;
}

#visitNumber{ // 拜访次数样式
  display: inline-flex;
  align-items: center;
  font-size: 13px;color:#007AFF;
  height: 100%;line-height: 36px;
  vertical-align: middle;
  &>.visitNumber_span{
    margin-left: 4px;line-height: 36px;
  }
}
#myPopup{ // 我的弹出层样式
  width: 100%;height: 100%;padding: 10px;box-sizing: border-box;
}

#review{ // 计划与回顾的样式
  position: fixed;bottom:0;top:0;left: 0;right: 0;
  &>.hHeader{ 
    height: 42px;background:#ececec;
    &>h3{
      height: 100%;width: 50%;box-sizing: border-box;
      margin: 0;font-size: 18px;line-height: 42px;padding: 0 $int;color:$blue; 
      &:nth-of-type(1){ float: left; }
      &:nth-of-type(2){ float: right;text-align: right; }
      &.active{
        background-image: linear-gradient(182deg, rgba(130,175,216,0.04) 1%, rgba(75,119,175,0.20) 100%);
      }
    }
  }
  .but_b{ position: fixed;bottom: 0;width: 100%; box-shadow: 0 -1px 8px #3488c2;height:42px;z-index: 2;
    & button{ width:33%;float: left;height: 100%;font-size: 20px;line-height: 42px;font-weight: 600;border:0; 
      &:nth-of-type(1){ background: #fff;color: #4B77AF; }
      &:nth-of-type(2){ background: #669BDF;color: #fff; }
      &:nth-of-type(3){ background: #4B77AF;color: #fff;font-size:16px;font-weight:600;padding: 0; }
      &.withdraw{ width: 100%; }
    }
  }
  
  .first{ // 从.list移动到了外面 同时组件也进行了移动
      padding: 5px 11px 20px 11px;min-height: 120px;box-sizing: border-box;margin-bottom: 10px;
      background: #fff;
      .title{ 
        height:36px;
        font-size:17px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(72,72,72,1);
        line-height:36px;
        border-bottom: 2px solid #4B77AF;margin-bottom: 6px;
      }
    }
  .list{ 
    // height: 100%;box-sizing: border-box;
    position: absolute;left: 0;right: 0;bottom: 0;
    top: 200px;
    // 新增样式 end
    width: 100%;overflow-y:scroll;background:#ececec; 
    padding-bottom:64px;
    &>textarea{ border: 0;padding: 10px 27px;width: 100%;box-sizing: border-box;height: 98px;margin-bottom: 10px; }
  }
  .flexbox{ // 周一~日的工作计划列表
    display:flex;justify-content: space-between;align-items:center;height:160px;background:#fff;margin-bottom:10px;
    .box-l{ width:42px;text-align: center; height: 64px;display:inline-block;
      display: flex;align-items:center;flex-wrap:wrap;
      &>div{ margin: 0 auto;width:30px;height:2px;background-image: linear-gradient(270deg, #8BBAE5 0%, #4B77AF 100%); }
      p{ letter-spacing:-0.24px;font-size: 12px;line-height: 37px;padding-left:5px;
        &>span{ font-size: 20px; } 
      }
      // &:before{ content: '';display: inline-block;vertical-align:middle;height: 100%; }
    }
    .box-c{ width:26px;height:100%;
      p{ height:50%;text-align: center;display:flex;align-items:center;justify-content: center;
        &:nth-of-type(1) img{ transform: scaleY(-1); }
      }
    }
    .box-r{ width:70%;height: 100%; 
      textarea{ height: 49%;box-sizing: border-box;width: 100%;padding: 20px 0;border: 0; 
        font: 14px/20px "";
        &:nth-of-type(1){
          border-bottom: 1px solid rgba(75,119,175,0.20);
        }
      } 
    
    }
  }
  .calendar{ // 日期横幅展示样式
    display: flex;justify-content:space-between;height: 66px;background-color: $blue;color: #fff;
    font-size: 15px;line-height: 66px; width:100%;
    span:not(:nth-of-type(2)){ display: inline-block; padding: 0 26px; 
      & img{vertical-align: middle; width: 8px;height: 15px;} 
    }
    span:last-child{ img{ transform:  rotate(-180deg); } }
  }
  .vanNavBar{ // 顶部vant导航样式
    height:60px;border-bottom:10px solid #ececec;
    .van-nav-bar__left,.van-nav-bar__left>div{
      height: 100%;display: flex;align-items: center;color: #007AFF;
    }
    .van-nav-bar__right,.van-nav-bar__right>div{
      height: 100%;display: flex;align-items: center;color: #007AFF;
    }
    .van-nav-bar__title{
      height: 100%;
      &>div{
        height: 100%;padding-top:10px; box-sizing: border-box;  
        .title_h3{
          height: 24px;
          font-size:17px;
          font-family:PingFang-SC-Bold,PingFang-SC;
          font-weight:bold;
          color:rgba(72,72,72,1);
          line-height:24px;
          position: relative;
        }
        .title_span{
          margin:0 auto;
          width:200px;
          height:17px;
          font-size:12px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(72,72,72,1);
          line-height:17px;
        }
      }
    }
  }
}

.main{
  // position: absolute;left: 0;right: 0;bottom: 0;top:120px;overflow-y: scroll;
  // 新增样式 end
  padding: 11px;background: #fff;
  .title{
    height:17px;
    font-size:12px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(72,72,72,1);
    line-height:17px;
    border-bottom: 1px solid #4B77AF;padding-bottom:2px;
    display: flex;align-items:center;
    // vertical-align: middle;

    &>span:first-child{ margin-right: 10px; }
    .van-image{ 
      // margin-left: 10px; 
      padding: 0 7px;
    }
  }
  .itemText{
    display: flex;justify-content: flex-start;align-items:center;position:relative;
    &>.itemTextTitle{ letter-spacing:12px;
      width:16px;
      height:34px;
      font-size:12px;
      font-family:PingFang-SC-Regular,PingFang-SC;
      font-weight:400;
      color:rgba(75,119,175,0.2);
      line-height:17px;
    }
    &>.popupUp{ position:absolute; }
    // &>.popupDown{}
    
  }
  .itemUp{ padding-top: 5px; }
}

#opinion{ // 管理者意见样式
  background: #fff;padding-top: 8px;
  // height: 180px; UI图样式
  min-height: 150px;
  padding-bottom:17px;
  &::before{ content: "";margin-left:9px;width:6px;height: 20px;background: #367EF4;display: block;float: left; } 
  &>h3{ 
    margin: 0;float: left;padding-bottom: 5px;border-bottom: 2px solid #4B77AF;margin-left: 12px;
  }
  // 12px
  &>div{ margin-top: 42px;padding: 0 22px 0 27px;height:120px;
    &>div{ 
      width: 50%;position: relative;
      // width: 100%;
      height: 100%;box-sizing: border-box; 
      p{ height: 60px;font: 17px/24px '';letter-spacing: -0.24px;overflow: scroll; }
      &>div{ font:12px/17px '';text-align: right;position: absolute;top: 60px;width: 100%; }
    }
    &>div:nth-of-type(1){ float: left;padding-right: 10px;
      border-right: 1px solid rgba(75,119,175,0.20);
    }
    &>div:nth-of-type(2){ float: right;padding-left: 15px; }
  }
}
#transpond{ // 转发样式
  .item{
    display:flex;justify-content: space-between;
    .item_c{ h4{display: inline-block;margin: 0;} }
  }
}
#tabDiv{ // 轮播界面样式
  background:#ececec; position: relative;
  // 新增样式
  width:100%;position:fixed;top:70px;bottom:0;left:0;right:0;z-index: 1;
  // overflow-y: scroll;
  // padding-bottom: 64px;
}
// 轮播样式
.moveLeft{
  transform: translate3d(-100%, 0px, 0px); transition-duration: 0.3s;
}
.moveRight{
  transform: translate3d(100%, 0px, 0px); transition-duration: 0.3s;
}
</style>

<style lang="scss">

.van-field--disabled .van-field__control, .van-field__right-icon{ // 修改输入框的disabled文字样式
  -webkit-color: #000;
  -moz-color: #000;
  -o-color: #000;
  color: #000;
  -webkit-opacity:1;
  -moz-opacity:1;
  -o-opacity:1;
  opacity:1;
}

// vue 解决disabled的样式问题
#tabDiv .list textarea[disabled],textarea:disabled,textarea.disabled{  
    // -webkit-text-fill-color:#000;  //会将提示文字也修改掉
    -webkit-text-fill-color: initial;
    -webkit-color: #000;
    -moz-color: #000;
    -o-color: #000;
    color: #000;
    -webkit-opacity:1;
    -moz-opacity:1;
    -o-opacity:1;
    opacity:1;
}
// vue 解决disabled的样式问题 end

.myNotify{ // 提示框样式
  &.van-popup.van-popup--top.van-notify.van-notify--danger{
    position: fixed;left: 0;right: 0;top: 0;bottom: 0;
    height: 48px;width: 50%;
    margin: auto;
    font-size: 17px;line-height: 48px;font-weight: 400;color:rgba(255,255,255,1);background:#7F7F7F;
    padding: 0 10px;display: inline-block;border-radius: 5px;
  }
}
// 同事圈下拉组件样式
.myCollapse.van-collapse{
  .van-cell.van-cell--clickable{ $h:60px;
    padding: 0;padding-left: 17px;padding-right:23px;height: $h;line-height: $h;
    display: flex;align-items: center;
  }
  .van-collapse-item__content{
    padding: 0;
  }
}

#myVanTabs{ // 切换框样式
  position: fixed;left: 0;right: 0;top: 60px;bottom: 46px;
  &>div.van-tabs__wrap.van-hairline--top-bottom{ display: none; }
  &>div.van-tabs__content.van-tabs__content--animated{height: 100%;}
  .van-tab__pane{
    height: 100%; &>div{ height: 100%; }
  }
}
</style>
