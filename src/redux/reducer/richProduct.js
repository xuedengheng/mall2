import * as actionTypes from '../consts/richProduct'

const initialState = {
	detail: ''
}

const richProduct = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_RICH_PRODUCT:
      return {
        ...state,
        detail: action.payload
      }
    default:
      return state
  }
}

export default richProduct
