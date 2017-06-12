import * as actionTypes from '../consts/invitation'
import Cookies from 'js-cookie'
import { hashHistory } from 'react-router'

import { changeLoadingState } from './loading'

import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

const APP_PATH = '/personal'

export const getInvitationList = () => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/invitaions`
    })
    .then(json => {
      dispatch(getInvitationListSuccess(json.invitations))
      return json
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}

const getInvitationListSuccess = (payload) => {
  return {
    type: actionTypes.GET_INVITATION_LIST,
    payload
  }
}

export const getInvitationInvitees = (invitationId) => {
  return dispatch => {
    const account = Cookies.get('account') || '';
    if (account === '') {
      hashHistory.push('login')
      dispatch(getInvitationInviteesSuccess({}))
    } else {
      const query = { inviter: account, invitationId }
      return requestData({
        url: `${BASE_URL}${APP_PATH}/invitees${Tool.paramType(query)}`
      })
      .then(json => {
        dispatch(getInvitationInviteesSuccess(json.results))
        return json
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }
}

const getInvitationInviteesSuccess = (payload) => {
  return {
    type: actionTypes.GET_INVITATION_INVITEES,
    payload
  }
}
