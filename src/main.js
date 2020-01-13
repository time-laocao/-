import Vue from 'vue'
import App from './App.vue'
import router from './permission' // 经过全县处理的router

import store from './store'
import Vant from 'vant'
// vant的样式  因为在开发的时候不知道用哪个 所以全局注册
import 'vant/lib/index.css' // 样式文件
import '@/styles/index.less' // 引入全局自定义样式

import 'amfe-flexible' // 引入自动适配插件

// 全局注册在哪里都能用
Vue.use(Vant) // 全局注册  实际上调用了 Vant导出的对象的方法  install方法

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
