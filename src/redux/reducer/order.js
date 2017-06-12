import * as actionTypes from '../consts/order'

const initialState = {
  status: '',
  page: 1,
  pageCount: 0,
  total: 0,
  list: [],
  detail: null,
  counts: []
}

const order = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.CHANGE_ORDER_STATUS:
      return {
        ...state,
        status: action.payload.status
      }
    case actionTypes.GET_ORDER_LIST:
      const { page, pageCount, list } = action.payload
      return {
        ...state,
        list: page > 1 ? state.list.concat(list) : list,
        page,
        pageCount
      }
    case actionTypes.GET_ORDER_DETAIL:
      return {
        ...state,
        detail: action.payload
      }
    case actionTypes.GET_ORDER_STATUS_COUNT:
      return {
        ...state,
        counts: action.payload
      }
    default:
      return state
  }
}

export default order
