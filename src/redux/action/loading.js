import * as actionTypes from '../consts/loading'

export const changeLoadingState = (state) => {
  return {
    type: actionTypes.CHANGE_LOADING_STATE,
    payload: state
  }
}
