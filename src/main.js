import Vue from 'vue'
import App from './App.vue'
import router from './permission' // 经过全县处理的router

import store from './store'
import Vant, { Lazyload } from 'vant'
// vant的样式  因为在开发的时候不知道用哪个 所以全局注册
import 'vant/lib/index.less' // vant样式文件 换成less
import '@/styles/index.less' // 引入全局自定义样式

import 'amfe-flexible' // 引入自动适配插件
import plugin from '@/utils/plugin'

// 全局注册在哪里都能用
Vue.use(Vant) // 全局注册  实际上调用了 Vant导出的对象的方法  install方法
Vue.use(plugin) // 注册小插件 会调用插件中的install方法
// 注册好了 支持v-lazy指令
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
