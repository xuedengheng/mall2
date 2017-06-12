import * as actionTypes from '../consts/product'
import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'
import Cookies from 'js-cookie'
import { hashHistory } from 'react-router'

import { changeLoadingState } from './loading'
import { getCartList } from './cart'

const APP_PATH = '/yiwu/product'

export const getProduct = (id) => {
  const query = {
    productId: id
  }
  return dispatch => {
    dispatch(initProduct())
    dispatch(changeLoadingState(true))
    return requestData({
      url: `${BASE_URL}${APP_PATH}/detail.do${Tool.paramType(query)}`
    })
    .then(json => {
      dispatch(changeLoadingState(false))
      dispatch(getProductSuccess(json.result))
      return json
    })
    .catch(error => {
      dispatch(changeLoadingState(false))
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const initProduct = () => {
  return {
    type: actionTypes.INIT_PRODUCT
  }
}

export const addCart = (params) => {
  const mobilePhone = Cookies.get('account')
  return dispatch => {
    if (!mobilePhone) {
      dispatch(addCartSuccess({}))
      hashHistory.push('login')
    } else {
      params.mobilePhone = mobilePhone
      return requestData({
        url: `${BASE_URL}/yiwu/cart/add`,
        method: "POST",
        data: params
      })
    }
  }
}

export const getProductSuccess = (payload) => {
  return {
    type: actionTypes.GET_PRODUCT,
    payload
  }
}

const addCartSuccess = (payload) => {
  return {
    type: actionTypes.ADD_CART,
    payload
  }
}

export const checkJdStorage = (params) => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}/storage/query`,
      method: "POST",
      data: params
    })
  }
}

export const getProductForState = (id) => {
  const query = {
    productId: id
  }
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/detail.do${Tool.paramType(query)}`
    })
  }
}
