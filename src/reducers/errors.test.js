import {
  RECEIVE_ERROR,
} from '../actions'
import { errors } from './errors'

describe('errors reducer', () => {
  it('should return the initial state', () => {
    expect(
      errors(undefined, {})
    ).toEqual({})
  })

  it('should handle RECEIVE_ERROR', () => {
    expect(
      errors({}, {
        type: RECEIVE_ERROR,
        message: 'foo',
        response: {
          status: 'bar'
        }
      })
    ).toEqual({
      message: 'foo',
      response: {
        status: 'bar'
      }
    })
  })
})
