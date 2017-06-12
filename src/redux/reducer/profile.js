import * as actionTypes from '../consts/profile'

const initialState = {
  info: {}
}

const profile = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_USER_PROFILE:
      return {
        ...state,
        info: action.payload
      }
    default:
      return state
  }
}

export default profile
