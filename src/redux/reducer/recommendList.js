import * as actionTypes from '../consts/recommendList'

const initialState = {
  list: []
}

const recommendList = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_RECOMMEND_LIST:
      return {
        ...state,
        list: action.payload
      }
    default:
      return state
  }
}

export default recommendList
