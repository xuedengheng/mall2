import * as actionTypes from '../consts/skuProduct'
import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'
import Cookies from 'js-cookie'
import { hashHistory } from 'react-router'

const APP_PATH = '/yiwu/product'

export const getModalProduct = (id) => {
  const query = {
    productId: id
  }
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/detail.do${Tool.paramType(query)}`
    })
    .then(json => {
      dispatch(getModalProductSuccess(json.result))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const addModalCart = (productId, skuId, quantity) => {
  const mobilePhone = Cookies.get('account') || '18607609056'
  const query = {
    productId: productId,
    skuId: skuId,
    mobilePhone: mobilePhone,
    quantity: quantity
  }

  return ( dispatch )=> {
    return requestData({
      url: `${BASE_URL}/yiwu/cart/add.do${Tool.paramType(query)}`,
      method: "POST"
    })
    .then(response => response.json())
    .then(json => {
      dispatch(addCartSuccess(json.result))
      hashHistory.push('cart')
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getModalProductSuccess = (payload) => {
  return {
    type: actionTypes.GET_MODAL_PRODUCT,
    payload
  }
}

const addModalCartSuccess = (payload) => {
  return {
    type: actionTypes.ADD_MODAL_CART,
    payload
  }
}
