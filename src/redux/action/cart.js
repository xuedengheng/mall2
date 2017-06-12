import * as actionTypes from '../consts/cart'
import Cookies from 'js-cookie'
import { hashHistory } from 'react-router'

import { changeLoadingState } from './loading'

import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

const APP_PATH = '/yiwu/cart'

export const getCartList = (refresh = false) => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (!account) {
      hashHistory.push('login')
      dispatch(getCartListSuccess([]))
    } else {
      const query = { mobilePhone: account }
      if (refresh) {
        dispatch(getCartListSuccess([]))
      }
      dispatch(changeLoadingState(true))
      return requestData({
        url: `${BASE_URL}${APP_PATH}/query${Tool.paramType(query)}`
      })
      .then(json => {
        dispatch(changeLoadingState(false))
        if (json.result.cart) {
          dispatch(getCartListSuccess(json.result.cart))
        } else {
          dispatch(getCartListSuccess([]))
        }
        return json
      })
      .catch(error => {
        dispatch(changeLoadingState(false))
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

const getCartListSuccess = (payload) => {
  return {
    type: actionTypes.GET_CART_LIST,
    payload
  }
}

export const editCartDetailCount = (params) => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/update${Tool.paramType(params)}`,
      method: 'POST'
    })
    .then(json => {
      dispatch(getCartList())
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const deleteCartDetail = (params) => {
  return dispatch => {
    const cartDatilIds = params.cartInfo.reduce((acc, cart) => {
      return acc.concat(cart.cartDetailId)
    }, [])
    const query = { cartDetailIds: cartDatilIds.join(',') }
    return requestData({
      url: `${BASE_URL}${APP_PATH}/remove${Tool.paramType(query)}`,
      method: 'POST'
    })
    .then(json => {
      dispatch(getCartList())
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const submitCartDetail = (params) => {
  return dispatch => {
    dispatch(changeLoadingState(true))
    const query = { cartDetailIds: params.cartDetailIds }
    return requestData({
      url: `${BASE_URL}/yiwu/checkout/presubmit/order${Tool.paramType(query)}`,
      method: 'POST'
    })
    .then(json => {
      dispatch(changeLoadingState(false))
      dispatch(getSelectedCarts(params.preOrderCarts))
      hashHistory.push('submitorder')
    })
    .catch(error => {
      dispatch(changeLoadingState(false))
      if (error.code) {
        Tool.alert(error.message)
        if (error.code === 8014) {
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
      }
      console.log(error)
    })
  }
}

export const getSelectedCarts = (payload) => {
  return {
    type: actionTypes.GET_SELECTED_CARTS,
    payload
  }
}

export const getCartAddressId = (payload) => {
  return {
    type: actionTypes.GET_SELECTED_ADDRESSID,
    payload
  }
}
