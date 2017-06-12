import * as actionTypes from '../consts/promotion'

const initialState = {
  orderSkuDTOs: [],
  promotionDiscountDTOs: [],
  list: [],
  totalAmount: 0,
  totalFreight: 0,
  totalPayAmount: 0
}

const promotion = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PROMOTION_LIST:
      return {
        ...state,
        list: action.payload
      }
    case actionTypes.GET_PROMOTION_FINAL_FEE:
      const { promotionDiscountDTOs, orderSkuDTOs, totalAmount, totalFreight, totalPayAmount } = action.payload
      return {
        ...state,
        orderSkuDTOs,
        promotionDiscountDTOs,
        totalAmount,
        totalFreight,
        totalPayAmount
      }
    default:
      return state
  }
}

export default promotion
