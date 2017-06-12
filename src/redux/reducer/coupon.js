import * as actionTypes from '../consts/coupon'

const initialState = {
  count: 0,
  page: 0,
  total: 0,
  list: []
}

const coupon = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_COUPON_COUNT:
      return {
        ...state,
        count: action.payload
      }
    case actionTypes.CHANGE_COUPON_PAGE:
      return {
        ...state,
        page: action.payload
      }
    case actionTypes.GET_COUPON_LIST:
      const { total, coupons } = action.payload
      return {
        ...state,
        total,
        list: state.page === 0 ? coupons : state.list.concat(coupons)
      }
    default:
      return state
  }
}

export default coupon
