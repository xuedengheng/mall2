import { hashHistory } from 'react-router'

import storage from '../../utils/storage'
import { login } from '../../utils/sa'

import * as actionTypes from '../consts/account'

import { changeLoadingState } from './loading'

import { BASE_URL, requestData } from './consts'

import { Tool } from '../../config/Tool'
import base64 from 'base-64'

// const searchAcccount = 'ywyx_account'
// const searchPS = 'ywyx_ps'
// const searchToken = 'ywyx_token'

const AUTH_PATH = 'auth'
const USER_PATH = 'user'

export const getToken = (mobile, password) => {
  let query = Tool.paramType({
    account: mobile,
    password: base64.encode(password)
  })
  return dispatch => {
    return requestData({
      url: `${BASE_URL}/${AUTH_PATH}/getToken${query}`,
      method: 'POST'
    })
    .then(json => {
      warpRes(json, dispatch(loginSucc(json.userInfo, json.token)))
      login(mobile)
      return json
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const loginSucc = (user, token) => {
  return {
    type: actionTypes.LOGIN,
    user: user,
    token: token
  }
}

export const getVerifyCode = (mobile, type) => {
  let query = Tool.paramType({
    mobile: mobile,
    module: type
  })

  return dispatch => {
    return requestData({
      url: `${BASE_URL}/sms/send${query}`,
      method: 'POST'
    })
  }
}

export const registerReq = (mobile, password, verifyCode) => {
  let url = `${BASE_URL}/${USER_PATH}/register`
  return reqWithVerifyCode(
    'reg',
    url,
    actionTypes.REGISTER_DONE,
    mobile,
    password,
    verifyCode
  )
}

export const passwordResetReq = (mobile, password, verifyCode) => {
  let url = `${BASE_URL}/${USER_PATH}/reset`
  return reqWithVerifyCode(
    'reset',
    url,
    actionTypes.RESET_PASSWORD_DONE,
    mobile,
    password,
    verifyCode
  )
}

const reqWithVerifyCode = (type, url, atype, mobile, password, verifyCode) => {
  let query = Tool.paramType({
    account: mobile,
    verifyCode: verifyCode,
    password: base64.encode(password)
  })
  let loginQuery = Tool.paramType({
    account: mobile,
    password: base64.encode(password)
  })
  return dispatch => {
    dispatch(changeLoadingState(true))
    return requestData({
      url: `${url}${query}`,
      method: 'post',
    })
    .then(json => {
      Tool.alert('操作成功')
      warpRes(json, dispatch({type: atype, user: json.userInfo}))
      if (type === 'reg') {
        requestData({
          url: `${BASE_URL}/${AUTH_PATH}/getToken${loginQuery}`,
          method: 'POST'
        })
        .then(json => {
          dispatch(changeLoadingState(false))
          hashHistory.push('/')
          login(mobile)
        })
        .catch(error => {
          dispatch(changeLoadingState(false))
          if (error.code) Tool.alert(error.message)
          console.log(error)
        })
      } else {
        dispatch(changeLoadingState(false))
        hashHistory.goBack()
      }
    })
    .catch(error => {
      dispatch(changeLoadingState(false))
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const warpRes = (res, succ_fun) => {
  if(res.success && res.code == 0) {
    succ_fun
  } else {
    Tool.alert(res.msg)
  }
}

export const logout = () => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}/${AUTH_PATH}/logout`
    })
    .then(json => {
      Tool.alert('退出成功')
      hashHistory.push('/')
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}
