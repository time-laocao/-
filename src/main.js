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

// 处理物理返回按键
// 在main.js中添加如下代码  此代码是采用的 5+ Runtime中的plus对象
document.addEventListener('plusready', function () {
  var webview = window.plus.webview.currentWebview()
  window.plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      if (e.canBack) {
        webview.back()
      } else {
        // webview.close(); //hide,quit
        // plus.runtime.quit();
        // 首页返回键处理
        // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
        var first = null
        window.plus.key.addEventListener('backbutton', function () {
          // 首次按键，提示‘再按一次退出应用’
          if (!first) {
            first = new Date().getTime()
            setTimeout(function () {
              first = null
            }, 1000)
          } else {
            if (new Date().getTime() - first < 1500) {
              window.plus.runtime.quit()
            }
          }
        }, false)
      }
    })
  })
})
