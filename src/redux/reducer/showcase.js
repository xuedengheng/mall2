import * as actionTypes from '../consts/showcase'

const initialState = {
  isInited: false,
  index: '-1',
  list: [],
  template: null
}

const showcase = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.UPDATE_SHOWCASE_INDEX:
      return {
        ...state,
        index: action.payload
      }
    case actionTypes.INIT_SHOWCASE:
      return {
        ...state,
        isInited: true
      }
    case actionTypes.GET_SHOWCASE_LIST:
      return {
        ...state,
        list: action.payload
      }
    case actionTypes.GET_SHOWCASE_TEMPLATE:
      return {
        ...state,
        template: action.payload
      }
    default:
      return state
  }
}

export default showcase
