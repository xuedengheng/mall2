import * as actionTypes from '../consts/promotion'
import Cookies from 'js-cookie'
import { BASE_URL, requestData } from './consts'

import { Tool } from '../../config/Tool'

const APP_PATH = '/yiwu/promotion'

export const getPromotionList = (orderSkuDTOs) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (!account) {
      hashHistory.push('login')
      dispatch(getPromotionListSuccess([]))
    } else {
      const data = { orderSkuDTOs, userMobile: account }
      return requestData({
        url: `${BASE_URL}${APP_PATH}/query`,
        method: 'POST',
        data
      })
    }
  }
}

export const getPromotionListSuccess = (payload) => {
  return {
    type: actionTypes.GET_PROMOTION_LIST,
    payload
  }
}

export const getFinalFee = ({ orderSkuDTOs, promotionDTOs }) => {
  return dispatch => {
    const data = { orderSkuDTOs, promotionDTOs }
    return requestData({
      url: `${BASE_URL}${APP_PATH}/calculate`,
      method: 'POST',
      data
    })
    .then(json => {
      dispatch(getFinalFeeSuccess({
        promotionDiscountDTOs: json.result.promotionDiscountDTOs,
        orderSkuDTOs: json.result.orderSkuDTOs,
        totalAmount: json.result.totalAmount,
        totalFreight: json.result.totalFreight,
        totalPayAmount: json.result.totalPayAmount
      }))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getFinalFeeSuccess = (payload) => {
  return {
    type: actionTypes.GET_PROMOTION_FINAL_FEE,
    payload
  }
}
