import * as actionTypes from '../consts/article'

const initialState = {
  page: 0,
  total: 0,
  list: [],
  detail: null
}

const article = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.INIT_ARTICLE_LIST:
      return {
        ...state,
        list: action.payload
      }
    case actionTypes.GET_ARTICLE_DETAIL:
      return {
        ...state,
        detail: action.payload
      }
    case actionTypes.ADD_ARTICLE_LIST:
      return {
        ...state,
        list: state.list.concat(action.payload)
      }
    case actionTypes.CHANGE_ARTICLE_LIST_TOTAL:
      return {
        ...state,
        total: action.payload
      }
    case actionTypes.CHANGE_ARTICLES_PAGE_NO:
      return {
        ...state,
        page: action.payload
      }
    default:
      return state
  }
}

export default article
