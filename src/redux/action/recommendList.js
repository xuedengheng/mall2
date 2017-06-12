import * as actionTypes from '../consts/recommendList'

import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

const APP_PATH = '/yiwu/product'

export const getRecommendListByIdsForState = (ids) => {
  const query = {
    productIds: ids
  }
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/listByProductIds.do${Tool.paramType(query)}`
    })
    .then(json => {
      return json.result
    })
  }
}

export const getRecommendListByIds = (ids) => {
  const query = {
    productIds: ids
  }
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/listByProductIds.do${Tool.paramType(query)}`
    })
    .then(json => {
      dispatch(getRecommendListSuccess(json.result))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getRecommendListSuccess = (payload) => {
  return {
    type: actionTypes.GET_RECOMMEND_LIST,
    payload
  }
}
