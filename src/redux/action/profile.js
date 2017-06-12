import * as actionTypes from '../consts/profile'
import Cookies from 'js-cookie'
import { hashHistory } from 'react-router'
import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

const APP_PATH = '/user'

export const getUserProfile = () => {
  return dispatch => {
    const account = Cookies.get('account') || ''
    if (!account) {
      hashHistory.push('login')
      dispatch(getUserProfileSuccess({}))
    } else {
      return requestData({
        url: `${BASE_URL}${APP_PATH}/${account}`
      })
      .then(json => {
        dispatch(getUserProfileSuccess(json.userInfo))
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

export const updateProfile = (params) => {
  const account = Cookies.get('account') || ''
  const query = {
    ...params,
    account
  }
  return dispatch => {
    if (!account) {
      hashHistory.push('login')
      dispatch(getUserProfileSuccess({}))
    } else {
      return requestData({
        url: `${BASE_URL}${APP_PATH}/update${Tool.paramType(query)}`,
        method: 'POST'
      })
      .then(json => {
        dispatch(getUserProfileSuccess(json.userInfo))
        Tool.alert('更新成功')
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}



const getUserProfileSuccess = (payload) => {
  return {
    type: actionTypes.GET_USER_PROFILE,
    payload
  }
}
