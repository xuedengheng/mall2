import * as actionTypes from '../consts/mine'

const initialState = {
  user: {}
}

const mine = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_MINE_USER:
      return {
        ...state,
        user: action.payload
      }
    default:
      return state
  }
}

export default mine
