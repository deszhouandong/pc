<template>
  <div  @touchend="touchend" @touchmove="touchmove" @touchstart="touchstart">
    <van-popup v-model="loadFlag" >
      <van-loading class="load" size="24px" vertical >加载中...</van-loading>
    </van-popup>
    <div class="travelPlan" v-if="!loadFlag">
      <!-- 导航栏 -->
      <van-nav-bar
        @click-left="onClickLeft"
        style="color:#333;margin-bottom:10px;margin-bottom:10px;"
      >
      <div slot="left" v-if="this.$route.query.id > 0 ? false : true">
        <van-icon name="arrow-left" style="color:#4B77AF;padding-bottom: 0.05rem;"  />
        <span style="color:#007AFF;padding-top:0.2rem;font-size:0.426667rem;">出差回顾</span>
      </div>
      <div slot="title"
      v-if="this.$route.query.id > 0 ? false : true"
      >招待回顾</div>
      <div slot="title" style="height:48px;" class="navTit"
      v-if="this.$route.query.id > 0 ? true : false"
      >
        <div style="width:100%;height:100%;margin:0px;">
          <div style="line-height:16px;margin-top:0.15rem;" >招待回顾</div>
      <div style="height:16px;line-height:16px;font-weight:normal;font-size:12px;padding-top:0.05rem;"
      >{{infoData.erBillNo}}</div>
        </div>
      </div>
      </van-nav-bar>

    <van-cell-group :class="this.infoData.erStatus === 2 || this.infoData.erStatus === 3 ? 'noclick' : ''">
      <!-- 招待计划 -->
      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="回顾日期"
        v-model="infoData.erReviewDate"
        readonly
        class="info"
      >
        <img src="" alt="">
      </van-field>

      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="招待对象名称"
        v-model="infoData.erVisitorObjectName"
        class="info"
        style="color:#333; "
        readonly
      >
      <span  slot="right-icon"
      style="color:#4B77AF;font-size:12px;text-decoration:underline;"
      @click="visclick"
      v-if="this.infoData.erStatus === 2 || this.infoData.erStatus === 3 ?false:true"
      >选择访客记录</span>
      </van-field>

      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="招待人数"
        placeholder="请输入招待人数"
        v-model="infoData.erNum"
        class="info"
        style="color:#333; "
      />

      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="实际费用"
        placeholder="请输入实际费用"
        v-model="infoData.erAmount"
        class="info"
        style="color:#333;"
      />

      <!-- <van-field
        label-width="115px"
        label-align="left"
        label="部门"
        v-model="infoData.deptName"
        placeholder="请选择部门"
        @click="deptListPicker = true"
        is-link
        disabled
        class="info"
        style="padding:0rem; color:#333;"
      />
      <van-field
        label-width="115px"
        label-align="left"
        label="营业店/子部门"
        v-model="infoData.shopName"
        placeholder="请选择营业店"
        @click="storeListPicker = true"
        is-link
        disabled
        class="info laster"
        style="padding:0rem; color:#333;"
      /> -->

      <!-- 招待计划 -->
      <div v-if="!(entertainReviewWithPlanInfoResp === null || entertainReviewWithPlanInfoResp.length === 0)">
        <van-cell size="large" style="color:#333;font-weight:bold;padding:0 0 0 15px;background: #f4f4f4;">
          <template slot="title">
            <div class="custom-title">招待计划</div>
          </template>
        </van-cell>

      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="招待日期"
        v-model="entertainReviewWithPlanInfoResp.epPlanDate"
        readonly
        class="info"
        style="color:#333;"
      >
      </van-field>

      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="招待对象"
        v-model="entertainReviewWithPlanInfoResp.epVisitObjectName"
        class="info"
        readonly
        style="color:#333; "
      />

      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="招待人数"
        v-model="entertainReviewWithPlanInfoResp.epNum"
        readonly
        class="info fpx"
        style="color:#333; "
      />

      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="预计费用"
        v-model="entertainReviewWithPlanInfoResp.epAmount"
        readonly
        class="info fpx"
        style="color:#333;"
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
      <!-- 弹出类型 -->
      <van-popup v-model="typeShow" position="bottom" :style="{ height: '28%',bottom: '9%' }">
          <van-list>
            <van-cell
                style="text-align:center;line-height:26px"
                v-for="(item,index) of typeColumns" :key="index"
                :title="item"
                @click="chanceType(item)"
            />
            </van-list>
      </van-popup>
      <van-cell v-if="typeShow" title="取消"
      style="position:fixed;bottom:0px;z-index:10000;background: #DCDCDC;text-align:center;line-height:26px"
      @click="cancelType"
       />

      <!-- 提交按钮 -->
        <div class="footer" v-if="this.infoData.erStatus === 2 || this.infoData.erStatus === 3 ? false : true">
          <Button :title ="delevetitle" @onclick="btndel"
          v-if="this.$route.query.id >0 ? true : false"
          style="height:50px;line-height:30px;width:50%;background-color: #fff;color:#D75252;font-weight: bold;font-size: 16px;border: 1px solid #fff;box-shadow: 0rem 0 0.266667rem 0 rgba(96, 156, 184, 0.5); "
          />
        <Button :title ="submittitle" @onclick="btnsubmit"
        v-if="this.$route.query.id >0 ? true : false"
        style="height:50px;line-height:30px;width:50%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
        />
        <Button
          :title="submittitle"
          @onclick="btnsubmit"
          v-if="this.$route.query.id >0 ? false : true"
          style="height:50px;line-height:30px;width:100%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
        />
        </div>
        <!-- <Time /> -->
    </van-cell-group>
  </div>
  </div>

</template>
<script>
import Vue from "vue";

import wx from "weixin-js-sdk"; // 引入企业微信的sdk
import cookieOperation from "@/apis/cookie";
import Button from "@/component/button.vue";
import Time from "@/component/time.vue"
export default {
  name: "travelPlan",
  components:{
        Button,
        Time
    },
  data() {
    return {
      loadFlag:true,
      infoData: {},
      entertainReviewWithPlanInfoResp:{},
      recordDate: "",
      popContent: "",
      showTime: false,
      num: "",
      targetShow:false,//招待对象
      typeShow: false,
      typeColumns: ['企业', '个体户', '自然人', '政府机构/事业单位'],
      emptyShow: false, //招待对象
      objflag:false,
      objlist:[],
      defaultDate: new Date(), //时间弹框
      show:false,
      calendarShow:false,
      //下拉
      storeColumns: [],
      deptListPicker: false,
      storeListPicker: false,
      storeListCode: "",
      listCode: "",
      delevetitle: "删除",//按钮
      submittitle: "保存",
      //切换
      startX:'',
      moveEndX:'',
    };
  },
  created() {
      this.init()
      document.title = "招待回顾";
  },
  methods: {
      //初始化
      init(){
        let par = this.$route.query.id
          this.$getData
        .serveRewFind({
          method: "post",
          data:{
             "erId": par
          }
        })
        .then(res => {
          this.loadFlag = false;
          this.infoData = res.data
          this.entertainReviewWithPlanInfoResp = res.data.entertainReviewWithPlanInfoResp
          this.infoData.erReviewDate = this.$moment(res.data.erReviewDate).format("YYYY-MM-DD")
          if(this.$route.query.id === null){
            this.infoData.erReviewDate = this.$moment(new Date()).format("YYYY-MM-DD")
          }else{
            this.infoData.erReviewDate = this.$moment(res.data.erReviewDate).format("YYYY-MM-DD")
          }
          if(this.$route.query.id === "" || this.$route.query.id === null){
          this.infoData.erAmount = null
          }

          if(this.$route.query.erVisitorObjectName ===null || this.$route.query.erVisitorObjectName === undefined){
            this.infoData.erVisitorObjectName = res.data.erVisitorObjectName
            this.infoData.erVisitorRecordId = res.data.erVisitorRecordId
            this.infoData.erVisitorObjectId = res.data.erVisitorObjectId
          } else{
            this.infoData.erVisitorObjectName = this.$route.query.erVisitorObjectName
            this.infoData.erVisitorRecordId = this.$route.query.erVisitorRecordId
            this.infoData.erVisitorObjectId = this.$route.query.erVisitorObjectId
          }

        })

      },
      //下拉框
    showsType() {
      this.deptListPicker = true;
    },
    deptListConfirm(value) {
      this.deptListPicker = false;
      this.infoData.deptName = value.text;
      this.infoData.deptId = value.id;
      for (let i in this.infoData.deptList) {
        if (this.infoData.deptList[i].text === value.text) {
          this.listCode = i;
        }
      }
      this.storeColumns = this.infoData.deptList[this.listCode].shopList;
      if (value !== "") {
        this.infoData.storeName = "";
      }
    },
    storeListConfirm(value) {
      this.storeListPicker = false;
      this.infoData.shopName = value.text;
      this.infoData.shopId = value.id;
    },

      onClickLeft(){
        let id = this.$route.query.id
          this.$router.push({
            name:'travelReview',
            query: this.$route.query
          })
      },
      visclick(){
        this.objflag = true
        let id = ''
        // if(this.$route.query.id === null){
        //   id = null
        // }
        this.$router.push({
          path:'/visitorlistReview',
            name:'visitorlistReview',
            query: this.$route.query
        })
      },
      //类型改变
    //   typeChange(value){
    //       console.log(value)
    //   },
    chanceType(value){
        this.infoData.serveType = value
        if(this.infoData.serveType === undefined){
              this.targetShow = false
          } else {
              this.targetShow = true
              if(this.typeColumns === []){
                  this.emptyShow = true
              } else{
                  this.emptyShow = false
              }
          }
        this.typeShow = false
    },
    //点击取消
    cancelType(){
        this.typeShow = false
    },

    //滑动跳转
      touchstart() {
        // event.preventDefault() //阻止默认事件（长按的时候出现复制）
  
        this.startX = event.changedTouches[0].pageX
        console.log(1)
      },
      touchend(){
        console.log(3)
      },

      touchmove() { // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
        event.preventDefault()
        this.moveEndX = event.changedTouches[0].pageX
        // console.log(this.moveEndX-this.startX)
        if(this.moveEndX-this.startX<-150){
          this.$router.push('/workPlan')
        } else if(this.moveEndX-this.startX > 150){
          this.$router.push(
            {
              name:'travelReview',
              query:this.$route.query

            })
        }
        
      },

    btndel(){
      let par = this.$route.query.id
        this.$getData
        .serveRewDel({
          method: "post",
          data: {
            'erId':par
          }
        })
        .then(res => {
          if(res.code === 200){
            this.$toast('删除成功')
            this.$router.push('/workplan')
          } else{
            this.$toast('删除失败')
          }
        })
    },

    //校验
    check(){
      let flag = false
      var reg = /^[1-9]\d{0,3}$/;//正整数
      let rag = /(^[0-9]\d{0,20}$)|(^\.\d{1,2}$)|(^[0-9]\d{0,20}\.\d{1,2}$)/;
      if(this.infoData.erReviewDate === null){
            this.$toast('请选择回顾时间')
        } else if(this.infoData.erVisitorObjectName === null || this.infoData.erVisitorObjectName === undefined){
            this.$toast('请选择招待对象名称')
        } else if(this.infoData.erNum === null
                || this.infoData.erNum === undefined
                || this.infoData.erNum === ""){
            this.$toast('请输入招待人数')
        } else if(this.infoData.erAmount === null
                || this.infoData.erAmount === undefined
                || this.infoData.erAmount === ""
        ){
            this.$toast('请输入实际费用')
        } else if(!rag.test(this.infoData.erAmount)){
            this.$toast('实际费用格式错误')
        }
        else{
          flag = true
          return flag
        }
    },

    btnsubmit(){
      this.check()
      let flag = this.check()
      if(flag === true){
      this.infoData.entertainReviewWithPlanInfoResp = this.entertainReviewWithPlanInfoResp
      let par = this.infoData
      par.weekNo = this.$route.query.weekNum
      par.erVisitorRecordId = this.infoData.erVisitorRecordId
      par.erVisitorObjectId = this.infoData.erVisitorObjectId
      par.erVisitorObjectName = this.infoData.erVisitorObjectName
      par.id = this.$route.query.id
      let pid = this.$route.query.id
      console.log(par)
      if(pid === 0 || pid === null || pid === undefined){
        this.$getData
        .serveRewSave({
          method: "post",
          data: par
        })
        .then(res => {
          console.log(res)
          if(res.code === 200){
            this.$toast("保存成功")
            this.$router.push('/workplan')
          }
        })
      } else if(pid >0){

        this.$getData
        .serveRewUpdete({
          method: "post",
          data: par
        })
        .then(res => {

          if(res.code === 200){
            this.$toast("保存成功")
            this.$router.push('/workplan')
          }
        })
      }

    }
  }
  }
};
</script>
<style lang="scss" scoped >
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
    height: 100%;
    padding-bottom: 15rem;
}
.noclick {
      pointer-events: none;
    }
//导航栏
.van-nav-bar{
  width: 100%;
  position: fixed;
  top: 0;
}
.van-cell-group{
  padding-top: 56px;
  background: #F4F4F4;
}
.van-nav-bar__title {
  color: #333;
  font-weight: bold;
}
.navTit{
  display: flex;
  align-items: center;
  justify-items: center;
}
//箭头
.van-nav-bar .van-icon{
    color: #4b77af;
    font-size: 24px;
}
//内容
.van-cell {
  // padding-top: 10px;
  // height: 48px;
  // line-height: 48px;
  font-size: 14px;
  color: #333;
}
/deep/.info .van-cell__value {
  //   padding: 0.05rem 0 0.05rem 0;
  //   line-height: 48px;
  padding-right: 15px;
}

/deep/.info .van-field__label {
  position: relative;
  padding-left: 15px;
}
.fpx /deep/.van-field__control{
    color: #007AFF;
}
 /*new add style*/
  /deep/ .van-field__label {
    padding: 4px 0;
  }
  /deep/ .van-field__control--right{
    padding: 4px 0;
  }
//禁用
.info /deep/.van-field__control:disabled{
    color: #333;
}
//卡片
.van-card{
    width: 90%;
    background: #fff;
    box-shadow: 0rem 0 0.266667rem 0 rgba(96, 156, 184, 0.5);
    margin: 0px 0 5px 5%;
    height: 156px;
    overflow: auto;
}
//日期
.dataIcon {
  color: #4b77af;
  font-size: 20px;
}
//箭头
.info /deep/.van-cell__right-icon{
    margin: 0.3rem 0.3rem 0 0rem;
}
//标题
.custom-title{
  height: 40px;
  line-height: 40px;
}
//提交按钮
.footer {
  width: 100%;
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom:0px;
}
</style>
