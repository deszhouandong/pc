<template>
  <div @touchend="touchend" @touchmove="touchmove($event)" @touchstart="touchstart($event)">
    <van-popup v-model="loadFlag" >
      <van-loading class="load" size="24px" vertical >加载中...</van-loading>
    </van-popup>
    <div class="travelPlan" @click="objflag = false" v-if="!loadFlag">
      <!-- 导航栏 -->
      <van-nav-bar
        title="出差计划"
        @click-left="onClickLeft"
        @click-right="onClickRight"
        style="color:#333;margin-bottom:10px;margin-bottom:10px;"
      >
      <div slot="left" >
        <span style="font-size:0.426667rem;color:#007AFF;">取消</span>
      </div>
      <div slot="right" v-if="this.$route.query.id > 0 ? false : true">
        <span style="color:#007AFF;padding-top:0.2rem;font-size:0.426667rem;">招待计划</span>
        <van-icon name="arrow" style="color:#4B77AF;padding-bottom: 0.15rem;" />
      </div>
      <div slot="title" v-if="this.$route.query.id > 0 ? false : true">出差计划</div>
      <div slot="title" v-if="this.$route.query.id > 0 ? true : false">
        <div style="line-height:16px;margin-top:0.15rem;" >出差计划</div>
        <div style="height:16px;line-height:16px;font-weight:normal;font-size:12px;padding-top:0.05rem;"
        >{{planBody.wpBillNo}}</div>
      </div>
    </van-nav-bar>
    <van-cell-group :class="this.planBody.wpSatus === 2 || this.planBody.wpSatus === 3 ? 'noclick' : ''">
      <!-- 出差计划 -->
      <van-field
        label-width="100px"
        label-align="left"
        label="出差日期-起"
        input-align="right"
        v-model="wpStartDate"
        @click="startTimes"
        readonly
      >
         <van-image
        v-if="timeflag"
        slot="right-icon"
          width="17" height="17"
          :src="travelImgSrc"
        />
      </van-field>

      <van-field
        input-align="right"
        label-width="100px"
        label-align="left"
        label="出差日期-止"
        v-model="wpEndDate"
        @click="endTimes"
        readonly
      >
         <van-image
        v-if="timeflag"
        slot="right-icon"
          width="17" height="17"
          :src="travelImgSrc"
        />
      </van-field>
      <van-popup v-model="showTime" position="bottom" :style="{ height: '55%'}" >
        <div>
          <calendar></calendar>
          <inlineCalendar @change="handelChange"  :dayClick="dayClick"   :minDate="$route.query.startDate" >
            <template v-slot:day="scope">
              <div v-if="disabledDate.indexOf($moment(scope.date.dateTime.$d).format('YYYY-MM-DD'))>-1" class="point">{{scope.date.dateTime.$D}}</div>
            </template>
          </inlineCalendar>
        </div>
      </van-popup>
      <van-field
        label-width="100px"
        input-align="right"
        label-align="left"
        label="类型"
        readonly
      >
        <!-- @click="travelshow = true" -->
        <span slot="right-icon" style="color:#D75252;font-size:12px;padding-right:10px;">仅支持异地公出！</span>
        <van-button type="info" slot="right-icon" class="btn" v-model="planBody.wpBusinessType">异地</van-button>
      </van-field>

      <van-field
        label-width="100px"
        input-align="right"
        label-align="left"
        label="预计费用"
        placeholder="请输入预计费用"
        v-model="planBody.wpAmount"
      />

      <!-- <van-field
        label-width="115px"
        label-align="left"
        label="部门"
        v-model="planBody.deptName"
        placeholder="请选择部门"
        @click="showsType('businessValue')"
        is-link
        disabled
      />
      <van-field
        label-width="115px"
        label-align="left"
        label="营业店/子部门"
        v-model="planBody.shopName"
        placeholder="请选择营业店"
        @click="storeListPicker = true"
        is-link
        disabled
      /> -->
      <div class="txtReason">
        <p style="font-size:14px;">出差事由</p>
        <van-field
        type="textarea"
        placeholder="请输入出差事由"
        v-model="planBody.wpReason"
        class="txtarea"
        rows="4"
        maxlength="200"
      />
      </div>

      <!-- 拜访对象 -->
      <div class="visit-wrap">
        <van-cell size="large" style="color:#333;font-weight:bold;background: #f4f4f4;">
          <template slot="title">
            <span class="custom-title">拜访对象</span>
          </template>
        </van-cell>

        <div class="objTitle">
          <div>地点</div>
          <div>类型</div>
          <div>拜访对象</div>
          <div></div>
          <div class="addText" @click="add"
          v-if="this.planBody.wpSatus === 2 || this.planBody.wpSatus === 3 ? false : true"
          >添加</div>
        </div>
        <!--输入框-->
        <ul class="oblCard add-list">
          <li  v-for="(item,index) of planBody.visitObjects" :key="index">
            <div class="item">
              <van-field input-align="center"  v-model="item.location"
                         placeholder="请输入" />
            </div>
            <div class="item check-type" >
              <van-dropdown-menu  direction="up" >
                <van-dropdown-item  v-if="!item.subjectType" title="请选择" title-class="vant-title-class" v-model="item.subjectType" :options="option1"/>
                <van-dropdown-item  v-else v-model="item.subjectType" :options="option1" @change="changeType(item)"/>
              </van-dropdown-menu>
            </div>
            <div class="search">
              <van-search
                placeholder="请输入"
                @input="onInput(item,index,item.visitObjectName)"
                style="padding:0px;"
                v-model="item.visitObjectName"
              ></van-search>
            </div>
            <div class="del" @click="delLine(index)"
                 v-if="planBody.wpSatus === 2 || planBody.wpSatus === 3 ? false : true">
              <van-icon name="delete" size="20"/>
            </div>
            <div class="del" v-if="planBody.wpSatus === 2 || planBody.wpSatus === 3 ? true : false"></div>
          </li>
        </ul>
      </div>
      <!-- 列表 -->
      <div class="card-list-box">
        <van-card style="background:#fff; position: fixed; bottom: 76px; z-index: 1000; margin: 0; width: 100%;" v-if="objflag" class="card">
          <van-list slot="title">
            <van-cell
              style="text-align:left;font-size:16px;"
              v-for="(item,index) of objlist"
              :key="index"
              @click="choose(item)"
            >
              <div slot="title" style="overflow:auto;height:100%">
                <span>{{item.name}}</span><br/>
                <!-- <span style="color:#979797;font-size:12px;">{{item.qccId}}</span> -->
              </div>
              <span
                v-if="item.sources === 2? true :false"
                slot="right-icon"
                style="color:#D75252;width:24px;height:15px;line-height:15px;border-radius:8px;border:1px solid rgba(215,82,82,1);text-align:center;font-size:12px;
            margin-top:5px;"
              >新</span>
            </van-cell>
            <div class="empty" style="text-align:center;font-size:16px;" v-if="objlistCode ==='success' && objlist.length === 0 ? true : false">
              <p style="color:#000;margin: 24px 0">系统尚未查询到该结果，是否保存输入！</p>
              <!-- <van-button plain type="info" style="width:66px;height:30px;border-radius:30px;border:1px solid rgba(215,82,82,1);
              color:rgba(215,82,82,1);line-height:30px;margin:10px 20px 0 0;" >取消</van-button> -->
              <van-button plain type="info" style="width:66px;height:30px;border-radius:30px;border:1px solid #4b77af;
                color:#4b77af;line-height:30px;">确定</van-button>
            </div>
          </van-list>
        </van-card>
      </div>


      <!-- 提交按钮 -->
      <div class="footer" v-if="this.planBody.wpSatus === 2 || this.planBody.wpSatus === 3 ? false : true">
        <Button :title ="delevetitle" @onclick="btndel"
                v-if="this.$route.query.id >0 ? true : false"
                style="height:50px;line-height:30px;width:50%;background-color: #fff;color:#D75252;font-weight: bold;font-size: 16px;border: 1px solid #fff;box-shadow: 0rem 0 0.266667rem 0 rgba(96, 156, 184, 0.5); "
        />
        <Button :title ="submittitle" @onclick="btnsave"
                v-if="this.$route.query.id >0 ? false : true"
                style="height:50px;line-height:30px;width:100%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
        />
        <Button :title ="submittitle" @onclick="btnsave"
                v-if="this.$route.query.id >0 ? true : false"
                style="height:50px;line-height:30px;width:50%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
        />
      </div>

      <!-- 部门下拉框 -->
      <van-popup v-model="deptListPicker" position="bottom">
        <van-picker
          readonly
          show-toolbar
          :columns="infoData.deptList"
          @cancel="deptListPicker = false"
          @confirm="deptListConfirm"
        />
      </van-popup>
      <van-popup v-model="storeListPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="storeColumns"
          @cancel="storeListPicker = false"
          @confirm="storeListConfirm"
        />
      </van-popup>
      <!-- 时间 -->
      <!-- <van-popup v-model="showTime" position="bottom" :style="{ height: '60%',background: '#f7f7f8' }">
        <Time @timedata="timedata" :getdata="getdata" />
      </van-popup> -->
      <!-- 出差类型 -->
      <van-popup v-model="travelshow" position="bottom">
        <van-list>
          <van-cell
            style="text-align:center;"
            v-for="(item,index) of travelColumns" :key="index"
            :title="item.name"
            @click="chanceType(item)"
          />
        </van-list>
      </van-popup>
      <!-- 弹出类型 -->
      <van-popup v-model="typeShow" position="bottom" :style="{ height: '28%',bottom: '9%' }">
        <van-list>
          <van-cell
            style="text-align:center;"
            v-for="(item,index) of typeColumns" :key="index"
            :title="item.name"
            @click="chancetraType(item)"
          />
        </van-list>
      </van-popup>
      <van-cell v-if="typeShow" title="取消"
                style="position:fixed;bottom:0px;z-index:10000;background: #DCDCDC;text-align:center;"
      />
    </van-cell-group>
      <!-- 出差回顾 -->
    <div class="travelRW" v-if="this.reviewBodyList.length === 0 || this.reviewBodyList === null? false : true">
      <van-cell size="large" style="color:#333;font-weight:bold;background: #f4f4f4;">
        <template slot="title">
          <span class="custom-title">出差回顾</span>
        </template>
      </van-cell>

      <van-field
        readonly
        class="info laster"
        style="color:#333;background:rgba(75,119,175,0.3);border-radius: 10px 10px 0 0;"
      >
        <div slot="input" class="review">
          <span  >单号</span>
          <span >回顾日期</span>
          <span >出差</span>
          <span >实际费用</span>
          <span>备注</span>
        </div>
      </van-field>

      <van-field
        v-for="(item,index) of infoData.reviewBodyList" :key="index"
        readonly
        class="info laster"
        style="color:#333;font-size:12px;"
      >
        <div slot="input" class="reviewinfo">
          <span @click="goTravelReview(item)" 
          style="width:15%;color:#007AFF;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
          >{{item.wrBillNo}}</span>
          <span 
          style="width:26%"
          >{{item.wrReviewDate}}</span>
          <span >{{getTravel(item.wrTripStatus)}}</span>
          <span >{{item.wrAmount}}</span>
          <span
           style="width:15%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
          >{{item.wrReason}}</span>
        </div>
      </van-field>
    </div>
  </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import dayjs from "dayjs";
  import wx from "weixin-js-sdk"; // 引入企业微信的sdk
  import cookieOperation from "@/apis/cookie";
  import Button from "@/component/button.vue";
  import Time from "@/component/time.vue";
  import Mock from 'mockjs'
  import {Toast} from "vant";
  export default {
    name: "travelPlan",
    components:{
      Button,
      Time
    },
  data() {
    return {
      disabledDate:["2019-12-06"],
      value1: 0,
      value2: 'a',
      option1: [
        { text: 'Option1', value: 0 },
        { text: 'Option2', value: 1 },
        { text: 'Option3', value: 2 }
      ],
      travelImgSrc:require("../../../static/imgs/travelPlan.svg"),
      infoData: {},//初始数据
      loadFlag:true,
      reviewBodyList:[],
      indexData:'',
      planBody:{},
      subjectType:{},
      getdata:{},
      visitObjectId: '',
      wpStartDate:"",
      wpEndDate:"",
      recordDate: "",
      popContent: "",
      num: "",
      defaultDate: new Date(),
      //下拉
      storeColumns: [],
      deptListPicker: false,
      storeListPicker: false,
      storeListCode: '',
      listCode: '',
      value: 0,
      option1: [
        { text: '企业', value: 1 },
        { text: '个体户', value: 2 },
        { text: '自然人', value: 3 },
        { text: '政府机构/事业单位', value: 5 },
      ],
      //出差类型
      travelshow:false,
      value1: 1,
      typevalue: '',
      travelColumns:[{name:"异地",code:1}],
      //对象
      subjectType:'',
      objflag:false,
      objlist:null,
      objlistCode:'',
      visitObjectName:'',
      newflag:false,
      //类型
      typeShow:false,
      typeColumns: [{name:'企业',code:1},{name:'个体户',code:2}, {name:'自然人',code:3}, {name:'政府机构/事业单位',code:5}],
      travel:'',
      //时间
      chooseTime:0,
      showTime: false,//控件
      timeflag:true,//图标
      delevetitle: "删除",//按钮
      submittitle: "保存",
      defaultSelect: '请选择',
      //切换
      startX:'',
      moveEndX:'',
    };
  },
  created() {
    document.title = "出差计划";
    this.init()
  },


    methods: {
      //初始化
      init(){
        // this.disabledDate = ["2019-12-06","2019-12-07"]

        // console.log(this.infoData.timeQuantum)
        let par = {}
        par.initDate = this.$route.query.startDate
        par.wpId = this.$route.query.id
        par.year = this.$route.query.year
        par.weekNum = this.$route.query.weekNum
        this.$getData
        .travelPlanFind({
          method: "post",
          data: par
        })
        .then(res => {
          this.loadFlag = false
          this.infoData = res.data
          this.reviewBodyList = this.infoData.reviewBodyList
          this.planBody = this.infoData.planBody
          this.getdata.dataList = res.data.timeQuantum
          this.getdata.startDate = this.$route.query.startDate
          this.disabledDate = this.infoData.timeQuantum
          if(this.$route.query.id === "" || this.$route.query.id === null){
            this.planBody.visitObjects = [{}]
          }
          if(this.infoData.planBody.wpBusinessType === 1){
            this.typevalue = "异地"
          }
          this.wpStartDate = this.planBody.wpStartDate
          this.wpEndDate = this.planBody.wpEndDate
        });
    },

      //前进
      onClickRight(){
        this.$router.push(
          {
            name:'servePlan',
            query:this.$route.query

          })
      },

      //取消
      onClickLeft(){
        this.$router.push('/workPlan')
      },

      //滑动跳转
      touchstart(e) {
      // event.preventDefault() //阻止默认事件（长按的时候出现复制）
 
      this.startX = e.changedTouches[0].pageX
      console.log(1)
},
      touchend(){
        console.log(3)
      },

      touchmove(e) { // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
      e.preventDefault()
      this.moveEndX = e.changedTouches[0].pageX
      // console.log(this.moveEndX-this.startX)
      if(this.moveEndX-this.startX<-150){
        this.$router.push(
          {
            name:'servePlan',
            query:this.$route.query

          })
      } else if(this.moveEndX-this.startX > 150){
        this.$router.push('/workPlan')
      }
      
    },

      //出差类型
      chanceType(value){
        this.planBody.wpBusinessType = value.code
        this.typevalue = value.name
        this.travelshow = false
      },

      //下拉框
      showsType(){
        this.deptListPicker = true
      },
      deptListConfirm(value){
        this.deptListPicker = false
        this.planBody.deptName = value.text
        this.planBody.deptId = value.id
        for (let i in this.infoData.deptList) {
          if(this.infoData.deptList[i].text === value.text){
            this.listCode = i
          }
        }
        this.storeColumns = this.infoData.deptList[this.listCode].shopList
        if(value !== ""){
          this.infoData.storeName = ""
        }
      },
      storeListConfirm(value){
        this.storeListPicker = false
        this.planBody.shopName = value.text
        this.planBody.shopId = value.id
      },

      //起始日期
      startTimes(){
        this.showTime = true
        this.chooseTime = 1
      },

      //截至日期
      endTimes(){
        this.showTime = true
        this.chooseTime = 2
      },

      handelChange(date){
        if(this.chooseTime === 1){
          this.wpStartDate = this.$moment(new Date(date.$d)).format("YYYY-MM-DD");
        }else if(this.chooseTime === 2){
          this.wpEndDate = this.$moment(new Date(date.$d)).format("YYYY-MM-DD");
        }
        if(this.wpStartDate > this.wpEndDate){
          this.$toast('出差日期-止须大于出差日期-起')
        }
    },

      add(item){
        this.planBody.visitObjects.push({});
      },

      //拜访类型
      chancetraType(value){
        this.typeShow = false
      },

      changeType(item){
        item.visitObjectName = null
        item.visitObjectId = null
      },

      //模糊查询
      onInput(vel,val,value){
        if(this.planBody.visitObjects[val].subjectType === null ||this.planBody.visitObjects[val].subjectType === undefined){
          this.$toast('类型不能为空')
          vel.visitObjectName = null;
        } else{
          this.num = val
          if(value !== ""){
            this.objflag = true
            this.$getData
              .travelPlanSearch({
                method: "post",
                data:{
                  "visitType": vel.subjectType,
                  "name": vel.visitObjectName,
                }
              })
              .then(res => {
                this.objlist = res.data
                this.objlistCode = res.msg
                if (res.code == 200) {
                  vel.visitObjectId =null
                }
              });
            let data = vel.visitObjectName
          }else{
            this.objflag = false
          }
        }
      },

      //对象选择
      choose(vel){
        this.planBody.visitObjects[this.num].visitObjectId = vel.id
        this.planBody.visitObjects[this.num].visitObjectName = vel.name
        this.objflag = false
      },

      //转换类型
      getTravel(vel){
        let data = ''
        if(vel === 1){
          data = "出差"
        } else if(vel === 2){
          data = "未出差"
        }
        return data
      },
      //出差回顾
      goTravelReview(vel){
        this.$router.push(
          {
            name:'travelReview',
            query:{
              id: vel.wrId
            }

          })
      },
      btndel(){
        let par = this.$route.query.id
        this.$getData
          .travelPlanDel({
            method: "post",
            data: {
              "wpId": par
            }
          })
          .then(res => {
            if(res.code === 200){
              this.$toast('删除成功')
              this.$router.push('/workplan')
            } else{
              this.$toast('删除失败')
            }
          });
      },
      //校验
      check(){
        let flag = false
        var VisArr=[]
       if(this.planBody&&this.planBody.visitObjects){
        for (let i = 0; i < this.planBody.visitObjects.length; i++) {
          var visItem = this.planBody.visitObjects[i]
          VisArr = Object.keys(visItem);
          // alert(arr.length == 0)
        }
        var reg = /^[1-9]\d{0,3}$/;//正整数
        let rag = /(^[0-9]\d{0,20}$)|(^\.\d{1,2}$)|(^[0-9]\d{0,20}\.\d{1,2}$)/;
        if(this.wpStartDate === "" || this.wpStartDate === null){
          this.$toast('请选择出差日期-起')
        } else if(this.wpEndDate === "" || this.wpEndDate === null){
          this.$toast('请选择出差日期-止')
        } else if(this.wpStartDate > this.wpEndDate){
          this.$toast('出差日期-止不能小于出差日期-起')
        } else if(this.planBody.wpAmount === null || this.planBody.wpAmount === ""){
          this.$toast('请输入预计费用')
        } else if(!rag.test(this.planBody.wpAmount)){
          this.$toast('预计费用格式错误')
        } else if(VisArr === undefined || VisArr.length == 0){
          this.$toast('拜访对象不能为空')
          let flag = false
        }
        //  else if(this.planBody.wpAmount > 0){
        else if(this.planBody.wpReason === null || this.planBody.wpReason === ""){
          this.$toast('请输入出差事由')
        }
        // }
        else{
          flag = true
          return flag
        }
        }
      },
      btnsave(){
        this.check()
        let flag = this.check()
        if(flag === true){
          this.planBody.wpBusinessType = 1
          this.infoData.planBody = this.planBody
          this.infoData.planBody.wpStartDate = this.wpStartDate
          this.infoData.planBody.wpEndDate = this.wpEndDate
          this.infoData.planBody.weekNum = this.$route.query.weekNum
          this.infoData.planBody.year = this.$route.query.year
          this.infoData.planBody.startDate = this.$route.query.startDate
          this.infoData.planBody.wpId = this.$route.query.id
          let par = this.infoData.planBody
          this.$getData
            .travelPlanSave({
              method: "post",
              data: par
            })
            .then(res => {
              if(res.code === 200){
                this.$toast('保存成功')
                this.$router.push('/workplan')
              } else{
                this.$toast(res.msg)
              }
            });
        }
      },
      //时间插件
      dayClick(params,b,c){
      const tag=this.disabledDate.indexOf(this.$moment(params.$d).format('YYYY-MM-DD'))>-1
      if(tag){
        return false
      }else{
        return true
      }
    },
      /*删除单条拜访信息*/
      delLine(index){
        const visitList = this.planBody.visitObjects
        visitList.forEach((item, i) => {
          if (Number(index) === i) {
            this.planBody.visitObjects.splice(index, 1)
          }
        })
      }
    },
  };
</script>
<style lang="scss" scoped >
  /*addlist s*/
  .add-list {
    width: 100%;
  }
  .add-list li {
    width: 100%;
    list-style: none;
    display: flex;
    background: #ffffff;
  }
  .add-list li .item {
    // flex: 1;
    width: 25%;
    min-width: 30px;
  }
  .add-list li .item  .van-cell{
    padding-right: 0px;
  }
  /deep/.add-list li .item.check-type{
    position: relative;
    width: 35%;
    padding-left: 10px;
    .van-ellipsis{
      font-size: 14px;
    }
  }

  /deep/ .add-list li .item.check-type .van-dropdown-menu{
    height: 44px;
  }
  /deep/ .add-list li .item.check-type .van-cell__title{
    text-align: left;
    padding-left: 20px;
  }
  /deep/ .add-list li .item.check-type .van-dropdown-menu__title::after{
    display: none;
  }
  /deep/ .add-list li .item.check-type .vant-title-class {
    color: #999999;
  }
  /deep/ .add-list li .item.check-type .vant-title-class .van-dropdown-menu__title{
    color: #999999;
  }
  .add-text {
    font-size:12px;
    color:#007AFF;
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 1;
    padding: 0 10px;
  }
  .card-list-box {
    position: relative;
  }
  .dropDownText{
    height: 46px;
    line-height: 46px;
    text-align: center;
    font-size: 16px;
    color: #999999;
  }
  .add-list li .del {
    // position: relative;
    // right: -40px;
    // width: 30px;
    text-align: center;
    padding: 10px 30px 0 0;
  }
  /*addlist end*/
.load{
  padding-top: 50px;
}
.van-loading--vertical{
  width: 150px;
  height: 100px;
  border-radius: 10px;
}
  .travelPlan{
    background: #f4f4f4;
    padding-bottom: 6rem;
    width: 100%;
    overflow: hidden;
  }
  .noclick {
    pointer-events: none;
  }
  .van-cell-group{
    padding-top: 56px;
    background: #F4F4F4;
  }

  //导航栏
  .van-nav-bar{
    width: 100%;
    position: fixed;
    top: 0;
  }
  .van-nav-bar__title {
    color: #333;
    font-weight: bold;
  }
  //箭头
  .van-nav-bar .van-icon{
    color: #4b77af;
    font-size: 24px;
  }
  //内容
  .van-cell {
    /*padding-top: 10px;*/
    font-size: 14px;
    color: #333;
  }
  /deep/.info .van-cell__value {
    padding-right: 15px;
  }

  /deep/.info .van-field__body{
    // padding: 5px 0;
  }
  /deep/.info .van-field__label {
    position: relative;
    padding-left: 15px;
  }
  /*new add style*/
  /deep/ .van-field__label {
    padding: 2px 0;
  }
  /deep/ .van-field__control--right{
    padding: 2px 0;
  }
   /deep/ .van-icon {
    padding: 4px 0;
  }
  // .searec /deep/ .van-icon {
  //   position: absolute;
  //   right: 10px;
  //   z-index: 1;
  // }
  //出差事由
  .txtReason{
    background-color: #fff;
    color: #333;
    p{
      font-size: 16px;
      padding: 10px 0 0 16px;
    }
  }
  //部门箭头
  /deep/.info .van-cell__right-icon{
    margin-top: 0.3rem;
  }
  //禁用
  .info /deep/.van-field__control:disabled{
    color: #333;
  }
  /deep/.info .van-cell__right-icon{
    margin-top: 0.4rem;
  }
  //日期
  .dataIcon {
    color: #4b77af;
    font-size: 20px;
  }
  //异地按钮
  .btn {
    background-color: #4b77af;
    font-size: 12px;
    width: 54px;
    height: 24px;
    line-height: 24px;
    border-radius: 12px;
    border: none;
    padding: 0;
  }
  .txtarea /deep/.van-field__body{
    line-height: 25px;
    // margin: 10px;
    padding: 0px 10px 0 5px;
    height: 110px;
    border: 1px solid #ebedf0;
    overflow: auto;
  }
  //拜访对象
  .objTitle{
    display: flex;
    justify-content: space-around;
    background:rgba(75,119,175,0.3);
    font-size: 16px;
    color: #333;
    height: 42px;
    align-items: center;
    border-radius: 10px 10px 0 0;
  }
  .addText{
    font-size: 12px;
    color: #007AFF;
    position: absolute;
    right:30px;
  }
  .van-card{
    height: 46px;
    float: left;
    width: 100%;
    padding: 0;
    margin: 0;
  }
  .van-card__content{
    width: 100%;
  }
  .travelType{
    position: absolute;
    top:0px;
    height: 46px;
    background: #fff;
    left:3rem;
    z-index: 100;
  }

  /deep/.travelType .van-dropdown-menu{
    height: 46px;
  }
  /deep/.travelType .van-cell__title{
    text-align: center;
  }
  //招待对象
  /deep/.oblCard .van-cell{
    /*height: 46px;*/
    /*line-height: 46px;*/
    /*padding: 0px;*/
  }
  .search{
    height: 46px;
    overflow: hidden;
    width: 40%;
  }
  /deep/.search .van-field__control{
    width: 100%;
  }
  /deep/.search .van-search{
    height: 46px;
    padding: 0px;
  }
  /deep/.search .van-search__content{
    background: #fff;
  }
  /deep/.search .van-field__left-icon{
  display: none;
}
/deep/.search .van-icon{
  padding-right: 10px;
}
  /deep/.travelType .van-dropdown-menu__title::after{
    display: none;
  }
  //卡片
  .card{
    position: absolute;
    z-index: 100;
    width: 90%;
    background: #fff;
    box-shadow: 0rem 0 0.266667rem 0 rgba(96, 156, 184, 0.5);
    margin: 0px 0 5px 5%;
    height: 156px;
    overflow: auto;
  }
  //出差回顾
  .travelRW{
    padding-bottom: 2rem;
  }
  .review{
    font-size: 16px;
    display: flex;
    justify-content: space-around;
  }
  .reviewinfo{
    display: flex;
    justify-content: space-around;
    text-align: center;
    span{
      padding-right: 10px;
      width: 20%;
      overflow: hidden;
    }
  }
  //时间插件
  .point {
   position: absolute;
    width: 30px;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    border-radius: 100%;
    color: #b8b8b8;
    text-decoration: line-through;
    left: 50%;
    top: 50%;
    margin: -15px 0 0 -15px;
  }
  //提交按钮
  .footer {
    padding-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom:0px;
    z-index:101;
  }
</style>
