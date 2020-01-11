import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
// vant的样式  因为在开发的时候不知道用哪个 所以全局注册
import 'vant/lib/index.css'
// 全局注册在哪里都能用
Vue.use(Vant) // 全局注册  实际上调用了 Vant导出的对象的方法  install方法

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
