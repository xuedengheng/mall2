import * as actionTypes from '../consts/order'

import { hashHistory } from 'react-router'
import Cookies from 'js-cookie'
import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

import { changeLoadingState } from './loading'

const APP_PATH = '/yiwu/checkout/submit'
const ORDER_PATH = '/yiwu/order'

export const getOrderList = (params) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      dispatch(changeOrderStatus({ status: params.orderStatus, page: params.pageNo }))
      const query = { ...params, mobilePhone: account }
      return requestData({
        url: `${BASE_URL}${ORDER_PATH}/qryorderlist.do${Tool.paramType(query)}`
      })
      .then(json => {
        dispatch(getOrderListSuccess({ page: json.page, pageCount: json.pageCount, list: json.result }))
        return json
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

const changeOrderStatus = (payload) => {
  return {
    type: actionTypes.CHANGE_ORDER_STATUS,
    payload
  }
}

const getOrderListSuccess = (payload) => {
  return {
    type: actionTypes.GET_ORDER_LIST,
    payload
  }
}

export const getOrderDetail = (id) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      dispatch(changeLoadingState(true))
      const query = { orderId: id, mobilePhone: account }
      return requestData({
        url: `${BASE_URL}${ORDER_PATH}/qryorderinfo.do${Tool.paramType(query)}`
      })
      .then(json => {
        dispatch(changeLoadingState(false))
        dispatch(getOrderDetailSuccess(json.result))
      })
      .catch(error => {
        dispatch(changeLoadingState(false))
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

export const getOrderDetailForState = (id) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      const query = { orderId: id, mobilePhone: account }
      return requestData({
        url: `${BASE_URL}${ORDER_PATH}/qryorderinfo.do${Tool.paramType(query)}`
      })
    }
  }
}

export const getOrderDetailSuccess = (payload) => {
  return {
    type: actionTypes.GET_ORDER_DETAIL,
    payload
  }
}

export const submitOrder = (orderInfo) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      return requestData({
        url: `${BASE_URL}${APP_PATH}/order`,
        method: 'POST',
        data: { ...orderInfo, mobilePhone: account }
      })
    }
  }
}

export const submitOrderImmediately = (orderInfo) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      dispatch(changeLoadingState(true))
      return requestData({
        url: `${BASE_URL}${APP_PATH}/order/immediately`,
        method: 'POST',
        data: { ...orderInfo, mobilePhone: account }
      })
      .then(json => {
        dispatch(changeLoadingState(false))
        hashHistory.replace(`pay?id=${json.result.orderDetail[0].orderId}&mode=immediately`)
      })
      .catch(error => {
        dispatch(changeLoadingState(false))
        if (error.code) {
          Tool.alert(error.message)
          if (error.code === 8015) {
            hashHistory.goBack()
          }
        }
        console.log(error)
      })
    }
  }
}

export const cancelOrder = (orderId) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      const query = { orderId, mobilePhone: account }
      dispatch(changeLoadingState(true))
      return requestData({
        url: `${BASE_URL}${ORDER_PATH}/cancelorder.do${Tool.paramType(query)}`,
      })
      .then(json => {
        dispatch(changeLoadingState(false))
        Tool.alert('取消订单成功')
      })
      .catch(error => {
        dispatch(changeLoadingState(false))
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

export const deleteOrder = (orderId) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      const query = { orderId, mobilePhone: account }
      dispatch(changeLoadingState(true))
      return requestData({
        url: `${BASE_URL}${ORDER_PATH}/deleteorder.do${Tool.paramType(query)}`,
      })
      .then(json => {
        dispatch(changeLoadingState(false))
        Tool.alert('删除订单成功')
      })
      .catch(error => {
        dispatch(changeLoadingState(false))
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

export const getOrderStatusCount = () => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      return requestData({
        url: `${BASE_URL}${ORDER_PATH}/qryOrderStatusCount/${account}`,
      })
      .then(json => {
        dispatch(getOrderStatusCountSuccess(json.statusCount))
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

const getOrderStatusCountSuccess = (payload) => {
  return {
    type: actionTypes.GET_ORDER_STATUS_COUNT,
    payload
  }
}
