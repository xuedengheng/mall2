import * as actionTypes from '../consts/payment'

const initialState = {
  token: '',
  result: null
}

const payment = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PAY_TOKEN:
      return {
        ...state,
        token: action.payload
      }
    case actionTypes.GET_PAY_RESULT:
      return {
        ...state,
        result: action.payload
      }
    default:
      return state
  }
}

export default payment
