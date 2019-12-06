<template>
  <div id="app">
    <!-- <keep-alive include="keyAction,actionSafe">
      <router-view/>
    </keep-alive>-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!($route.meta&&$route.meta.keepAlive)"></router-view>
    <water ref="initwart"></water>
  </div>
</template>

<script>
import water from "@/component/watermarker";

import wx from "weixin-js-sdk"; // 引入企业微信的sdk
import cookieOperation from "@/apis/cookie";
export default {
  name: "App",
  components: {
    water
  },
  data() {
    return {
      userName: ""
    };
  },
  created() {
    this.getSaasUser();
  },
  mouted() {
    this.$refs.initwart.initWaterMark(this.userName);
    // wx.ready(function() {
    //   wx.hideAllNonBaseMenuItem();
    // });
  },
  methods: {
    getSaasUser() {
      this.$getData
        .getCurrent({
          method: "post"
        })
        .then(res => {
          this.userName = res.data.accountName;
          cookieOperation.cookie.set(
            "accountName",
            res.data.accountName,
            1000 * 60 * 60 * 24
          );
          localStorage.setItem("personName", res.data.name);
          this.$refs.initwart.initWaterMark(this.userName);
        })
        .catch(function(error) {
          console.log("error" + error);
        });
    }
  }
};
</script>

<style scoped>
#app {
  /* padding-bottom:50px; */
  box-sizing: border-box;
}
</style>




