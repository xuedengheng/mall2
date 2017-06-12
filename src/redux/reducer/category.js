import * as actionTypes from '../consts/category'

const initialState = {
  categories: [],
  subCategories: []
}

const category = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_CATEGORY_LIST:
      return {
        ...state,
        categories: action.payload
      }
    case actionTypes.GET_SUB_CATEGORY_LIST:
      return {
        ...state,
        subCategories: action.payload
      }
    default:
      return state
  }
}

export default category
