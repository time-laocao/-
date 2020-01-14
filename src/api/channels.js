// 专门处理频道请求
import request from '@/utils/request'

/***
 * 获取我的频道
 */
export function getMyChannels () {
  // 返回 的是一个promise对象 axios默认就是get的请求
  return request({
    url: '/user/channels'
    // data
  })
}
