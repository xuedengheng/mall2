import * as actionTypes from '../consts/productList'

const initialState = {
  list: []
}

const productList = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCT_LIST:
      return {
        ...state,
        list: action.payload
      }
    default:
      return state
  }
}

export default productList
