import * as actionTypes from '../consts/global'

export const showPageFixed = () => {
  return {
    type: actionTypes.SHOW_PAGE_FIXED
  }
}

export const changeShowSkuModal = (isShow) => {
  return {
    type: actionTypes.CHANGE_SHOW_SKU_MODAL,
    payload: isShow
  }
}
