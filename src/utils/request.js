// 封装erquest模块
// 因为要在拦截器里处理 token统一注入 响应数据的统一处理返回 处理大数字
import axios from 'axios' // 引入axios插件
import JSONBig from 'json-big-int' // 处理大数字插件
import store from '@/store' // 引入store

// 创建一个新的 插件实例
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
instance.interceptors.request.use(function (response) {
  //   响应数据   返回的得到响应数据   第一层data是axios里的   第二个data是接口返回的
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, function (error) {
  return Promise.reject(error)
})
export default instance // 导出
