import * as actionTypes from '../consts/showcase'

import { BASE_URL, requestData } from './consts'

import { changeLoadingState } from './loading'

const APP_PATH = '/yiwu/showcase'

export const getShowcaseList = (isFirst = false) => {
  return dispatch => {
    dispatch(changeLoadingState(true))
    return requestData({
      url: `${BASE_URL}${APP_PATH}/list`
    })
    .then(json => {
      dispatch(changeLoadingState(false))
      dispatch(getShowcaseListSuccess(json.result))
      if (isFirst) dispatch(getShowcaseTemplate(json.result[0].showcaseId, true))
    })
    .catch(error => {
      dispatch(changeLoadingState(false))
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const getShowcaseTemplate = (id, isHomePage = false) => {
  return dispatch => {
    dispatch(getShowcaseTemplateSuccess(null))
    dispatch(changeLoadingState(true))
    return requestData({
      url: `${BASE_URL}${APP_PATH}/template/${id}`
    })
    .then(json => {
      dispatch(changeLoadingState(false))
      dispatch(getShowcaseTemplateSuccess(json.result))
      if (isHomePage) dispatch(updateShowcaseIndex(id))
    })
    .catch(error => {
      dispatch(changeLoadingState(false))
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const initShowcase = () => {
  return {
    type: actionTypes.INIT_SHOWCASE
  }
}

const getShowcaseListSuccess = (payload) => {
  return {
    type: actionTypes.GET_SHOWCASE_LIST,
    payload
  }
}

const getShowcaseTemplateSuccess = (payload) => {
  return {
    type: actionTypes.GET_SHOWCASE_TEMPLATE,
    payload
  }
}

const updateShowcaseIndex = (payload) => {
  return  {
    type: actionTypes.UPDATE_SHOWCASE_INDEX,
    payload
  }
}
