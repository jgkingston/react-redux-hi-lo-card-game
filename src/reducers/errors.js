import {
  RECEIVE_ERROR,
} from '../actions'

export const errors = (state = { }, action) => {
  switch (action.type) {
    case RECEIVE_ERROR:
      return {
        ...state,
        message: action.message,
        response: action.response
      }
    default:
      return state
  }
}
