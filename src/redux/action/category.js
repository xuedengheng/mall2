import * as actionTypes from '../consts/category'
import { hashHistory } from 'react-router'

import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

const APP_PATH = '/yiwu/category'

export const getCategoryList = () => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/query/v2`
    })
    .then(json => {
      dispatch(getCategoryListSuccess(json.result))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getCategoryListSuccess = (payload) => {
  return {
    type: actionTypes.GET_CATEGORY_LIST,
    payload
  }
}

export const getSubCategoryList = (id) => {
  const query = {
    parentId: id
  }

  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/querydouble/v2${Tool.paramType(query)}`
    })
    .then(json => {
      dispatch(getSubCategoryListSuccess(json.result))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getSubCategoryListSuccess = (payload) => {
  return {
    type: actionTypes.GET_SUB_CATEGORY_LIST,
    payload
  }
}
