import * as actionTypes from '../consts/activity'

const initialState = {
  timeLimitList: [],
  timeLimitDetail: null,
}

const activity = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_TIME_LIMIT_ACTIVITY_LIST:
      return {
        ...state,
        timeLimitList: action.payload
      }
    case actionTypes.GET_TIME_LIMIT_ACTIVITY_DETAIL:
      return {
        ...state,
        timeLimitDetail: action.payload
      }
    default:
      return state
  }
}

export default activity
