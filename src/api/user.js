// 用户相关的请求模块
import request from '@/utils/request' // 引入封装的模块
// 登录方法
export function login (data) {
  return request({
    url: '/authorizations',
    data,
    method: 'post'
  }) //  得到一个promise对象  返回
}
/** **获取用户个人信息 文章 发表状态*****/
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
/****
 *
 * 获取用户gr资料
 */
/** *获取用户个人资料 ****/
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}
