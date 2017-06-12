import { hashHistory } from 'react-router'

import * as actionTypes from '../consts/activity'

import { changeLoadingState } from './loading'

import { BASE_URL, requestData } from './consts'

import { Tool } from '../../config/Tool'

const APP_PATH = '/activity'

export const getTimeLimitList = () => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/timeLimited/list`
    })
    .then(json => {
      dispatch(getTimeLimitListSuccess(json.activities))
      return json
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const getTimeLimitListSuccess = (payload) => {
  return {
    type: actionTypes.GET_TIME_LIMIT_ACTIVITY_LIST,
    payload
  }
}

export const getTimeLimitDetail = (id) => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/timeLimited/${id}`
    })
    .then(json => {
      dispatch(getTimeLimitDetailSuccess(json.activities[0]))
      return json
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const getTimeLimitDetailSuccess = (payload) => {
  return {
    type: actionTypes.GET_TIME_LIMIT_ACTIVITY_DETAIL,
    payload
  }
}
