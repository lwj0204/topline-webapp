// axios 请求相关操作封装到这里
import axios from 'axios'
import jsonBig from 'json-bigint'

// axios.create 方法返回一个请求对象，这个请求对象的功能和 axios 的功能是一样的
// 也就是说我们复制了一个 axios
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn/'
})

request.defaults.transformResponse = [function (data) {
  return data ? jsonBig.parse(data) : {}
}]

// 请求拦截器

// 响应拦截器

// 导出这个请求对象
export default request
