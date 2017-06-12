import * as actionTypes from '../consts/area'

import { BASE_URL, requestData } from './consts'
import { Tool } from '../../config/Tool'

import { changeLoadingState } from './loading'

const APP_PATH = '/address'

export const getProvinceList = () => {
  return dispatch => {
    dispatch(changeLoadingState(true))
    return requestData({
      url: `${BASE_URL}${APP_PATH}/province`
    })
    .then(json => {
      dispatch(changeLoadingState(false))
      dispatch(getProvinceListSuccess(json.result))
    })
    .catch(error => {
      dispatch(changeLoadingState(false))
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getProvinceListSuccess = (payload) => {
  return {
    type: actionTypes.GET_PROVINCE_LIST,
    payload
  }
}

export const getCityList = (id) => {
  const query = { id }
  return dispatch => {
    dispatch(changeLoadingState(true))
    return requestData({
      url: `${BASE_URL}${APP_PATH}/city${Tool.paramType(query)}`
    })
    .then(json => {
      dispatch(changeLoadingState(false))
      dispatch(getCityListSuccess(json.result))
    })
    .catch(error => {
      dispatch(changeLoadingState(false))
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getCityListSuccess = (payload) => {
  return {
    type: actionTypes.GET_CITY_LIST,
    payload
  }
}

export const getCountyList = (id) => {
  const query = { id }
  return dispatch => {
    dispatch(changeLoadingState(true))
    return requestData({
      url: `${BASE_URL}${APP_PATH}/county${Tool.paramType(query)}`
    })
    .then(json => {
      dispatch(changeLoadingState(false))
      dispatch(getCountyListSuccess(json.result))
    })
    .catch(error => {
      dispatch(changeLoadingState(false))
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getCountyListSuccess = (payload) => {
  return {
    type: actionTypes.GET_COUNTY_LIST,
    payload
  }
}

export const getTownList = (id) => {
  const query = { id }
  return dispatch => {
    dispatch(changeLoadingState(true))
    return requestData({
      url: `${BASE_URL}${APP_PATH}/town${Tool.paramType(query)}`
    })
    .then(json => {
      dispatch(changeLoadingState(false))
      dispatch(getTownListSuccess(json.result))
    })
    .catch(error => {
      dispatch(changeLoadingState(false))
      if (error.code) {
        if (error.json.resultCode === '3405') {
          dispatch(setAreaEnding())
        } else {
          Tool.alert(error.message)
        }
      }
      console.log(error)
    })
  }
}

const getTownListSuccess = (payload) => {
  return {
    type: actionTypes.GET_TOWN_LIST,
    payload
  }
}

export const setAreaStatus = (payload) => {
  return {
    type: actionTypes.SET_AREA_STATUS,
    payload
  }
}

export const initAreaStatus = () => {
  return {
    type: actionTypes.INIT_AREA_STATUS
  }
}

export const setAreaEnding = () => {
  return {
    type: actionTypes.SET_AREA_ENDING
  }
}
