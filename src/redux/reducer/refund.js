import * as actionTypes from '../consts/refund'

const initialState = {
  detail: null,
  trace: [],
  list: [],
  page: 0,
  size: 10,
  total: 0
}

const refund = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_REFUND_LIST_PAGE:
      return {
        ...state,
        page: action.payload
      }
    case actionTypes.GET_REFUND_LIST:
      return {
        ...state,
        list: state.page <= 0 ? action.payload.list : state.list.concat(action.payload.list),
        total: action.payload.total
      }
    case actionTypes.GET_REFUND_DETAIL:
      return {
        ...state,
        detail: action.payload
      }
    case actionTypes.GET_REFUND_TRACE:
      return {
        ...state,
        trace: action.payload
      }
    default:
      return state
  }
}

export default refund
