import * as actionTypes from '../consts/invitation'

const initialState = {
  list: [],
  invitees: []
}

const invitation = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_INVITATION_LIST:
      return {
        ...state,
        list: action.payload
      }
    case actionTypes.GET_INVITATION_INVITEES:
      return {
        ...state,
        invitees: action.payload
      }
    default:
      return state
  }
}

export default invitation
