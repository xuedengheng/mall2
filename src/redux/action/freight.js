import { Tool } from '../../config/Tool'
import { BASE_URL, requestData } from './consts'

const APP_PATH = '/yiwu/freight'

export const getSkuFreight = (query) => {
  return dispatch => {
    return requestData({
      url: `${BASE_URL}${APP_PATH}/query.do${Tool.paramType(query)}`
    })
    .then(json => {
      return json
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }
}
