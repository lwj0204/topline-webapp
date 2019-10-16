// axios 请求相关操作封装到这里
import axios from 'axios'
import jsonBig from 'json-bigint'
import store from '@/store' // 在非组件模块中使用容器就直接加载即可

// axios.create 方法返回一个请求对象，这个请求对象的功能和 axios 的功能是一样的
// 也就是说我们复制了一个 axios
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn/'
})

request.defaults.transformResponse = [function (data) {
  return data ? jsonBig.parse(data) : {}
}]

// 请求拦截器 请求到达后台之前拦截

request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const user = store.state.user
  if (user) {
    // 配置 token 请求头
    // 注意 Authorization 是请求头的名字，不能乱写，由后端规定的，包括数据格式也不能乱写， 也是后端规定的
    config.headers['Authorization'] = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器

// 导出这个请求对象
export default request
