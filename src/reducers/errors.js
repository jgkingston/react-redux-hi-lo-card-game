import {
  RECEIVE_ERROR,
} from '../actions'

export const errors = (state = { }, action) => {
  switch (action.type) {
    case RECEIVE_ERROR:
      return {
        ...state,
        message: action.error.message,
        response: action.error.response
      }
    default:
      return state
  }
}
