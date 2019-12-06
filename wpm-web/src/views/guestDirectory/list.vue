<template>
  <div class="wrap">
    <div class="list-header">
      <div class="header-title" @click="showCalendar">{{title}}</div>
      <van-popup v-model="popshow" position="bottom" :style="{ height: '70%' }">
        <div>
          <calendar></calendar>
          <inlineCalendar @change="handelChange" :defaultDate="defaultDate" />
        </div>
      </van-popup>
    </div>
    <div class="g-ist-main">
      <guestlist :guestList="guestList" />
    </div>
    <div class="list-bottom" v-show="modelType != 20">
      <div class="re-contain">
        <div class="b-left">{{currentTime}}</div>
        <div class="b-right" @click="gotodetail()">+访客记录</div>
      </div>
    </div>
  </div>
</template>
<script>
import Vuex from "vuex";
import moment from "moment";
import guestlist from "@/component/guestlist";
import { listVisitorsRecordForState } from "@/apis/guestrecord";
import { formatTime, setlocalStorage } from "@/utils/format";

export default {
  components: {
    guestlist
  },
  data() {
    return {
      showbottom: false,
      currentTime: "--:--:--",
      guestList: [],
      year: "",
      curweek: "",
      curMonday: "",
      curSunday: "",
      curmon: "",
      cursun: "",
      defaultDate: "",
      popshow: false,
      title: "",
      modelType: "",
      adAcount: ""
    };
  },
  created() {
    this.countDown();
  },
  mounted: function() {
    let now = "";
    if (this.$route.query.startTime) {
      now = this.$route.query.startTime;
      if (this.$route.query.modelType) {
        this.modelType = this.$route.query.modelType;
        if (this.$route.query.modelType == 20 && this.$route.query.adAcount)
          this.adAcount = this.$route.query.adAcount;
      }
    } else {
      now = moment().valueOf();
    }
    this.defaultDate = moment().format("YYYY-MM-DD");
    this.formatTime(now);
  },
  methods: {
    handelChange(date) {
      this.formatTime(date.$d);
    },
    countDown() {
      // 时钟
      this.currentTime = moment()
        .add("seconds", 1)
        .format("HH:mm:ss");
      setInterval(() => {
        this.currentTime = moment()
          .add("seconds", 1)
          .format("HH:mm:ss");
      }, 1000);
    },
    formatTime(t) {
      // this.curweek = this.getYearWeek(t); //获取一年的第几周
      this.curmon = this.getcurDay(t);
      this.cursun = this.addDate(this.curmon);
      this.curMonday = moment(this.curmon).format("MM-DD");
      this.curSunday = moment(this.cursun).format("MM-DD");
      this.title =
        this.year +
        "年 第" +
        this.curweek +
        "周 " +
        this.curMonday +
        "至" +
        this.curSunday;
      document.title = "访客记录";
      this.queryList();
    },
    getYearWeek(t) {
      this.year = moment(t).get("year");
      let dateNow = moment(t).valueOf(); //当前时间
      let yearoffirst = moment(t)
        .startOf("year")
        .valueOf(); //当前年的第一天
      let weekofday = moment(yearoffirst).format("E");
      let firstMon = "";
      //当前年第一个周一
      if (weekofday === 1) {
        firstMon = yearoffirst;
      } else {
        firstMon = moment(yearoffirst)
          .add(8 - weekofday, "days")
          .format("YYYY-MM-DD");
      }
      let dataNumber = Math.round((dateNow - yearoffirst) / 86400000);
      return Math.ceil((dataNumber - (moment(yearoffirst).get("day") - 1)) / 7);
    },
    getcurDay(t) {
      let weekofday = moment(t).format("E");
      let curday = moment(t).subtract(weekofday - 1, "days");
      this.curweek = this.getYearWeek(curday); //获取一年的第几周
      return curday;
    },
    addDate(t) {
      //加7天
      let weekLastday = moment(t).add(6, "days");
      return weekLastday;
    },
    queryList() {
      let startTime = moment(this.curmon).format("YYYY-MM-DD");
      let endTime = moment(this.cursun).format("YYYY-MM-DD");
      let adAcount = this.adAcount;
      listVisitorsRecordForState({ startTime, endTime, adAcount }).then(res => {
        this.formatarrTime(res.data);
        this.$nextTick(() => {
          let offsetTop = +sessionStorage.getItem("offsetTop");
          if (offsetTop)
            setTimeout(() => {
              document.scrollingElement.scrollTop = offsetTop;
            }, 0);
        });
      });
    },
    formatarrTime(arr) {
      arr.forEach(item => {
        item.arriveDate = formatTime(item.arriveDate, "second");
        item.leaveDate = formatTime(item.leaveDate, "second");
      });
      this.guestList = arr;
    },
    gotodetail() {
      setlocalStorage("formdata", "");
      setlocalStorage("selectedArr", "");
      sessionStorage.setItem("offsetTop", document.scrollingElement.scrollTop);
      this.$router.push("visitorDetail");
    },
    showCalendar() {
      this.popshow = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.list-header {
  background: #fff;
  text-align: center;
  height: 50px;
  line-height: 50px;
  .header-title {
    color: #333;
    font-size: 16px;
    line-height: 50px;
  }
}
.list-bottom {
  height: 58px;
  background: #4b77af;
  color: #fff;
  border-radius: 30px;
  width: 80%;
  margin-left: 10%;
  position: fixed;
  bottom: 30px;
}
.re-contain {
  display: flex;
  font-size: 15px;
  width: 100%;
  div {
    width: 50%;
    text-align: center;
    line-height: 58px;
  }
  div.b-left {
    border-right: 1px solid #fff;
    height: 21px;
    margin-top: 18px;
    vertical-align: middle;
    line-height: 25px;
  }
}
</style>