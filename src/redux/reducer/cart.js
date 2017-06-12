import * as actionTypes from '../consts/cart'

const initialState = {
  list: [],
  selectedCarts: [],
  selectedAddressId: ''
}

const cart = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_CART_LIST:
      return {
        ...state,
        list: action.payload
      }
    case actionTypes.GET_SELECTED_CARTS:
      return {
        ...state,
        selectedCarts: action.payload
      }
    case actionTypes.GET_SELECTED_ADDRESSID:
      return {
        ...state,
        selectedAddressId: action.payload
      }
    default:
      return state
  }
}

export default cart
