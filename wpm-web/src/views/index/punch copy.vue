<template>
  <div class="punch">
    <div class="punch-operate">
      <div class="time-zone">
        北京时间
        <span class="fr blue">{{getDayType()}}</span>
      </div>
      <div class="time-clock">
        <div class="time-clock-inner">
          <div class="clock-top">
            <span>{{time[0]}}</span>
            <!-- <span>{{time[1]}}</span> -->
            <span>{{week}}</span>
          </div>
          <div class="clock-count">{{time[1]}}</div>
        </div>
      </div>
      <div :class="['time-btn-wrap',isWeekDays?'':'disabled',confirmStatus==='CONFIRMED'?'disabled':'']">
        <div :class="['time-mask',showMask?'showMask':'',confirmStatus==='CONFIRMED'?'showMask':'']"></div>
        <div class="time-btn" :style="{opacity:showMask?0.5:1}" @click="delayGetCard">
          <div class="time-btn-inner">
            <b class="when">{{isWeekDays?initialData.checkinName:'暂无打卡'}}</b>
            <br />
            <span class="interval">{{interval}}</span>
          </div>
        </div>
      </div>
      <div class="history clear">
        <span class="fl">
          考勤截止:
          <span
            style="vertical-align:-0.03rem"
          >{{isWeekDays?initialData.checkinToDate:'00:00:00'}}</span>
        </span>
        <span class="fr">
          <router-link to="/punchHistory" class="blue">
            考勤历史
            <img :src="historyImgUrl" alt class="svg-history" />
          </router-link>
        </span>
      </div>
    </div>
    <div class="punch-list">
      <van-loading style="text-align:center;color:#666" v-if="initLoading" color="#666">加载中...</van-loading>
      <div v-else>
        <div v-if="!checkinRecordRespList.length" class="punch-noData">
          <p class="empty-text">暂无考勤数据</p>
        </div>
        <ul v-else>
          <li v-for="(item,index) in checkinRecordRespList" :key="index">
            <PunchItem
              :punchItemProps="item"
              :status="status"
              :enumerationInitialData="enumerationInitialData"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import PunchItem from "@/component/punch/PunchItem";
import { getWxClient } from "@/utils/env";
import { localeWeek } from "@/utils/time";
import { Dialog, Toast } from "vant";
import wx from "weixin-js-sdk"; // 引入企业微信的sdk

export default {
  name: "punch",
  components: {
    PunchItem
  },
  data() {
    return {
      confirmStatus:'',//已经打过卡，领导是否确认
      initLoading: true, //打卡列表loading
      isWeekDays: true, //是否为工作日
      historyImgUrl: require("../../../static/imgs/history.svg"),
      showMask: false, //隐藏打卡遮罩层
      initialData: {},
      interval: "", //正常打卡时间范围
      time: this.$moment()
        .format("YYYY-MM-DD HH:mm:ss")
        .split(" "),
      week: localeWeek(this.$moment().format("dddd")),
      timer: null,
      formaterDay: "",
      formaterTime: "",
      checkinRecordRespList: [],
      punchItemProps: {},
      status: {}, //枚举类
      enumerationInitialData: {} //所有枚举类
    };
  },

  methods: {
    // 判断网络状态
    networkState() {
      if (!Object.is(window.navigator.onLine, true)) {
        Toast("网络未连接");
      }
      window.addEventListener("online", online, false);
      window.addEventListener("offline", offline, false);
      function online() {
        Toast("网络已重新连接");
      }
      function offline() {
        Toast("网络连接已断开");
      }
    },
    //页面刚进来默认加载
    getInitial() {
      this.initLoading = true;
      this.$getData
        .attendanceInfoLoading({
          method: "post",
          data: {
            chooseDate: new Date()
            // chooseDate: this.$moment().add(1, 'days')._d
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.initialData = res.data;
            this.initLoading = false;
            this.checkinRecordRespList = res.data.checkinRecordRespList
              ? res.data.checkinRecordRespList
              : [];
            const { checkinDateId } = this.initialData;
            // 判断是否存已经打过卡以及领导确认过
            let confirmStatus='';
            this.checkinRecordRespList.some((item, index) => {
              if (item.checkinDateId === checkinDateId) {
                confirmStatus=item.comfirmType
                return true;
              }
            });
            this.confirmStatus=confirmStatus

            const { fromDate, toDate, dayType } = this.initialData;
            if (dayType === "WEEKEND" || dayType === "HOLIDAY") {
              this.isWeekDays = false;
              this.interval = `00:00 - 00:00`;
            } else {
              this.isWeekDays = true;
              this.interval = `${fromDate.slice(0, 5)} - ${toDate.slice(0, 5)}`;
            }
            this.enumeration(res.enumVal);
            this.enumerationInitial(res.enumVal);
          }
        })
        .catch(() => {
          this.initLoading = false;
        });
    },
    // 拼接枚举类
    enumeration(str) {
      var arr = str.ComfirmEnum;
      arr = JSON.parse(arr);
      for (var i = 0; i < arr.length; i++) {
        this.status[arr[i].enumValue] = arr[i].description;
      }
      arr = str.CheckinEnum;
      arr = JSON.parse(arr);
      for (var i = 0; i < arr.length; i++) {
        this.status[arr[i].enumValue] = arr[i].description;
      }
      arr = str.DayTypeEnum;
      arr = JSON.parse(arr);
      for (var i = 0; i < arr.length; i++) {
        this.status[arr[i].enumValue] = arr[i].description;
      }
    },
    enumerationInitial(str) {
      let enumerationInitialData = {};
      for (let index in str) {
        enumerationInitialData[index] = JSON.parse(str[index]);
      }
      this.enumerationInitialData = enumerationInitialData;
    },
    // 通过枚举类获取当前是否为节假日
    getDayType() {
      const that = this;
      let aim = "";
      if (JSON.stringify(this.enumerationInitialData) != "{}") {
        this.enumerationInitialData.DayTypeEnum.some((item, index) => {
          if (item.enumValue === that.initialData.dayType) {
            aim = item.description;
          }
        });
      }
      return aim;
    },


    // 点击按钮打卡
    getCard() {
      this.showMask = true;
      const { checkinDateId } = this.initialData;
      // 判断是否存已经打过卡
      const exist = this.checkinRecordRespList.some((item, index) => {
        if (item.checkinDateId === checkinDateId) {
          return true;
        }
      });
      if (exist) {
        Dialog.confirm({
          title: "提示信息",
          message: "是否覆盖已有的考勤记录?"
        })
          .then(() => {
            this.getLocationLat(checkinDateId,{
              type:'replace'
            });
          })
          .catch(error => {
            this.showMask = false;
          })
          .finally(() => {
            this.networkState();
          });
      } else {
        // 先获取经纬度
        this.getLocationLat(checkinDateId,{
          type:'add'
        });
      }
    },
       //获取经纬度
    getLocationLat(checkinDateId,way) {
      const that = this;
      if (getWxClient() === "other") {
        this.showMask = false;
      }

      wx.ready(function() {
        wx.getLocation({
          type: "gcj02",
          success: function(response) {
            that.latitude = response.latitude; // 纬度，浮点数，范围为90 ~ -90
            that.longitude = response.longitude; // 经度，浮点数，范围为180 ~ -180。
            that.getPunch(checkinDateId,way);
          },
          complete: function(response) {
            // this.showMask = false;
          },
          fail: function(response) {
            Dialog.alert({
              message: "请开启手机授权地理位置"
            }).then(() => {
              // on close
              window.location.reload();
            });
            this.showMask = false;
          },
          cancel: function(response) {
            Dialog.alert({
              message: "请开启手机授权地理位置"
            }).then(() => {
              // on close
            });
            //  window.location.reload();
          }
        });
      });
    },
    //调用接口打卡
    getPunch(checkinDateId,way) {
      let that = this;
      this.$getData
        .punchClock({
          method: "post",
          data: {
            lng: that.longitude,
            lat: that.latitude,
            checkinDateId: checkinDateId
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.showMask = false;
            const {type}=way;
            if(type==='add'){
              // this.checkinRecordRespList
              // this.checkinRecordRespList.push()
            }else if(type==='replace'){

            }
            this.getInitial();
          } else {
            this.showMask = false;
            // that.isdisabledFn = false;
          }
        })
        .catch(function(error) {
          this.showMask = false;
          // that.isdisabledFn = false;
        });
    }
  },
  mounted() {
    this.getInitial();
    document.title = "在线考勤";
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },

  created() {
    this.delayGetCard=this._.debounce(this.getCard,300)
    this.timer = null;
    this.timer = setInterval(() => {
      const time = this.$moment()
        .format("YYYY-MM-DD HH:mm:ss")
        .split(" ");
      const week = localeWeek(this.$moment().format("dddd"));
      this.time = time;
      this.week = week;
    }, 1000);
  }
};
</script>
<style lang="scss">
 #app{
      height: calc(100% - 50px);
 }
</style>

<style scoped lang='scss'>

.punch {
  background: #fff;
}

.punch * {
  @include box-sizing;
}

.punch-operate {
  .time-zone {
    padding: 13px 20px;
    color: $blue;
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
  }

  .time-clock-wrap {
    background: linear-gradient(
      180deg,
      rgba(126, 194, 246, 1) 0%,
      rgba(72, 143, 235, 1) 100%
    );
    padding: 10px;
    width: 130px;
    height: 130px;
  }

  .time-clock {
    text-align: center;
    color: #6cb1f2;
    margin-bottom: 21px;

    .time-clock-inner {
      display: inline-block;

      .clock-top {
        font-size: 14px;
        line-height: 20px;
      }

      .clock-count {
        line-height: 45px;
        font-size: 32px;
        font-weight: bold;
      }
    }
  }

  .time-btn-wrap {
    width: 130px;
    height: 130px;
    margin: 0 auto;
    border-radius: 50%;
    background: rgb(241, 248, 254);
    padding: 10px;
    position: relative;
    box-sizing: border-box;
    // background:linear-gradient(180deg,rgba(126,194,246,1) 0%,rgba(72,143,235,1) 100%);
    &.disabled {
      background: #f9f9f9;
      .time-mask {
        display: block;
      }
      .time-btn {
        background: #efefef;
        .time-btn-inner {
          color: rgba(72, 72, 72, 0.4);
        }
      }
    }
    .time-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      border-radius: 50%;
      background: transparent;
      display: none;

      &.showMask {
        display: block;
        z-index: 1;
      }
    }
    .time-btn {
      border-radius: 50%;
      background: linear-gradient(
        180deg,
        rgba(126, 194, 246, 1) 0%,
        rgba(72, 143, 235, 1) 100%
      );
      text-align: center;
      line-height: 110px;

      .time-btn-inner {
        display: inline-block;
        line-height: 1;
        color: #fff;
        vertical-align: middle;

        .when {
          font-size: 18px;
          font-weight: bold;
          line-height: 25px;
        }

        .interval {
          line-height: 13px;
          font-size: 9px;
          font-weight: 400;
        }
      }
    }
  }

  .history {
    color: $blue;
    font-size: 14px;
    line-height: 17px;
    padding: 3px 10px 11px;
    margin: 0 10px 9px;
    border-bottom: 1px solid rgba(104, 160, 232, 0.1);
  }
}

.punch-list {
  margin-top: -9px;
  li {
    // margin: 9px 0;
    position: relative;
  }
}
.punch-noData {
  color: #484848;
  text-align: center;
  font-weight: 500;
  line-height: 25px;
  font-size: 18px;
  margin-top: 106px;
}
.svg-history {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-left: 3px;
}
</style>
