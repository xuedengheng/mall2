import * as actionTypes from '../consts/address'

const initialState = {
  addNewAddressObj: null,
  addressList: [],
  updateAddress: {},
  deleteAddress: {},
  selectAddress: {}
}

const address = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.ADD_NEW_ADDRESS:
      return {
        ...state,
        addNewAddressObj: action.json
      }
    case actionTypes.ADDRESS_LIST:
      return {
        ...state,
        addressList: action.json
      }
    case actionTypes.UPDATE_ADDRESS:
      return {
        ...state,
        updateAddress: action.json
      }
    case actionTypes.DELETE_ADDRESS:
      return {
        ...state,
        deleteAddress: action.json
      }
    case actionTypes.SELECT_ADDRESS:
      return {
        ...state,
        selectAddress: action.json
      }
    default:
      return state
  }
}

export default address
