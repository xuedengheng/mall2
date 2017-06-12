import * as actionTypes from '../consts/payment'

import { hashHistory } from 'react-router'
import Cookies from 'js-cookie'
import storage from '../../utils/storage'
import { isWx } from '../../utils/ua'
import session from '../../utils/session'
import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

const APP_PATH = '/yiwu/pay'

const PAY_WAY_URL = {
  'ALIPAY': 'alipay.do',
  'WEIXIN': 'weixinpay.do',
  'FEIMA': 'feimapay/json'
}

export const getPayToken = () => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/gettoken.do`
    })
    .then(json => {
      dispatch(getPayTokenSuccess(json.token))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getPayTokenSuccess = (payload) => {
  return {
    type: actionTypes.GET_PAY_TOKEN,
    payload
  }
}

export const choosePayWay = (params) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      const query = { ...params, mobilePhone: account }
      return requestData({
        url: `${BASE_URL}/yiwu/checkout/choosepayway.do${Tool.paramType(query)}`
      })
    }
  }
}

export const payOrder = (way, params, orderMode, orderId) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      const query = { ...params, mobilePhone: account }
      if (way === 'WEIXIN') {
        // const newQuery = Tool.queryString2Obj(window.location.search.slice(1))
        const openId = session.get('openId')
        if (isWx() && !openId) {
          Tool.alert('微信授权失败')
          return false
        } else {
          query.openid = openId
        }
        return requestData({
          url: `${BASE_URL}${APP_PATH}/${PAY_WAY_URL[way]}${Tool.paramType(query)}`,
          method: 'POST'
        })
      } else if (way === 'FEIMA') {
        query.pageUrl = `${window.location.origin}${window.location.search}/#/feima/${orderMode}/${orderId}`
        return requestData({
          url: `${BASE_URL}${APP_PATH}/${PAY_WAY_URL[way]}`,
          method: 'POST',
          data: query
        })
      }
    }
  }
}

export const checkPayResult = (orderJnId) => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/queryPayResult.do${Tool.paramType({ orderJnId })}`,
      method: 'POST'
    })
    .then(json => {
      return json
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getPayResult = (payload) => {
  return {
    type: actionTypes.GET_PAY_RESULT,
    payload
  }
}
