import axios from '@/utils/request'
import base from './base'; // 导入接口域名列表
import qs from 'qs'; // 根据需求是否导入qs模块

const comment = {
  //获取评论列表
  getCommentList(params) {
    return axios.post(`${base.dev}/comment/getCommentList`, qs.stringify(params));
  },
  //审核评论
  checkComment(params) {
    return axios.post(`${base.dev}/comment/checkComment`, qs.stringify(params));
  }
}

export default comment
