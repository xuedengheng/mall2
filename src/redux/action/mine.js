import * as actionTypes from '../consts/mine'
import Cookies from 'js-cookie'
import { hashHistory } from 'react-router'

import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

const APP_PATH = '/user'

export const getMineUser = () => {
  return dispatch => {
    const accountId = Cookies.get('account') || '';
    if (accountId === '') {
      hashHistory.push('login')
      dispatch(getMineUserSuccess({}))
    } else {
      return requestData({
        url: `${BASE_URL}${APP_PATH}/${accountId}`
      })
      .then(json => {
        dispatch(getMineUserSuccess(json.userInfo))
        return json
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

const getMineUserSuccess = (payload) => {
  return {
    type: actionTypes.GET_MINE_USER,
    payload
  }
}
