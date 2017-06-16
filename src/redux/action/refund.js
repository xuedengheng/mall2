import * as actionTypes from '../consts/refund'

import { hashHistory } from 'react-router'
import Cookies from 'js-cookie'
import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

import { changeLoadingState } from './loading'

const APP_PATH = '/postpurchase'

export const getRefundList = (query) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      dispatch(getRefundListSuccess({ list: [], total: 0 }))
    } else {
      dispatch(setRefundListPage(query.page))
      return requestData({
        url: `${BASE_URL}${APP_PATH}/list/${account}/${query.page}/${query.size}`
      })
      .then(json => {
        dispatch(getRefundListSuccess({ list: json.details, total: json.total }))
        return json
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

const getRefundListSuccess = ({ list, total }) => {
  return {
    type: actionTypes.GET_REFUND_LIST,
    payload: { list, total }
  }
}

export const getWillRefundProduct = ({ orderId, skuId }) => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}/yiwu/order/${orderId}/sku/${skuId}`
    })
  }
}

export const createRefund = (form) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      dispatch(getRefundListSuccess({ list: [], total: 0 }))
    } else {
      dispatch(changeLoadingState(true))
      let newForm = { ...form, account }
      return requestData({
        url: `${BASE_URL}${APP_PATH}/create`,
        method: 'POST',
        data: newForm
      })
      .then(json => {
        dispatch(changeLoadingState(false))
        Tool.alert('申请成功')
        hashHistory.goBack()
      })
      .catch(error => {
        dispatch(changeLoadingState(false))
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

export const updateRefund = (form) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      dispatch(getRefundListSuccess({ list: [], total: 0 }))
    } else {
      dispatch(changeLoadingState(true))
      const newForm = { ...form, account }
      return requestData({
        url: `${BASE_URL}${APP_PATH}/update`,
        method: 'POST',
        data: newForm
      })
      .then(json => {
        dispatch(changeLoadingState(false))
        Tool.alert('修改成功')
        hashHistory.goBack()
      })
      .catch(error => {
        dispatch(changeLoadingState(false))
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

export const getRefundDetail = (requestId) => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/detail/${requestId}`
    })
    .then(json => {
      dispatch(getRefundDetailSuccess(json.details[0]))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const getRefundDetailBySku = ({ orderId, skuId }) => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/detail/${orderId}/${skuId}`
    })
    .then(json => {
      dispatch(getRefundDetailSuccess(json.details[0]))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const getRefundDetailForUpdate = (requestId) => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/detail/${requestId}`
    })
  }
}

const setRefundListPage = (payload) => {
  return {
    type: actionTypes.SET_REFUND_LIST_PAGE,
    payload
  }
}

export const getRefundDetailSuccess = (payload) => {
  return {
    type: actionTypes.GET_REFUND_DETAIL,
    payload
  }
}

export const getRefundTrace = (requestId) => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/trace/${requestId}`
    })
    .then(json => {
      dispatch(getRefundTraceSuccess(json.items))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getRefundTraceSuccess = (payload) => {
  return {
    type: actionTypes.GET_REFUND_TRACE,
    payload
  }
}

export const submitRefundDetail = (form) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      dispatch(getRefundListSuccess({ list: [], total: 0 }))
    } else {
      const newForm = { ...form, committer: account }
      return requestData({
        url: `${BASE_URL}${APP_PATH}/submit`,
        method: 'POST',
        data: newForm
      })
    }
  }
}

export const confirmJDReturn = (requestId) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (account === '') {
      hashHistory.push('login')
      dispatch(getRefundListSuccess({ list: [], total: 0 }))
    } else {
      const query = { requestId, committer: account }
      return requestData({
        url: `${BASE_URL}${APP_PATH}/jd/returned${Tool.paramType(query)}`,
        method: 'POST'
      })
    }
  }
}
