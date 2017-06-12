import * as actionTypes from '../consts/express'

const initialState = {
  jdList: []
}

const express = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_JD_EXPRESS_LIST:
      return {
        ...state,
        jdList: action.payload
      }
    default:
      return state
  }
}

export default express
