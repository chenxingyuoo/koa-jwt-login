

import axios from 'axios'
import qs from 'qs'
import { message } from 'antd';
import {TOKEN_KEY , getToken} from './auth'

const successCode = 200
const failCode = 4000
const notAuthCode = 1000

// 创建axios实例
const service = axios.create({
  baseURL: '/api'
})

// 添加一个请求拦截器
service.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers[TOKEN_KEY] = getToken() // 让每个请求携带自定义token
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 添加一个响应拦截器
service.interceptors.response.use(function (response) {
  // Do something with response data
  if (response.status >= 200 && response.status <= 300) {
    const { data, data: {code} } = response
    if (code === successCode) {
      return data.data
    }

    if (code === failCode) {
      message.warning(data.message)
      return Promise.reject(data)
    }

    if (code === notAuthCode) {
      message.warning(data.message)
      window.location.hash = '#/login'
      return Promise.reject(data)
    }

    return Promise.reject(data)
  }
}, function (error) {
  // 验证登录
  if (error.response.status === 401) {
    window.location.hash = '#/login'
  } else if (error.response && error.response.status >= 400) {
    message.error('网络发生错误')
  }

  
  // Do something with response error
  return Promise.reject(error);
});


/**
 * 统一get请求入口
 * @param {object} opts 请求参数对象
 * @returns {Promise<AxiosResponse<any>>}
 */
service.get = (opts = {}) => {
  opts = Object.assign({
    method: 'GET',
  }, opts)
  opts.params = opts.data
  delete opts.data
  return service(opts)
}

/**
 * 统一post请求入口
 * @param {object} opts 请求参数对象
 * @returns {Promise<AxiosResponse<any>>}
 */
service.post = (opts = {}) => {
  opts = Object.assign({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }, opts)
  return service(opts)
}

export default service