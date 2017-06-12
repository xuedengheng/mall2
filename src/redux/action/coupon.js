import * as actionTypes from '../consts/coupon'

import Cookies from 'js-cookie'
import { hashHistory } from 'react-router'

import { changeLoadingState } from './loading'

import { BASE_URL, requestData } from './consts'

import { Tool } from '../../config/Tool'

const APP_PATH = '/usercoupon'

export const getCouponCount = () => {
  return dispatch => {
    const account = Cookies.get('account') || '';
    if (account === '') {
      hashHistory.push('login')
      dispatch(getCouponCountSuccess(0))
    } else {
      const query = { account }
      return requestData({
        url: `${BASE_URL}${APP_PATH}/total${Tool.paramType(query)}`
      })
      .then(json => {
        dispatch(getCouponCountSuccess(json.total))
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

const getCouponCountSuccess = (payload) => {
  return {
    type: actionTypes.GET_COUPON_COUNT,
    payload
  }
}

export const getCouponList = (params) => {
  return dispatch => {
    const account = Cookies.get('account') || '';
    if (account === '') {
      hashHistory.push('login')
      dispatch(getCouponCountSuccess(0))
    } else {
      const query = { ...params, account }
      dispatch(changeCouponPage(params.page))
      return requestData({
        url: `${BASE_URL}${APP_PATH}/list${Tool.paramType(query)}`
      })
      .then(json => {
        const { total, coupons } = json
        const payload = { total, coupons }
        dispatch(getCouponListSuccess(payload))
        return json
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

const changeCouponPage = (payload) => {
  return {
    type: actionTypes.CHANGE_COUPON_PAGE,
    payload
  }
}

const getCouponListSuccess = (payload) => {
  return {
    type: actionTypes.GET_COUPON_LIST,
    payload
  }
}

export const delCoupon = (couponId) => {
  return dispatch => {
    const account = Cookies.get('account') || '';
    if (account === '') {
      hashHistory.push('login')
      dispatch(getCouponCountSuccess(0))
    } else {
      const query = { couponId, account }
      return requestData({
        url: `${BASE_URL}${APP_PATH}/remove${Tool.paramType(query)}`,
        method: 'POST'
      })
    }
  }
}
