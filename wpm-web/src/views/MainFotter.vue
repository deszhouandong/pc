<template>
  <div class="mianFotter">
      <router-view />
    <!-- <div class> -->
      <van-tabbar v-model="active">
        <van-tabbar-item icon="home-o" @click="changRouter('punch')">打卡</van-tabbar-item>
        <!-- <van-tabbar-item icon="search" @click="changRouter('checkDetail')">地图</van-tabbar-item> -->
        <van-tabbar-item icon="search" @click="changRouter('attendanceRecord')">地图</van-tabbar-item>
      </van-tabbar>
    <!-- </div> -->
  </div>
</template>

<script>
import querystring from 'querystring';
export default {
  data() {
    return {
      active: 0
    };
  },
  created(){
    const {currentIndex=0}=querystring.parse(window.location.hash.split('?')[1])
    this.active=Number(currentIndex)
  },
  methods: {

    menuChange(index) {
      const currentHref=window.location.href.split('?')
      const newUrl = `${currentHref[0]}?currentIndex=${index}`
      window.history.replaceState(null, null, newUrl);
    },
    changRouter(str) {
      this.$router.push(str);
      if(str == 'punch') {
        this.active = 0
      }else {
        this.active = 1
      }
      this.menuChange(this.active)
    }
  },

};
</script>

<style scoped lang="scss">
/deep/.van-tabbar {
  background: #f4f4f4;

}
.mianFotter{
  padding-bottom: 50px;
}
</style>
