import axios from '@/utils/request'
import base from './base'; // 导入接口域名列表
import qs from 'qs'; // 根据需求是否导入qs模块

const article = {
  //文章-----------------------------
  publish(params) {
       return axios.post(`${base}/article/publish`, qs.stringify(params));
  },
  searchArticle(params) {
    return axios.post(`${base}/article/searchArticle`, qs.stringify(params));
  },
  updateArticle(params) {
    return axios.post(`${base}/article/updateArticle`, qs.stringify(params));
  },
  deleteArticle(params) {
    return axios.post(`${base}/article/deleteArticle`, qs.stringify(params));
  },
  articleList(params) {
    return axios.post(`${base}/article/articleList`, qs.stringify(params));
  },
  articleDel(params) {
    return axios.post(`${base}/article/articleDel`, qs.stringify(params));
  },
  markdownImg(params) {
    return axios.post(`${base}/article/markdownImg`, params)
  },
  //保存草稿
  articleDraft(params) {
    return axios.post(`${base}/article/articleDraft`, qs.stringify(params));
  },
}

export default article
