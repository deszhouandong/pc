<template>
  <div class="list-con">
    <div
      class="solo"
      v-for="(item,index) of guestList"
      :key="index"
      @click="gotoDetail(item,'details')"
    >
      <div class="title flex">
        <span class="company-icon"></span>
        <span class="com-title">{{item.visitObjectName}}</span>
      </div>
      <div class="half border">
        <div class="info">
          <span class="gray">开始时间：</span>
          <span>{{item.arriveDate}}</span>
        </div>
        <div class="info">
          <span class="gray">访客地址：</span>
          <span>{{item.arriveProvice}}{{item.arriveCity}}{{item.arriveAddress}}{{item.arriveDescribe}}</span>
        </div>
      </div>
      <div class="half">
        <div class="info">
          <span class="gray">结束时间：</span>
          <span>{{item.leaveDate}}</span>
        </div>
        <div class="info">
          <span class="gray">访客地址：</span>
          <span>{{item.leaveProvice}}{{item.leaveCity}}{{item.leaveAddress}}{{item.leaveDescribe}}</span>
        </div>
      </div>
      <div class="operating" v-if="item.visitState === 1 && currentUser === item.adAcount">
        <span class="delete" @click="deleteRecord(item,index)">删除</span>
        <span class="improve-info" @click="gotoDetail(item,'perfect')">请点击完善信息</span>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog, Toast } from "vant";
import Cookie from "@/apis/cookie";
import { deleteVisitorsRecord } from "@/apis/guestrecord";
export default {
  data() {
    return {
      currentUser: ""
    };
  },
  props: {
    guestList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  created() {
    document.body.style.backgroundColor = "#f4f4f4";
    this.currentUser = Cookie.cookie.get("accountName");
  },
  watch: {
    guestList: function() {}
  },
  methods: {
    gotoDaylist() {
      if (!this.isOperate) this.$router.push("visitordaylist");
    },
    deleteRecord(item, index) {
      Dialog.confirm({
        title: "提示信息",
        message: "是否删除记录?"
      })
        .then(() => {
          this.fetchDeleterecord(item, index);
        })
        .catch(() => {
          // on cancel
        });
    },
    fetchDeleterecord(item, index) {
      let visitState = item.visitState;
      let id = item.id;
      deleteVisitorsRecord({ id, visitState }).then(res => {
        this.guestList.splice(index, 1);
        Toast("删除成功");
      });
    },
    gotoDetail(item, type) {
      sessionStorage.setItem("offsetTop", document.scrollingElement.scrollTop);
      let readOnly = "";
      if (item.visitState === 1 && type === "details") {
        return;
      }
      if (item.visitState !== 1) {
        readOnly = "readonly";
      }
      this.$router.push({
        name: "visitorDetail",
        query: { id: item.id, type: readOnly }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$border: 1px solid rgba(75, 119, 175, 0.2);
.list-con {
  margin-bottom: 90px;
}
.solo {
  padding: 24px 22px;
  background: #fff;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0 2px 10px rgba(199, 197, 197, 0.5);
}
.title {
  display: flex;
  margin: -5px 0 10px 0;
  span {
    font-size: 17px;
    font-weight: 700;
    line-height: 20px;
  }
}
.company-icon {
  display: inline-block;
  vertical-align: bottom;
  background: url(../../static/imgs/company.png) no-repeat center bottom;
  background-size: 16px 17px;
  height: 20px;
  width: 17px;
  margin-right: 5px;
  flex-shrink: 0;
  margin-top: -3px;
}
.com-title {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.info {
  display: flex;
  margin-top: 10px;
  overflow: hidden;
  span {
    font-size: 15px;
    font-weight: normal;
    line-height: 17px;
    min-height: 17px;
  }
  span:first-child {
    width: 150x;
    color: #7b7b7b;
  }
  span:last-child {
    padding-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.border {
  border-bottom: $border;
  padding-bottom: 12px;
}
.operating {
  border-top: $border;
  display: flex;
  margin-top: 10px;
  padding-top: 10px;
  font-size: 15px;
  justify-content: flex-end;
  margin-bottom: -10px;
}
.delete {
  color: #d75252;
  padding-right: 10px;
}
.improve-info {
  color: #4b77af;
  border-left: 2px solid #4b77af;
  padding-left: 10px;
}
</style>