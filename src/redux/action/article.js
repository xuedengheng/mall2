import * as actionTypes from '../consts/article'

import { changeLoadingState } from './loading'

import { BASE_URL, requestData } from './consts'
import { Tool } from '../../config/Tool'

const APP_PATH = '/article'

export const getArticles = (page = 0) => {
  const query = {
    isPublished: true,
    page
  }
  return dispatch => {
    dispatch(changeArticlesPageNo(page))
    dispatch(changeLoadingState(true))
    return requestData({
      url: `${BASE_URL}${APP_PATH}/query${Tool.paramType(query)}`
    })
    .then(json => {
      dispatch(changeLoadingState(false))
      dispatch(changeArticlesTotal(json.total))
      dispatch(getArticlesSuccess(page, json.articles))
      return json
    })
    .catch(error => {
      dispatch(changeLoadingState(false))
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getArticlesSuccess = (page, payload) => {
  const type = page === 0 ? actionTypes.INIT_ARTICLE_LIST : actionTypes.ADD_ARTICLE_LIST
  return { type, payload }
}

export const getArticleDetail = (id) => {
  const query = { id }
  return dispatch => {
    dispatch(changeLoadingState(true))
    return requestData({
      url: `${BASE_URL}${APP_PATH}/load${Tool.paramType(query)}`
    })
    .then(json => {
      dispatch(changeLoadingState(false))
      dispatch(getArticleSuccess(json.articles[0]))
    })
    .catch(error => {
      dispatch(changeLoadingState(false))
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getArticleSuccess = (payload) => {
  return {
    type: actionTypes.GET_ARTICLE_DETAIL,
    payload
  }
}

const changeArticlesPageNo = (payload) => {
  return {
    type: actionTypes.CHANGE_ARTICLES_PAGE_NO,
    payload
  }
}

const changeArticlesTotal = (payload) => {
  return {
    type: actionTypes.CHANGE_ARTICLE_LIST_TOTAL,
    payload
  }
}
