import * as actionTypes from '../consts/loading'

const initialState = {
  enabled: false
}

const loading = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.CHANGE_LOADING_STATE:
      return {
        ...state,
        enabled: action.payload
      }
    default:
      return state
  }
}

export default loading
