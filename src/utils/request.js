// 封装erquest模块
// 因为要在拦截器里处理 token统一注入 响应数据的统一处理返回 处理大数字
import axios from 'axios' // 引入axios插件
import JSONBig from 'json-bigint' // 处理大数字插件
import store from '@/store' // 引入store
import router from '@/router'

// 创建一个新的 插件实例  crerte：是创建的意思
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 设置一个常量的基础地质
  transfromResponse: [function (data) {
    // 当后台 响应的字符串 回到axios请求时 就会触发
    // data是一个字符串 吧字符串转化成 对象并且返回 默认的是json.parse
    // 如果data 是一个空字符串  直接转化就会报错
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data // 如果失败 就把字符串直接返回
    }
  }

  ] // 处理后台的数据 字符串=》对象  json.parse()=>JSONBig.parse() 解决最大数字
}) // 创建一个axios的请求工具
// 拦截器
// 请求拦截器   当你发起请求   到达服务器之前   有拦截器   统一注入token
instance.interceptors.request.use(function (config) {
  //   在返回配置之前   就塞入token
  if (store.state.user.token) {
    // 如果token存在 就注入
    config.headers['Authorization'] = ` Bearer ${store.state.user.token}` // 统一注入token
  }
  return config
}, function (error) {
  return Promise.reject(error)// 直接返回Pormise错误
})

// 响应拦截器    服务器      相应拦截器    then await
instance.interceptors.response.use(function (response) {
  //   响应数据   返回的得到响应数据   第一层data是axios里的   第二个data是接口返回的
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, async function (error) {
  // 如果拿到token过期的标识
  // error  config （请求配置） response（响应）
  let toPath = {
    path: '/login',
    query: {
      redirectUrl: router.currentRoute.path // 当前页面地址  做成数据传到登录页
      // params(动态路由 /user/：) query（user？id=123）   地址传参
    }
  }
  // 错误代码不一定是401  看项目指定的 数据
  if (error.response.status === 401) {
    // 判断本地有没有 refresh_token 续命的标识
    if (store.state.user.refresh_token) {
      // 可以续命
      // 不能在用instance 因为他会在一起走到请求拦截器里 所以要用axios
      try {
        let result = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          },
          method: 'put'
        })
        // 将数据同步到vuex 和本地储存
        store.commit('updateUser', {
          user: {
            token: result.data.data.token, // 更新到本地
            refresh_token: store.state.user.refresh_token
          }
        })
        return instance(error.config) // 将刚才401错误的请求在此发送出去
      } catch (error) {
        // refres——token  无法续命  没有不要留着   删掉用户信息 重新登录
        store.commit('clearUser') // 清空信息
        // 直接回登录
        router.path(toPath)
      }
    } else {
      // 否则返回登录页面  当你在一个页面 让你去登录  希望登录之后返回的是之前访问的页面
      store.commit('clearUser') // 清空信息
      router.path(toPath)
    }
  }
  return Promise.reject(error)
})
export default instance // 导出
