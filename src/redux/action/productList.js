import * as actionTypes from '../consts/productList'

import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

const APP_PATH = '/yiwu/product'

export const getProductListByIdsForState = (ids) => {
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

export const getProductListByIds = (ids) => {
  const query = {
    productIds: ids
  }
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/listByProductIds.do${Tool.paramType(query)}`
    })
    .then(json => {
      dispatch(getProductListSuccess(json.result))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getProductListSuccess = (payload) => {
  return {
    type: actionTypes.GET_PRODUCT_LIST,
    payload
  }
}
