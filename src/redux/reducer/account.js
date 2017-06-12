import * as actionTypes from '../consts/account'

const initialState = {
  isInited: false,
  user: {},
  token: null,
}

const account = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.INIT:
      return {
        ...state,
        isInited: true
      }
    case actionTypes.LOGIN:
      return {
        ...state,
        user:  action.user,
        token: action.token
      }
    case actionTypes.REGISTER_DONE:
      return {
        ...state,
        user:  action.user
      }
    case actionTypes.RESET_PASSWORD_DONE:
      return {
        ...state,
        user:  action.user
      }
    default:
      return state
  }
}

export default account
