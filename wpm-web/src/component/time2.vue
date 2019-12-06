<template>
  <div class="biji">
 
   <!-- <div>时间段:{{starttime}}至{{endtime}}</div> -->
 
    <!-- <div class="mobile-top">
      <div class="sel-time">
        <p>开始时间</p>
        <p class="start-date">{{time.starttime}}</p>
      </div>
      <div class="unsel-time">
        <p>结束时间</p>
        <p class="end-date">{{time.endtimee==''?'请选择结束日期':time.endtime}}</p>
      </div>
    </div> -->
 
    <div class="title">
      <div class="titleRight">
        <div class="btn" :class="(Year<=nowYear)?'noclick':'' " @click="lastYear()">
          <van-icon name="arrow-left"  />
        </div>
        <div>{{Year}}年</div>
        <div class="btn" @click="nextYear()">
          <van-icon name="arrow" />
          </div>
      </div>
      <div class="titleRight">
        <div class="btn" :class="(month<=nowmonth)&&(Year<=nowYear)?'noclick':'' " @click="last()">
          <van-icon name="arrow-left"  />
        </div>
        <div>{{month}}月</div>
        <div class="btn" @click="next()">
          <van-icon name="arrow" />
          </div>
      </div>
    </div>
 
    <div class="head">
      <div class="days" v-for="(item,index) in ['周日','周一','周二','周三','周四','周五','周六',]" :key="index">
        {{item}}
      </div>
    </div>
 
    <div class="wrap">
      <div class="span" v-for="(item,index) in calendarList" :key="index" @click="click(item.count)" :class="getstartDate(item.count) ? 'noclick' 
      :item==''?'kong'
      :item.count<nowtime?'noclick'
      :item.count===starttime?'active': ''" >
        {{item.value}}
      </div>
      <div style="width:100%;border-bottom: 1px solid #ccc;position:absolute;top:1.4rem;"></div><br>
      <div style="width:100%;border-bottom: 1px solid #ccc;position:absolute;top:2.8rem;"></div><br>
      <div style="width:100%;border-bottom: 1px solid #ccc;position:absolute;top:4.2rem;"></div><br>
      <div style="width:100%;border-bottom: 1px solid #ccc;position:absolute;top:5.6rem;"></div><br>
      <div style="width:100%;border-bottom: 1px solid #ccc;position:absolute;top:7rem;"></div><br>
      <div style="width:100%;border-bottom: 1px solid #ccc;position:absolute;top:8.4rem;"></div><br>
    </div>
 
    <div class="bottombtn">
      <van-button type="info"  @click='cancle()' style="height:50px;line-height:30px;width:50%;background-color: #fff;color:#000;font-weight: bold;font-size: 16px;border: 1px solid #ccc;">重置</van-button>
      <van-button type="info"  @click='firm()' style="height:50px;line-height:30px;width:50%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;">确定</van-button>
      <!-- <button class="cancle-btn" @click='cancle()'>取消</button>
      <button class="sure-btn" @click='firm()'>确定</button> -->
    </div>
  </div>
</template>
 
<script>
  export default {
    name: 'Biji',
    data() {
      return {
        time:{},
        serverTime:'',
        nowtime: '', //当前日期的时间戳
 
        clickitem: 0, //点击的时间戳
        clickcount: 0, //点击次数
        starttime: '', //开始时间 数字   默认选中当天日期
        endtime: '', //结束时间 数字
 
        Year: new Date().getFullYear(),   //日历上的年份
        month: new Date().getMonth() + 1, //日历上的月份
        Day: new Date().getDate(),        //日历上的天份
 
        nowYear: new Date().getFullYear(),
        nowmonth: new Date().getMonth() + 1,
        nowDay: new Date().getDate(),
 
        calendarList: [],
      }
    },
    created() {
      this.Draw(this.nowYear, this.nowmonth);
 
      let time_month = this.nowmonth; //现在的月份
      let time_day = this.nowDay; //现在的天数
      if (this.nowmonth < 10) {
        time_month = 0 + '' + this.nowmonth;
      }
      // if (this.nowDay < 10) {
      //   time_day = 0 + '' + this.nowDay;
      // }
      this.nowtime = this.nowYear + '-' + time_month + '-' + time_day;
      this.starttime = this.nowtime;
      this.endtime = this.nowtime;
      this.time = this.starttime
    },
    props:["getdata"],

    methods: {
      getstartDate(item){
        let data = false
        if(item < this.getdata){
          data =true
        }
        return data
      },
      Draw: function (Year, Month) {
        //日期列表
        var calendar = [];
 
        //用当月第一天在一周中的日期值作为当月离第一天的天数(获取当月第一天是周几)
        for (var i = 1, firstDay = new Date(Year, Month - 1, 1).getDay(); i <= firstDay; i++) {
           calendar.push("");
        }
 
        //用当月最后一天在一个月中的日期值作为当月的天数
        for (var i = 1, monthDay = new Date(Year, Month, 0).getDate(); i <= monthDay; i++) {
 
          let time_month = Month;
          let time_day = i;
          if (Month < 10) {
            time_month = 0 + '' + Month;
          }
          if (i < 10) {
            time_day = 0 + '' + i;
          }
 
          calendar.push({
            value: i,
            count: Year + '-' + time_month + '-' + time_day
          })
        }
        this.calendarList = calendar;
      },

      lastYear(){
        this.Year--;
      },

      nextYear(){
        this.Year++;
      },
 
      last() {
        this.month--;
        if (this.month == 0) {
          this.month = 12;
          this.Year--;
        }
 
        this.Draw(this.Year, this.month);
      },
 
      next() {
        this.month++;
        if (this.month == 13) {
          this.month = 1;
          this.Year++;
        }
 
        this.Draw(this.Year, this.month);
      },
 
 
      click(item) {
        this.serverTime = item
        this.clickcount++;
        this.clickitem = item;
      this.starttime = item;
      this.time=this.starttime; 
        //开始日期
        // if (this.clickcount % 2 == 1) {
        //   this.starttime = this.clickitem;
        //   this.endtime = ''
        // } else {
        //   this.endtime = this.clickitem;
        //   if (this.starttime > this.endtime) {
        //     this.endtime = this.starttime;
        //     this.starttime = this.clickitem;
        //   }
        // }
        // this.time.starttime = this.starttime
        // this.time.endtime = this.endtime
      },
 
 
      firm(){
        this.$emit('timedata',this.time)
      },
 
      cancle(){
      this.starttime = this.nowtime;
      this.endtime = this.nowtime;
      }
    },
 
  }
 
</script>
 
<style scoped lang="scss">
.biji{
    position: fixed;
    bottom: 0px;
    background: #fff;
}
  .wrap {
    width: 100%;
    height: auto;
    overflow: hidden;
    padding-bottom: 1rem;
    margin: 0;
    position: relative;
  }
 
  .span {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: #fff;
    color: #333;
    float: left;
    text-align: center;
    line-height: 0.8rem;
    margin:0.3rem 0rem 0.3rem 0.58rem;
    font-size: 16px;
 
    &.active {
      background: #037ef5;
      color: #fff;
    }
 
    &.noclick {
      pointer-events: none;
      background: #e8e8e9;
    }
 
    &.kong {
      background: #fff;
      pointer-events: none;
    }
  }
 
  .mobile-top {
    display: flex;
    flex-wrap: nowrap;
    background: #fff;
    padding: 0.1rem 0;
    .sel-time {
      text-align: center;
      width: 50%;
      // border-bottom: solid 2px #2a81e8;
      .start-date{
        color: #b1b1b1;
        margin-top: 0.05rem;
      }
    }
 
    .unsel-time {
      text-align: center;
      width: 50%;
      .end-date{
        color: #b1b1b1;
         margin-top: 0.05rem;
      }
    }
  }
 
  .title{
    font-size: 16px;
    width: 100%;
    height: 44px;
    background-color: #f7f7f8;
    display: flex;
    flex-wrap: nowrap;
    text-align: center;
    color: #333;
    line-height: 44px;
    .titleRight{
      width: 50%;
    display: flex;
    justify-content: space-around;
    text-align: center;
    color: #333;
    line-height: 40px;
    .btn{
      font-size: 0.64rem;
      width: 1.2rem;
      color:#60a7e8;
      font-weight: bold;
      &.noclick{
        pointer-events: none;
         color: #ccc;
      }
    }
    .text{
      flex: 1;
    }
    }
  }
 
  .head{
    background-color: #f7f7f8;
  display: flex;
  flex-wrap: nowrap;
  text-align: center;
  height: 20px;
  line-height: 20px;
  .days{
    flex: 1;
  }
  }
 
 
 
  .bottombtn {
    // height: 40px;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
 
    button {
      flex: 1;
    }
 
    .sure-btn {
      background: #037ef5;
 
      color: #fff;
    }
  }
//  .van-button--normal {
//     width: 40%;
//     height: 0.8rem;
//     line-height: 0.8rem;
//   }
</style>
