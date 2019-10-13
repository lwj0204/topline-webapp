// 作用：
// 接口重用
// 接口维护

// 用户接口相关请求模块

import request from '@/utils/request'
// 登录
export function login (data) {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data // data：data
  })
}
// 注册
export function register () {

}
