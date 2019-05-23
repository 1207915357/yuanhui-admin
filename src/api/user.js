import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}


import axios from '@/utils/request'
import base from './base'; // 导入接口域名列表
import qs from 'qs'; // 根据需求是否导入qs模块

const user = {
  getAllUser(params) {
    return axios.post(`${base.dev}/getAllUser`, qs.stringify(params));
  },
  deleteUser(params) {
    return axios.post(`${base.dev}/deleteUser`, qs.stringify(params));
  },
  updateUser(params) {
    return axios.post(`${base.dev}/updateUser`, qs.stringify(params));
  },
}

export default user
