import Cookies from 'js-cookie'
import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

const APP_PATH = '/yiwu/parcel'

export const confirmParcel = (parcelId) => {
  return dispatch => {
    const account = Cookies.get('account') || '';
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      return requestData({
        url: `${BASE_URL}${APP_PATH}/receive${Tool.paramType({ mobilePhone: account, parcelId })}`,
        method: 'POST'
      })
    }
  }
}

export const delayParcel = (parcelId) => {
  return dispatch => {
    const account = Cookies.get('account') || '';
    if (account === '') {
      hashHistory.push('login')
      return false
    } else {
      return requestData({
        url: `${BASE_URL}${APP_PATH}/delay${Tool.paramType({ mobilePhone: account, parcelId })}`,
        method: 'POST'
      })
    }
  }
}
