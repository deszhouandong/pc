<template>
  <div class="punch">
    <!-- 日历 -->
    <div class="date">
      <!-- 年份 月份 -->
      <div class="month">
        <p class="last" @click="weekPre">
          <van-icon name="arrow-left" />
        </p>
        <p class="year" @click="yearMiddle">{{ currentYear }}年 第{{numberOfWeeks}}周 {{currentMonth}}月{{startweek}}-{{endweek}}</p>
        <p class="next" @click="weekNext">
          <van-icon name="arrow" />
        </p>
        <!-- 弹出日期插件 -->
        <van-popup v-model="show" position="bottom" :style="{ height: '55%'}">
          <div>
            <calendar v-model="calendarShow"></calendar>
            <inlineCalendar @change="handelChange"  :defaultDate="defaultDate" ref="popDate" />
          </div>
        </van-popup>
      </div>
      <!-- 星期 -->
      <ul class="weekdays">
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li class="six">六</li>
        <li class="six">日</li>
      </ul>
      <!-- 日期 -->
      <ul class="days">
        <li @click="pick(day)" v-for="(day, index) in days" :key="index">
          <!--本月-->
          <span
            v-if="day.getMonth()+1 != currentMonth"
            :class="{active:currentDay == day.getDate()}"
          >{{ day.getDate() }}</span>
          <span v-else>
            <!--今天-->
            <span :class="{active:currentDay == day.getDate()} ">{{ day.getDate() }}</span>
          </span>
        </li>
      </ul>
    </div>
    <div class="content">
      <van-cell-group>
        <!-- 班组长信息 -->
        <van-cell size="large" style="color:#484848;font-weight:bold;padding-left:15px;">
          <template slot="title" style="color:#2aabf5">
            <!-- <i class="iconfont icon-shugang" style="color:#4b77af"></i> -->
            <span class="custom-title">班组长信息 :</span>
          </template>
        </van-cell>
        <van-field
          v-model="this.infoData.userName"
          label="申请人"
          label-width="125px"
          label-align="left"
          input-align="right"
          disabled
          style="padding:0rem; color:#000;"
          class="info disabled"
        />
        <van-field
          v-model="infoData.recordDate"
          label="申请时间"
          label-width="125px"
          label-align="left"
          input-align="right"
          disabled
          style="padding:0rem; color:#333;"
          class="info"
        />
        <van-field
            label-width="125px"
            label-align="left"
            input-align="right"
            label="部门"
            v-model="infoData.deptName"
            placeholder="请选择部门"
            @click="showsType('businessValue')"
            is-link
            disabled
            class="info"
            style="padding:0rem; color:#333;"
            :class="timeDisabled ? 'noclick' : ''"
            />
            <van-field
            label-width="125px"
            label-align="left"
            input-align="right"
            label="营业店/工程分部"
            v-model="infoData.storeName"
            placeholder="请选择营业店"
            @click="storeListPicker = true"
            is-link
            disabled
            class="info laster"
            style="padding:0rem; color:#333;"
            :class="timeDisabled ? 'noclick' : ''"
            />
        <!-- 详细信息 -->
        <van-cell value size="large" style="color:#484848;font-weight:bold;padding-left:15px;">
          <template slot="title">
            <!-- <i class="iconfont icon-shugang" style="color:#4b77af"></i> -->
            <span class="custom-title">详细信息 :</span>
          </template>
        </van-cell>
        <van-field
          disabled
          required
          label
          label-width="125px"
          label-align="left"
          input-align="right"
          style="padding:0rem; color:#333;"
          class="info"
        >
          <span slot="label">当前人数</span>
          <van-stepper
            :disabled="timeDisabled"
            min=0
            slot="input"
            v-model="infoData.peopleNum"
            input-width="3.7rem"
            style="position:absolute;left:0.02rem;top:0.01rem;z-index:10"
            @blur="blur"
          />
        </van-field>

        <van-field
          required
          label
          disabled
          label-width="125px"
          label-align="left"
          input-align="right"
          style="padding:0rem; color:#333;"
          class="info meeting"
        >
          <span slot="label">是否召开班前会</span>
          <van-radio-group
            :disabled="timeDisabled"
            slot="input"
            v-model="infoData.meetState"
            @change="meetingChange"
            style="margin:10px 0 0 15px"
          >
            <van-radio icon-size="12px" style="float:left;z-index:11;padding-right:1.6rem;font-size:16px;" name="CONVENE_YES">是</van-radio>
            <van-radio icon-size="12px" style="float:left;z-index:11;font-size: 16px;" name="CONVENE_NO">否</van-radio>
          </van-radio-group>
        </van-field>

        <van-field
          required
          label
          label-width="125px"
          label-align="left"
          input-align="right"
          disabled
          style="padding:0rem; color:#333;display:flex;"
          class="info unusual"
          v-if="unusualShow"
        >
          <span slot="label">异常原因</span>
          <van-checkbox-group
            :disabled="timeDisabled"
            slot="input"
            v-model="infoData.exceptionList"
            style="margin:10px 0 0 15px"
          >
            <van-checkbox icon-size="12px" style="float:left;z-index:11;padding-right:0.1rem;font-size: 14px;" name="1">当天无施工</van-checkbox>
            <van-checkbox icon-size="12px" style="float:left;z-index:11;font-size: 14px;" name="2">人数不足3人</van-checkbox>
          </van-checkbox-group>
        </van-field>

        <!-- 填写行为安全观察问题 -->
        <van-cell size="large" style="color:#484848;font-weight:bold;padding-left:15px;">
          <template slot="title">
            <!-- <i class="iconfont icon-shugang" style="color:#4b77af"></i> -->
            <span class="custom-title">填写行为安全观察问题 :</span>
            <van-icon name="add" class="add" @click="add"/>
          </template>
        </van-cell>

        <van-field
          disabled
          :label="item.questionLabel"
          label-width="125px"
          label-align="left"
          input-align="right"
          style="padding:0rem; color:#333;height:40px;line-height:40px;"
          class="info qustion"
          :value="item.questionDesc"
          v-for="(item,index) of this.infoData.questionLists"
          :key="index"
          type="textarea"
          rows="2"
          maxlength="200"
        />
        <!-- 图片上传 -->
        <van-cell size="large" style="color:#484848;font-weight:bold;padding-left:15px;">
          <template slot="title" style="color:#2aabf5">
            <!-- <i class="iconfont icon-shugang" style="color:#4b77af"></i> -->
            <span class="custom-title">队列照片上传 :</span>
          </template>
        </van-cell>
          <van-uploader @delete="queueDeleted" :deletable="!timeDisabled" v-model="queueFileList" :after-read="queueRead" :disabled="timeDisabled"  :max-count="1" style="padding:15px 0 0 20px;">
          <div class="photograph">
            <van-icon name="photograph" />
          </div>
        </van-uploader>
          <van-cell size="large" style="color:#484848;font-weight:bold;padding-left:15px;">
          <template slot="title">
            <!-- <i class="iconfont icon-shugang" style="color:#4b77af"></i> -->
            <span class="custom-title">交底照片上传 :</span>
          </template>
        </van-cell>
          <van-uploader @delete="tellDeleted" deletable="false" v-model="tellFileList" :after-read="tellRead" :disabled="timeDisabled" :max-count="1" style="padding:15px 0 0 20px;">
          <div class="photograph">
            <van-icon name="photograph" />
          </div>
        </van-uploader>
        <!-- 提交按钮 -->
        <div class="footer" v-if="!timeDisabled">
          <!-- <van-button type="info" @click="save">保存</van-button>
          
          <van-button type="info" @click="submit">提交</van-button> -->
          <Button :class="this.infoData.actionState === 1 ? 'noclickBtn' : ''" :title ="savetitle" @onclick="btnsave" :disabled="timeDisabled " class="savebtn"
          style="height:50px;line-height:30px;width:50%;color:#4b77af;font-weight: bold;font-size: 16px;border: 1px solid #fff;box-shadow: 0rem 0 0.266667rem 0 rgba(96, 156, 184, 0.5); "
          />
        <Button :title ="submittitle" @onclick="btnsubmit" :disabled="timeDisabled"
        style="height:50px;line-height:30px;width:50%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
        />
        </div>
        
        <van-popup v-model="saveShow" style="width:90%;height:200px;border-radius: 10px;">
          <div class="popTitle">
            <span>提示</span>
          </div>
          <div class="popContent">
            <p>{{popContent}}</p>
          </div>
          <div class="popfooter">
            <van-button
              type="info"
              style="height:50px;line-height:50px;width:50%;background-color: #fff;color:#000;font-weight: bold;font-size: 16px;border: 1px solid #ccc;"
              @click="cancel"
            >取消</van-button>
            <van-button
              type="info"
              style="height:50px;line-height:50px;width:50%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
              @click="confirm"
            >确认</van-button>
          </div>
        </van-popup>
        <!-- 下拉框 -->
        <!-- <van-area :area-list="aList"  :columns-num="2" v-if="deptListPicker" @confirm="deptListConfirm" style="position: fixed;bottom: 0px; width:100%" @change="listChange"/> -->
        <van-popup v-model="deptListPicker" position="bottom">
      <van-picker
      disabled
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
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import lrz from 'lrz'
import wx from "weixin-js-sdk"; // 引入企业微信的sdk
import cookieOperation from "@/apis/cookie";
import Button from "@/component/button.vue";
export default {
    components:{
        Button,
    },
  name: "keyAction",
  data() {
    return {
      currrentTime: "",
      show: false,
      currentYear: 1970, // 年份
      currentMonth: 1, // 月份
      currentDay: 1, // 日期
      currentWeek: 1, // 星期
      numberOfWeeks:1,//当前周
      startweek:1,
      endweek:1,
      days: [],
      calendarShow: false,
      defaultDate: "",
      workPunch: [],
      unusualShow: true, //异常
      //填写行为安全观察问题
        safedata:[],
        timeDisabled:false,//非当天禁用
        keydata:[],
      //图片
      queueFileList: [], //队列图片上传
      tellFileList: [],
      photoFlag: "queue",
      //弹框
      saveShow: false,
      popContent: '',
      cancelFlag:false,
      //查询
      lookPar: {},
      infoData: {},
      recordDate:'',
      adAcount: '',
      //下拉
      storeColumns: [],
      deptListPicker: false,
      storeListPicker: false,
      storeListCode: '',
      listCode: '',
      //按钮
      savetitle:'保存',
      submittitle: "提交",
      saveOrSubmit:'',
    };
  },
  created() {
    this.initData(null);
    this.getparams()
    this.getWeekOfYear()
    document.title = "宏信建发班组长安全关键动作";
  },
  mounted() {
    this.getDefault();
  },
  methods: {
    // 判断网络状态
    networkState() {
      let that = this;
      if (!Object.is(window.navigator.onLine, true)) {
        Toast("网络未连接");
      }
      window.addEventListener("online", online, false);
      window.addEventListener("offline", offline, false);
      function online() {
        Toast("网络已重新连接");
        // window.location.reload();
      }
      function offline() {
        Toast("网络连接已断开");
      }
    },

    // 点击年月
    yearMiddle() {
      this.show = true;
      this.dateShow = true;
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },

    formatDate(year, month, day) {
      const y = year;
      let m = month;
      if (m < 10) m = `0${m}`;
      let d = day;
      if (d < 10) d = `0${d}`;
      return `${y}-${m}-${d}`;
    },
    //初始化时间
    initData(cur) {
      let date = "";
      if (cur) {
        date = new Date(cur);
      } else {
        date = new Date();
      }
      this.currentDay = date.getDate(); // 今日日期 几号
      this.currentYear = date.getFullYear(); // 当前年份
      this.currentMonth = date.getMonth() + 1; // 当前月份
      this.currentWeek = date.getDay(); // 1...6,0  // 星期几
      if (this.currentWeek === 0) {
        this.currentWeek = 7;
      }
      const str = this.formatDate(
        this.currentYear,
        this.currentMonth,
        this.currentDay
      ); // 今日日期 年-月-日
      this.days.length = 0;
      // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 35- this.currentWeek
      /* eslint-disabled */
      for (let i = this.currentWeek - 1; i >= 0; i -= 1) {
        const d = new Date(str);
        d.setDate(d.getDate() - i);
        this.days.push(d);
      }
      for (let i = 1; i <= 7 - this.currentWeek; i += 1) {
        const d = new Date(str);
        d.setDate(d.getDate() + i);
        this.days.push(d);
      }
      this.startweek = this.$moment(this.days[0]).format("DD ")
      this.endweek = this.$moment(this.days[6]).format("DD ")
    },

    // 上个星期
    weekPre(date) {
      this.numberOfWeeks--
      const d = this.days[0]; // 如果当期日期是7号或者小于7号
      d.setDate(d.getDate() - 7);
      this.initData(d);
      this.defaultDate = d;
      if (this.$refs.popDate) {
        this.$refs.popDate.changeDate(d);
      }
      this.getDefault(date);
    },

    // 下个星期
    weekNext(date) {
      this.numberOfWeeks++
      const d = this.days[6]; // 如果当期日期是7号或者小于7号
      d.setDate(d.getDate() + 7);
      this.initData(d);
      this.defaultDate = d;
      if (this.$refs.popDate) {
        this.$refs.popDate.changeDate(d);
      }
      this.getDefault(date);
    },

    // 上一個月  传入当前年份和月份
    pickPre(year, month) {
      const d = new Date(this.formatDate(year, month, 1));
      d.setDate(0);
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
    },
    // 下一個月  传入当前年份和月份
    pickNext(year, month) {
      const d = new Date(this.formatDate(year, month, 1));
      d.setDate(35);
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
    },
    //弹窗日li
    handelChange(date) {
      this.initData(date.$d);
      this.defaultDate = date.$d;
      date = this.defaultDate;
      //查询
            this.$getData.keyAction({
                method: "post",
                data:{
                    adAcount: this.adAcount,
                    recordDate: this.$moment(date).format("YYYY-MM-DD")
                }
            }).then(res => {
                this.infoData = res.data
                this.infoData.recordDate = this.$moment(res.data.recordDate).format("YYYY-MM-DD ");
                if(this.infoData.queueImgUrl === ""){
                  this.queueFileList = []
                } else{
                  this.queueFileList = [{url: this.infoData.queueImgUrl}]
                }
                if(this.infoData.tellImgUrl === ""){
                  this.tellFileList = []
                } else{
                  this.tellFileList = [{url: this.infoData.tellImgUrl}]
                }
            })
      if(this.$moment(date).format("YYYY-MM-DD") !== this.$moment(new Date()).format("YYYY-MM-DD")){
        this.timeDisabled = true
      }else{
        this.timeDisabled = false
      }
    },
    // 当前选择日期
    pick(date) {
      this.currentDay = date.getDate();
      this.defaultDate = date;
      // if (this.$refs.popDate) {
      //   this.$refs.popDate.changeDate(date);
      // }
      //查询
            this.$getData.keyAction({
                method: "post",
                data:{
                    adAcount: this.adAcount,
                    recordDate: this.$moment(date).format("YYYY-MM-DD")
                }
            }).then(res => {
                this.infoData = res.data
                this.infoData.recordDate = this.$moment(res.data.recordDate).format("YYYY-MM-DD ");
                if(this.infoData.queueImgUrl === ""){
                  this.queueFileList = []
                } else{
                  this.queueFileList = [{url: this.infoData.queueImgUrl}]
                }
                if(this.infoData.tellImgUrl === ""){
                  this.tellFileList = []
                } else{
                  this.tellFileList = [{url: this.infoData.tellImgUrl}]
                }
            })
      if(this.$moment(date).format("YYYY-MM-DD") !== this.$moment(new Date()).format("YYYY-MM-DD")){
        this.timeDisabled = true
      }else{
        this.timeDisabled = false
      }
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
      // console.log("当月1号为周几",dayOfWeek);
      if (dayOfWeek !=1 && dayOfWeek != 0) {
        spendDay=7-dayOfWeek+1+1;
      }else if(dayOfWeek == 0){
        spendDay = 2;
      }
      firstDay = new Date(year,0, spendDay);
      var d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);  // 计算时间差 向上取整
      // console.log("时间差",d);
      var result;
      if(d == 0){
        result = 1;
      }else if(d < 0){
        console.log('d < 0');
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
        console.log('d % 7 == 0');
        result = Math.ceil(d/7) ;
      }else{
        console.log('else');
        // console.log("math ",Math.ceil(d/7));
        result = (Math.ceil(d/7) == 0) ? 1 : Math.ceil(d/7);
        // result = Math.ceil(d/7) + 1;
      }
      console.log("当前周数",result);
      this.currentYear = year;
      this.numberOfWeeks = result;
      return result;
    },

    //页面刚进来默认加载
    getDefault() {
      const defaultDate = new Date();
        //获取ad账号
        this.$getData.getCurrent({
            method: "post",
        }).then(res => {
            this.adAcount = res.data.accountName
            this.recordDate  = this.$moment(new Date()).format("YYYY-MM-DD")
            this.find()
            cookieOperation.cookie.set('accountName',res.data.accountName,1000*60*60*24) // 缓存accountName
            
        })
    },
    //查询
    find(){
      //查询
            this.$getData.keyAction({
                method: "post",
                data:{
                    adAcount: this.adAcount,
                    recordDate: this.recordDate
                }
            }).then(res => {
              this.infoData = res.data
                this.infoData.recordDate = this.$moment(res.data.recordDate).format("YYYY-MM-DD ");
                if(this.infoData.queueImgUrl === ""){
                  this.queueFileList = []
                } else{
                  this.queueFileList = [{url: this.infoData.queueImgUrl}]
                }
                if(this.infoData.tellImgUrl === ""){
                  this.tellFileList = []
                } else{
                  this.tellFileList = [{url: this.infoData.tellImgUrl}]
                }
                for (let i in this.infoData.deptList) {
            if(this.infoData.deptList[i].text === this.infoData.deptName){
                this.listCode = i
            }
      }
      this.storeColumns = this.infoData.deptList[this.listCode].items
            })
    },
    //校验人数
    blur(){
       var reg = /^[1-9]\d{0,3}$/;//正整数
      if(this.infoData.peopleNum <= 0){
            this.$toast('请输入当前人数')
        }
        else if(!reg.test(this.infoData.peopleNum)){
            this.$toast('人数最大四位数')
        }
    },
    //班前会
    meetingChange(){
        if(this.infoData.meetState === "CONVENE_YES"){
            this.unusualShow = false
            this.infoData.exceptionList = []
        } else if(this.infoData.meetState === "CONVENE_NO") {
            this.unusualShow = true
        }
    },
    //下拉框
    showsType(){
        this.deptListPicker = true
    },
    deptListConfirm(value){
        this.deptListPicker = false
        this.infoData.deptName = value.text
        this.infoData.deptNo = value.code
        for (let i in this.infoData.deptList) {
            if(this.infoData.deptList[i].text === value.text){
                this.listCode = i
            }
      }
      this.storeColumns = this.infoData.deptList[this.listCode].items
      if(value !== ""){
        this.infoData.storeName = ""
      }
    },
    storeListConfirm(value){
        this.storeListPicker = false
        this.infoData.storeName = value.text
        this.infoData.storeNo = value.code
    },
    listChange(){
    },
    //行为安全增加按钮
    add() {
      if(this.timeDisabled === false){
        this.$router.push({
            name: "actionSafe",
            params: {
              keydata: this.infoData.questionLists
            }
          });
      }
    },
    //队列照片上传
    queueRead(file){
        this.photoFlag = "queue"
        let that = this;
      lrz(file.file, {
        width: 500,
        quality: 0.7 //自定义使用压缩方式
      })
        .then(function(rst) {
          that.handleUpload(rst);
        })
        .catch(function(error) {
          console.log("压缩失败", error);
        });
    },
    //交底照片上传
    tellRead(file){
        this.photoFlag = "tell"
        let that = this;
      lrz(file.file, {
        width: 500,
        quality: 0.7 //自定义使用压缩方式
      })
        .then(function(rst) {
          that.handleUpload(rst);
        })
        .catch(function(error) {
          console.log("压缩失败", error);
        });
    },
    handleUpload(file){
        let par = file.formData; //创建form对象
        this.$getData.keyUpload({
            method: "post",
            data: par
            }).then(res =>{
                if(this.photoFlag === "queue"){
                    this.infoData.queueImgUrl = res.data
                } else if(this.photoFlag === "tell"){
                    this.infoData.tellImgUrl = res.data
                }
            })
    },
    getparams(){
      console.log(this.$route.params.safedata,'aa',)
        if(this.$route.params.safedata !== undefined && this.$route.params.safedata !== null){
          // if(this.infoData.questionLists.qusflag === true){
            this.infoData.questionLists = this.$route.params.safedata
          // }
        }
    },
    tellDeleted(value){
      this.infoData.tellImgUrl = ""
    },
    queueDeleted(value){
      this.infoData.queueImgUrl = ""
    },
    //点击保存
    save() {
            if(this.infoData.id > 0){
                let par = { ...this.infoData }
            //     if(this.infoData.questionLists.length !== 0){
            //       if(this.infoData.questionLists[0].questionDesc === ""&&this.infoData.questionLists.length === 1){
            //     par.questionLists = []
            // }
            //     }
                // par.id = 0
                par.saveOrSubmit = this.saveOrSubmit
            this.$getData.keyActionSave({
                method: "post",
                data: par
            }).then(res => {
              this.find()
            })
            } else {
                this.popContent = '是否保存至草稿箱'
            let par = { ...this.infoData }
            par.saveOrSubmit = this.saveOrSubmit
            // if(this.infoData.questionLists.length !== 0){
            //       if(this.infoData.questionLists[0].questionDesc === ""&&this.infoData.questionLists.length === 1){
            //     par.questionLists = []
            // }
            //     }
            this.$getData.keyActionSave({
                method: "post",
                data: par
            }).then(res => {
              this.find()
            })
            }
        
    },
    //校验
    check(){
      var reg = /^[1-9]\d{0,3}$/;//正整数
      if(this.infoData.peopleNum <= 0){
            this.$toast('请输入当前人数')
        }
        else if(!reg.test(this.infoData.peopleNum)){
            this.$toast('人数最大四位数')
        }
        else if(this.infoData.meetState === ''){
            this.$toast('请选择 是否需要召开班前会')
        }
        else if(this.infoData.questionLists.length !== 0 && this.infoData.questionLists.questionDesc === ""){
            this.$toast('请填写问题')
        }else if(this.infoData.exceptionList.length === 0 && this.unusualShow === true){
            this.$toast('请选择 异常原因')
        } else{
          this.saveShow = true
        }
    },
    //提交
    submit(){
        if(this.infoData.id > 0){
            this.popContent = '是否要覆盖'
            this.check()
        } else if(this.infoData.id === 0){
            this.popContent = '是否保存至草稿箱'
            this.check()
        }
    },
    //点击确认
    confirm(){
        if(this.popContent === '是否保存至草稿箱') {
          this.save()
          this.saveShow = false
          this.cancelFlag = false
        }
        if(this.popContent === '是否要覆盖'){
        this.save()
        this.saveShow = false
        this.cancelFlag = false
        }
    },
    //取消
    cancel(){
        this.saveShow = false
    },
    btnsave(){
      this.saveOrSubmit = 1
          this.submit()
    },
    btnsubmit(){
      this.saveOrSubmit = 2
            this.submit()
    }
  },
  watch:{
      "$route": "getparams"
  }
};
</script>

<style lang="scss" scoped >
.punch {
  padding-bottom: 1rem;
}
.top {
  height: 40px;
}
.hide {
  display: none;
}
.aa {
  text-align: center;
}

.date {
  height: 115px;
  background-color: #719cd2;
}
.date p {
  margin: 0;
}
.date .month {
  padding-top: 10px;
}
.date .month .year {
  font-size: 15px;
  line-height: 24px;
  text-align: center;
  width: 90%;
  color: #fff;
}
.month .last {
  float: left;
  /* height: 30px; */
  margin-top: 7px;
  width: 10%;
  text-align: center;
  color: #fff;
}
.month .next {
  float: right;
  margin-top: -17px;
  width: 10%;
  text-align: center;
  font-size: 14px;
  color: #fff;
}
.date .weekdays {
  display: flex;
  font-size: 13px;
  margin-top: 15px;
  color: #fff;
}
.date .weekdays li {
  flex: 1;
  line-height: 24px;
  font-size: 16px;
  text-align: center;
  float: left;
}

.date .weekdays .six {
  color: red;
}
.date .weekdays .date .weekdays .days {
  display: flex;
  color: #fff;
}
.days li {
  flex: 1;
  font-size: 14px;
  text-align: center;
  margin-top: 5px;
  line-height: 30px;
  width: 14.28%;
  float: left;
  color: #fff;
}
.days .active {
  display: inline-block;
  width: 30px;
  height: 30px;
  color: #fff;
  border-radius: 50%;
  background-color: #4b77af;
}

.date .weekdays .days .other-month {
  color: #4a77b0;
}
.days li:nth-last-child(1),
.days li:nth-last-child(2) {
  color: red;
}
.clear {
  clear: both;
}
.content{
  height: 100%;
  padding-bottom: 1rem;
}
/* 班组长信息 */
.van-cell {
  padding-top: 10px;
  height: 48px;
  line-height: 48px;
  font-size: 16px;
}
.van-cell--large {
  padding: 0.2rem 0.2rem 0.2rem 0rem;
    line-height: 30px;
}
.van-cell--large .van-cell__title {
  text-align: left;
}
.info /deep/.van-field__control:disabled{
  padding-right: 15px;
    color: #333;
}
/* 详细信息 */
/deep/.info .van-cell__value {
  border-left: 1px solid #ebedf0;
  padding: 0.05rem 0 0.05rem 0;
}

/deep/.info .van-field__label {
  position: relative;
  padding-left: 18px;
  line-height: 40px;
  // border-top: 0.026667rem solid #ebedf0;
}
/deep/.info .van-cell__right-icon{
  padding-right: 15px;
  margin-top: 0.34rem;
}
//当前人数
/deep/.info .van-stepper__minus{
  background-color: rgb(224, 43, 43);
  border-radius: 50%;
  color: #fff;
  height: 18px;
  width: 18px;
  margin:0 10px;
}
/deep/.info .van-stepper__plus{
  background-color: rgb(16, 206, 41);
  border-radius: 50%;
  color: #fff;
  height: 18px;
  width: 18px;
  margin:0 10px;
}
/deep/.info .van-stepper__input{
  line-height: 0.746667rem;
}
//异常原因
/deep/.unusual .van-field__label {
  position: relative;
}
//行为安全
.add {
  position: relative;
  right: -3.8rem;
  top:0.15rem;
  color:#4b77af;
  font-size: 20px;
}
//图片上传
.photograph {
  font-size: 30px;
  width: 100px;
  height: 60px;
  line-height: 80px;
  text-align: center;
}
//提交按钮
.footer {
  position: fixed;
  bottom:0px;
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border: none;
}
.savebtn{
  background: #fff;
}
.noclickBtn {
      pointer-events: none;
      background: #ccc;
    }

//弹框
.popTitle{
  text-align: center;
  height: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
    font-size: 18px;
    font-weight: bold;
    span{
        padding-left: 10px;
    }
}
.popContent{
  height: 40%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  p{
    font-size: 16px;
  }
}
.popfooter{
  height: 25%;
  display: flex;
  justify-content: center;
}
//禁用
.noclick{
  pointer-events: none;
}
</style>