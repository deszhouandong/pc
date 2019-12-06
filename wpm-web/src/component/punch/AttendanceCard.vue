<template>
  <div class="attendanceCard clear">
    <div class="card-head">
      <b class="name">{{message.userName}}</b>
      <span class="num">
        本月异常考勤{{message.abnormalCheckinCount}}次
        <b class="line">|</b>
        异常确认{{message.abnormalConfirmedCount}}次
      </span>
    </div>
    <div
      class="card-normalTime"
    >正常时间：{{message.fromDate&&message.fromDate.slice(0, 5)}}-{{message.toDate&&message.toDate.slice(0, 5)}}</div>
    <div class="card-punchTime clear">
      <label for class="fl">打卡时间：</label>
      <div class="content fl">{{message.clockDateToStr}}</div>
    </div>
    <div class="card-location clear">
      <label for class="fl">打卡地点：</label>
      <div class="content fl">{{message.name}}</div>
      <div class="tag-isrange fl" v-if="message.realExtents">{{realExtents}}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.attendanceCard,
.attendanceCard * {
  box-sizing: border-box;
}

.attendanceCard {
  background: #fff;
  padding: 8px 0 0 26px;
  min-height: 162px;
  margin: 0 0 10px;
}

.card-head {
  margin-bottom: 10px;

  .name {
    font-size: 17px;
    color: #484848;
    line-height: 24px;
    margin-right: 14px;
  }

  .num {
    font-size: 13px;
    color: #d75252;
    line-height: 24px;
    vertical-align: 2px;

    .line {
      margin: 0 6px;
    }
  }
}

.card-normalTime {
  line-height: 24px;
  font-size: 17px;
  color: #484848;
  font-weight: 400;
}

.card-punchTime,
.card-location {
  color: $blue;
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
  margin: 10px 0;
}

.card-location {
  .content {
     max-width: 210px;
    text-align: justify;
    word-break: break-all;
    // @include ellipsis;
  }

  .tag-isrange {
    width: 42px;
    height: 14px;
    line-height: 14px;
    background: #5bce54;
    font-size: 10px;
    color: #fff;
    text-align: center;
    border-radius: 14px;
    margin-top: 2px;
    margin-left: 10px;

  }
}
</style>
<script>
export default {
  props: {
    message: {
      type: Object
    },
    enumerationInitialData: {
      type: Object,
      default: {}
    }
  },
  computed: {
    realExtents() {
      const that = this;
      let aim = "";
      if (this.enumerationInitialData.CheckinExtentsEnum) {
        this.enumerationInitialData.CheckinExtentsEnum.some(
          (item, index) => {
            if (item.enumValue === that.message.realExtents) {
              aim = item.description;
              return true;
            }
          }
        );
      }
      return aim;
    }
  }
};
</script>
