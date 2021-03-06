// 专门处理频道请求
import request from '@/utils/request'
import store from '@/store'
// 本地缓存 需要key
const CACHE_CHANEL_T = 'hm-91-toutiao-t' // 游客缓存的key
const CACHE_CHANNEL_U = 'hm-91-toutiao-u'// 登录用户的key

/***
 * 获取我的频道
 */
export function getMyChannels () {
  // 返回 的是一个promise对象 axios默认就是get的请求
  // 首先我们要先从缓存中读取， 看看缓存有没有 如果缓存中有的话 用缓存的数据 如果缓存中没有  才去查询
  return new Promise(async function (resolve, reject) {
    // 做我们的逻辑
    // 在store里的state里的user拿token 如果存在那就用哪个登录的  或者缓存的key'
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANEL_T
    // 从缓存中读取数据
    let str = localStorage.getItem(key) // 得到的缓存结果
    if (str) {
      // 如果str存在 表示缓存中有数据
      resolve({ channels: JSON.parse(str) }) // 表示从缓存中获取的数据 通过执行链下发给一个promise
    } else {
      // 若果没有数据 从线上拉去
      const data = await request({ url: '/user/channels' })
      localStorage.setItem(key, JSON.stringify(data.channels)) // 将线上数据写入缓存
      resolve(data) // 将线上获取的数据释放给promise
    }
  })
}
/***
 * 获取所有频道
 */
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
/*****
 * 删除频道
 * **/
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 首先也许要做判断 是删除 游客的频道还是删除登录的频道
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANEL_T
    let channels = JSON.parse(localStorage.getItem(key)) // 缓存中一定有数据
    let index = channels.findIndex(item => item.id === id) // 找到对应的索引
    if (index > -1) {
      // 删除数据
      channels.splice(index, 1)
      // 重新写入缓存
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
      resolve()// 成功执行
    } else {
      reject(new Error('找不到对应的频道'))
    }
  })
}
/**
 * 添加频道api
 * ***/
export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    // 添加逻辑
    // 首先判断也需要做判断 是删除 游客的频道还是删除登录的频道
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANEL_T
    let channels = JSON.parse(localStorage.getItem(key)) // 缓存中一定有数据
    channels.push(channel) // 将频道添加到队尾
    // 重新写入缓存
    localStorage.setItem(key, JSON.stringify(channels)) // 写入缓存
    resolve() // 释放成功
  })
}
