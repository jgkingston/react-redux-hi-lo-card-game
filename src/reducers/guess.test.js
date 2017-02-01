import {
  RECEIVE_DISCARD_PILE,
  RECEIVE_PLAYER_PILE,
  MAKE_GUESS,
  CORRECT_GUESS,
  INVALIDATE_GUESS,
  SELECT_PLAYER
} from '../actions'
import { guess } from './guess'

describe('guess reducer', () => {
  it('should return the initial state', () => {
    expect(
      guess(undefined, {})
    ).toEqual({
      hasGuessed: false,
      lastCard: {},
      cardsInPile: [],
      correctGuesses: 0
    })
  })
  it('should handle RECEIVE_DISCARD_PILE', () => {
    expect(
      guess({
        cardsInPile: []
      }, {
        type: RECEIVE_DISCARD_PILE,
        lastCard: { code: 'AS' }
      })
    ).toEqual({
      hasGuessed: false,
      cardsInPile: ['AS'],
      lastCard: { code: 'AS' }
    })
  })
  it('should handle RECEIVE_PLAYER_PILE', () => {
    expect(
      guess({}, {
        type: RECEIVE_PLAYER_PILE
      })
    ).toEqual({
      hasGuessed: false,
      lastCard: {},
      cardsInPile: [],
      correctGuesses: 0
    })
  })
  it('should handle MAKE_GUESS', () => {
    expect(
      guess({}, {
        type: MAKE_GUESS,
        nextCardIsHigher: true
      })
    ).toEqual({
      hasGuessed: true,
      isHigher: true
    })
  })
  it('should handle CORRECT_GUESS', () => {
    expect(
      guess({
        hasGuessed: true,
        correctGuesses: 1
      }, {
        type: CORRECT_GUESS
      })
    ).toEqual({
      hasGuessed: false,
      correctGuesses: 2
    })
  })
  it('should handle INVALIDATE_GUESS', () => {
    expect(
      guess({
        lastCard: { code: 'AS' },
        cardsInPile: ['AS'],
        correctGuesses: 1
      }, {
        type: INVALIDATE_GUESS
      })
    ).toEqual({
      hasGuessed: false,
      lastCard: {},
      cardsInPile: [],
      correctGuesses: 0
    })
  })
  it('should handle SELECT_PLAYER', () => {
    expect(
      guess({
        hasGuessed: true,
        lastCard: { code: 'AS' },
        cardsInPile: ['AS'],
        correctGuesses: 1
      }, {
        type: SELECT_PLAYER
      })
    ).toEqual({
      hasGuessed: false,
      lastCard: { code: 'AS' },
      cardsInPile: ['AS'],
      correctGuesses: 0
    })
  })
})
