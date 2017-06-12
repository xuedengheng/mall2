import * as actionTypes from '../consts/express'
import Cookies from 'js-cookie'
import { hashHistory } from 'react-router'

import { changeLoadingState } from './loading'

import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

export const getJdExpressList = (jdOrderId) => {
  return dispatch => {
    const account = Cookies.get('account') || '';
    if (account === '') {
      hashHistory.push('login')
      dispatch(getJdExpressListSuccess([]))
    } else {
      dispatch(changeLoadingState(true))
      const query = { jdOrderId, mobilePhone: account }
      return requestData({
        url: `${BASE_URL}/yiwu/order/queryOrderExpress.do${Tool.paramType(query)}`
      })
      .then(json => {
        dispatch(changeLoadingState(false))
        dispatch(getJdExpressListSuccess(json.result.result.orderTrack))
      })
      .catch(error => {
        dispatch(changeLoadingState(false))
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

const getJdExpressListSuccess = (payload) => {
  return {
    type: actionTypes.GET_JD_EXPRESS_LIST,
    payload
  }
}
