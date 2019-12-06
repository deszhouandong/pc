// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


import Calendar from 'vue-mobile-calendar' // 日期插件
import './assets/sass/global.scss'
// import './assets/sass/reset.css'

// 获取电脑的用户名
// import {getname} from '@/assets/js/getEquipment'
// 适配插件
import 'lib-flexible/flexible.js'
import urlSearch from "@/apis/urlSearch"
// import moment from "moment";
import dateList from '@/component/dateList'
Vue.component('dateList', dateList)

//截取cookie
//全局截取url
let Request = new urlSearch.UrlSearch(); //方法实例化
Vue.prototype.$Request = Request;

// 控制台按钮
import Vconsole from 'vconsole';
if (process.env.NODE_ENV != 'production') {
  new Vconsole();
}


//MD5加密
import md5 from 'js-md5';

// 移动端300ms延迟
// import FastClick from 'fastclick'

// FastClick.attach(document.body);

// import cookieOperation from "@/apis/cookie";
// Vue.prototype.$cookieOperation = cookieOperation;
// Vue.use(cookieOperation)

import utils from '@/apis/urlGet'; //获取url参数
Vue.prototype.$utils = utils; //注册全局方法
import getData from './apis/getData';
Vue.prototype.$getData = getData
import _ from 'lodash'
Vue.prototype._ = _

// vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

// import {
//   Toast,
//   Cell,
//   CellGroup,
//   Dialog,
//   ImagePreview,
//   Field,
//   Icon,
//   Button,
//   RadioGroup,
//   Radio,
//   Divider,
//   Popup,
//   Tabbar,
//   TabbarItem,
//   Tab,
//   Tabs,
//   Card,
//   NavBar,
//   List,
//   DropdownMenu,
//   DropdownItem,
//   Step,
//   Steps,
//   Loading,
//   Image
// } from 'vant'

// Vue.use(Toast)
//   .use(Cell)
//   .use(CellGroup)
//   .use(Dialog)
//   .use(ImagePreview)
//   .use(Field)
//   .use(Icon)
//   .use(Button)
//   .use(RadioGroup)
//   .use(Radio)
//   .use(Divider)
//   .use(Popup)
//   .use(Tabbar)
//   .use(TabbarItem)
//   .use(Tab)
//   .use(Tabs)
//   .use(NavBar)
//   .use(Card)
//   .use(List)
//   .use(DropdownMenu)
//   .use(DropdownItem)
//   .use(Step)
//   .use(Steps)
//   .use(Loading)
//   .use(Image);
Vue.use(Calendar); // 日期插件

// Vue.use(wx)
// 获取电脑的用户名
// Vue.prototype.getmsg = getname();
// Vue.use(moment);
// Vue.prototype.$moment = moment;

//MD5加密
Vue.prototype.$md5 = md5;

import moment from 'moment' //导入文件
// import 'moment/locale/zh-cn'
Vue.prototype.$moment = moment; //赋值使用


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
