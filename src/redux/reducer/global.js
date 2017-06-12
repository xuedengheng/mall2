import * as actionTypes from '../consts/global'

const initialState = {
  showFixed: false,
  showSkuModal: false
}

const global = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SHOW_PAGE_FIXED:
      return {
        ...state,
        showFixed: true
      }
    case actionTypes.CHANGE_SHOW_SKU_MODAL:
      return {
        ...state,
        showSkuModal: action.payload
      }
    default:
      return state
  }
}

export default global
