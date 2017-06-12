import * as actionTypes from '../consts/skuProduct'

const initialState = {
	id: "",
	supplier: {},
	attribute: [],
	pictureUrls: [],
	promotions: [],
	sku: []
}

const modalProduct = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_MODAL_PRODUCT:
      return action.payload
    default:
      return state
  }
}

export default modalProduct
