import { BASE_URL, requestData } from './consts'
import { Tool } from '../../config/Tool'
import * as actionTypes from '../consts/address'
import { hashHistory } from 'react-router'
import Cookies from 'js-cookie'

const CREATE_PATH = '/address/create'
const QUERY_PATH = '/address/query'
const QUERY_BY_ID_PATH = '/address/queryByAddrId'
const UPDATE_PATH = '/address/update'
const DELETE_PATH = '/address/delete'
const SELETE_PATH = '/checkout/chooseaddressid.do'

export const addNewAddressRequest = (obj) => {
  return dispatch => {
    const accountId = Cookies.get('account') || ''
    const requestObj = Tool.paramType({ account: accountId })
    return requestData({
      url: `${BASE_URL}${CREATE_PATH}${requestObj}`,
      method: 'POST',
      data: obj
    })
    .then(json => {
      Tool.alert('新增成功')
      dispatch(addNewAddress(json.addresses))
      hashHistory.goBack()
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const addNewAddress = (json) => {
  return {
    type: actionTypes.ADD_NEW_ADDRESS,
    json
  }
}

export const addressListRequest = (defaultFlag = undefined) => {
  const accountId = Cookies.get('account') || ''
  let query = { account: accountId }
  if (defaultFlag) { query.defaultFlag = defaultFlag }
  const requestObj = Tool.paramType(query)
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${QUERY_PATH}${requestObj}`,
      method: 'GET'
    })
    .then(json => {
      dispatch(addressList(json.addresses))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const addressListRequestById = (addressId) => {
  const accountId = Cookies.get('account') || ''
  const requestObj = Tool.paramType({ userId: accountId, addressId })
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${QUERY_BY_ID_PATH}${requestObj}`,
      method: 'GET'
    })
    .then(json => {
      dispatch(addressList(json.addresses))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const addressList = (json) => {
  return {
    type: actionTypes.ADDRESS_LIST,
    json
  }
}


export const updateAddressRequest = (obj) => {
  const accountId = Cookies.get('account') || ''
  const requestObj = Tool.paramType({ account: accountId })
  return dispatch => {
    return requestData({
        url: `${BASE_URL}${UPDATE_PATH}${requestObj}`,
        method: 'POST',
        data: obj,
    })
    .then(json => {
      Tool.alert('保存成功')
      dispatch(updateAddress(json.addresses))
      hashHistory.goBack()
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const updateAddress = (json) => {
  return {
    type: actionTypes.UPDATE_ADDRESS,
    json
  }
}

export const deleteAddressRequest = (obj) => {
  const accountId = Cookies.get('account') || ''
  const requestObj = Tool.paramType({ account: accountId })
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${DELETE_PATH}${requestObj}`,
      method: 'POST',
      data: obj
    })
    .then(json => {
      Tool.alert('删除成功')
      dispatch(deleteAddress(json.addresses))
      hashHistory.goBack()
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const deleteAddress = (json) => {
  return {
    type: actionTypes.DELETE_ADDRESS,
    json
  }
}

export const selectAddressRequest = (obj) => {
  const accountId = Cookies.get('account') || ''
  const requestObj = Tool.paramType({ mobilePhone: accountId, addressId: obj.addressId, orderDetail: obj.orderDetail, orderJnId: obj.orderJnId })
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${SELETE_PATH}${requestObj}`,
      method: 'GET'
    })
    .then(json => {
      dispatch(selectAddress(json.addresses))
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const selectAddress = (json) => {
  return {
    type: actionTypes.SELECT_ADDRESS,
    json
  }
}
