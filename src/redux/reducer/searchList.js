import * as actionTypes from '../consts/searchList'

const initialState = {
  list: [],
  pageNo: 0,
  total: 0
}

const searchList = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_SEARCH_LIST:
      return {
        ...state,
        list: action.payload
      }
    case actionTypes.CHANGE_SEARCH_PAGE_NO:
      return {
        ...state,
        pageNo: action.payload
      }
    case actionTypes.CHANGE_SEARCH_LIST_TOTAL:
      return {
        ...state,
        total: action.payload
      }
    case actionTypes.LOAD_MORE_SEARCH_LIST:
      return {
        ...state,
        list: state.list.concat(action.payload)
      }
    default:
      return state
  }
}

export default searchList
