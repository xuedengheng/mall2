import * as actionTypes from '../consts/searchList'

import { track } from '../../utils/sa'

import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

import { changeLoadingState } from './loading'

const APP_PATH = '/product'

export const getSearchList = (history_flag, params) => {
  return dispatch => {
    dispatch(changeSearchPageNo(params.pageNo))
    for (let i in params) {
      if (params[i] === undefined) delete params[i]
    }
    return requestData({
      url: `${BASE_URL}${APP_PATH}/query${Tool.paramType(params)}`
    })
    .then(json => {
      dispatch(changeSearchListTotal(json.total))
      if (params.pageNo > 0) {
        dispatch(loadMoreSearchList(json.result))
      } else {
        dispatch(getSearchListSuccess(json.result))
      }
      return json
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

export const getSearchListSuccess = (payload) => {
  return {
    type: actionTypes.GET_SEARCH_LIST,
    payload
  }
}

const loadMoreSearchList = (payload) => {
  return {
    type: actionTypes.LOAD_MORE_SEARCH_LIST,
    payload
  }
}

const changeSearchPageNo = (payload) => {
  return {
    type: actionTypes.CHANGE_SEARCH_PAGE_NO,
    payload
  }
}

const changeSearchListTotal = (payload) => {
  return {
    type: actionTypes.CHANGE_SEARCH_LIST_TOTAL,
    payload
  }
}
