<template>
  <div class="punchItem clear" @click="toAppeal(punchItemProps.id)">
    <div class="fl">
      <div class="type">
        <span class="radius">
          <span class="dashline"></span>
        </span>
        <span class="txt">{{punchItemProps.checkinName}}</span>
      </div>
      <div :class="{clockTime:true,red:punchItemProps.clockDateToStr?false:true}">
        打卡时间
        {{punchItemProps.clockDateToStr?punchItemProps.clockDateToStr.slice(0, 5):'缺失'}}
      </div>
      <div class="area">
        <span :class="{loaction:true}">
          <img :src="locationImgUrl" alt class="svg-location" />
          <span class="loaction-inner">
          {{punchItemProps.name?punchItemProps.name:'打卡地点缺失'}}
          </span>
          <!-- {{punchItemProps.name?punchItemProps.name:'打卡地点缺失'}} -->
        </span>
      </div>
      <div class="confirm" v-if="punchItemProps.comfirmType == 'CONFIRMED'">
        <!-- {{punchItemProps.comfirmTime}} -->
        {{punchItemProps.leaderName}}
        {{punchItemProps.finalOpinion||punchItemProps.currentOpinion}}
        <span
          class="red toAppeal"
          v-if="punchItemProps.appealStatus == '未申诉'  &&
            punchItemProps.comfirmType == 'CONFIRMED' &&
            punchItemProps.checkinStatus != 'NORMAL' &&
            punchItemProps.checkinStatus != 'VACATION'"
        >去申诉</span>
      </div>
      <div class="confirm" v-if="punchItemProps.comfirmType === 'UNCONFIRMED'">
        <span class="brown">{{status[punchItemProps.comfirmType]}}</span>
      </div>
    </div>
    <div class="fr">
      <div
        :class="['status',statusClass[ punchItemProps.abnormalCheckinStatus||punchItemProps.checkinStatus]]"
        v-if="punchItemProps.comfirmType&&punchItemProps.comfirmType==='CONFIRMED'"
      >{{status[punchItemProps.checkinStatus]||status[punchItemProps.abnormalCheckinStatus] }}</div>
      <div
        v-else
        :class="['status',statusClass[punchItemProps.dayType]]"
      >{{status[punchItemProps.dayType]}}</div>
      <div class="tag-isrange" v-if="realExtents">{{realExtents}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PunchItem",
  props: {
    punchItemProps: {
      type: Object,
      default: {}
    },
    status: {
      type: Object,
      default: {}
    },
    enumerationInitialData: {
      type: Object,
      default: {}
    }
  },
  methods: {
    toAppeal(id) {
      if (
        this.punchItemProps.appealStatus == "未申诉" &&
        this.punchItemProps.comfirmType == "CONFIRMED" &&
        this.punchItemProps.checkinStatus != "NORMAL" &&
        this.punchItemProps.checkinStatus != "VACATION"
      ) {
        const pathType = this.$route.path.replace("/", "");
        this.$router.push({
          path: "/leaderConfirm",
          query: {
            id,
            pathType,
            appeal: true
          }
        });
      }
    }
  },
  computed: {
    realExtents() {
      const that = this;
      let aim = "";
      if (this.enumerationInitialData.CheckinExtentsEnum) {
        this.enumerationInitialData.CheckinExtentsEnum.some((item, index) => {
          if (item.enumValue === that.punchItemProps.realExtents) {
            aim = item.description;
            return true;
          }
        });
      }
      return aim;
    }
  },
  data() {
    return {
      locationImgUrl: require("../../../static/imgs/location.svg"),
      statusClass: {
        ABSENTEEISM: "red",
        EARLYLEAVE: "red",
        LATE: "red",
        NORMAL: "blue",
        UNCONFIRMED: "brown",
        VACATION: "red",
        CONFIRMED: "blue",
        WEEKEND: "blue",
        WORKINGDAY: "blue",
        HOLIDAY: "blue"
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.punchItem {
  border-bottom: 1px solid rgba(104, 160, 232, 0.1);
  padding: 10px 0;
  margin: 0 16px 0 28px;
  position: relative;

  .dashline {
    width: 0;
    height: 88px;
    display: inline-block;
    border-left: 1px dashed #f4f4f4;
    position: absolute;
    left: 3.5px;
    top: 14px;
  }

  .fl {
    line-height: 17px;
    position: relative;

    // padding-left: 12px;
    .type {
      font-size: 12px;
      color: #484848;

      .radius {
        display: inline-block;
        margin-right: 2px;
        width: 8px;
        height: 8px;
        border-radius: 100%;
        background: linear-gradient(
          180deg,
          rgba(139, 202, 247, 1) 0%,
          rgba(83, 154, 237, 1) 100%
        );
        position: absolute;
        left: -13px;
        top: 5px;
      }

      .txt {
        color: $blue;
      }
    }

    .clockTime {
      font-weight: bold;
      margin: 2px 0;
    }

    .loaction {
      // width: 210px;
      display: inline-block;
      font-size: 13px;
      .loaction-inner{
        display: inline-block;
      max-width: 260px;
      text-align: justify;
      word-break: break-all;
      vertical-align: top;
      }
      // @include ellipsis;
    }

    .confirm {
      font-size: 13px;
      margin: 2px 0 0;

      .toAppeal {
        margin-left: 10px;
      }

      .confirm-status {
        margin-left: 10px;
        color: $blue;
      }
    }
  }

  .fr {
    .status {
      color: $blue;
      height: 38px;
      text-align: right;
    }

    .tag-isrange {
      width: 42px;
      height: 14px;
      line-height: 16px;
      background: #5bce54;
      font-size: 10px;
      color: #fff;
      text-align: center;
      border-radius: 14px;
    }
  }
  .svg-location {
    width: 8px;
    height: 12px;
    // vertical-align: -1.5px;
    vertical-align:middle;
    margin:-1px 3px 0 0;
  }
}
</style>
