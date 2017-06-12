import * as actionTypes from '../consts/richProduct'
import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

const APP_PATH = '/yiwu/product'

export const getRichProduct = (isJd, id) => {
  const query = {
    productId: id
  }
  const jdQuery = {
    sku: id
  }
  return dispatch => {
    return requestData({
      url: isJd ? `${BASE_URL}/product/detail${Tool.paramType(jdQuery)}` : `${BASE_URL}${APP_PATH}/richDetail.do${Tool.paramType(query)}`
    })
    .then(json => {
      if (isJd) {
        dispatch(getRichProductSuccess(json.result.introduction))
      } else {
        dispatch(getRichProductSuccess(json.result))
      }
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getRichProductSuccess = (payload) => {
  return {
    type: actionTypes.GET_RICH_PRODUCT,
    payload
  }
}
