// 路由 的拦截=》导航守卫
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入stre
// 前置守卫 =>当你的路由发生改变之前触发
// to 去哪里
// from 到哪里
// next 函数 ==》必须next（） =》resolve 这个钩子=》前面不执行next =》后面永远不执行
router.beforeEach(function (to, from, next) {
  if (to.path.startsWith('/user') && !store.state.user.tokrn) {
    // 判断有无token 头token放行 没有token拦截 =>登录
    let toPath = {
      path: '/login',
      query: {
        redirectUrl: to.path // 携带要去的地址到登录页面 =》登录成公后 有了权限 在回到刚才没有权限去的地址
      }
    }
    next(toPath)
  } else {
    next()// 直接放行
  }
})
// 后置守卫
export default router
