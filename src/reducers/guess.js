import {
  RECEIVE_DISCARD_PILE,
  RECEIVE_PLAYER_PILE,
  MAKE_GUESS,
  CORRECT_GUESS,
  INVALIDATE_GUESS,
  SELECT_PLAYER
} from '../actions'

export const guess = (guessState = {
  hasGuessed: false,
  lastCard: {},
  cardsInPile: [],
  correctGuesses: 0
}, action) => {
  switch (action.type) {
    case RECEIVE_DISCARD_PILE:
      return {
        ...guessState,
        hasGuessed: false,
        cardsInPile: guessState.cardsInPile.concat([action.lastCard.code]),
        lastCard: action.lastCard
      }
    case MAKE_GUESS:
      return {
        ...guessState,
        hasGuessed: true,
        isHigher: action.nextCardIsHigher
      }
    case CORRECT_GUESS:
      return {
        ...guessState,
        hasGuessed: false,
        correctGuesses: guessState.correctGuesses + 1
      }
    case RECEIVE_PLAYER_PILE:
    case INVALIDATE_GUESS:
      return {
        ...guessState,
        hasGuessed: false,
        lastCard: {},
        cardsInPile: [],
        correctGuesses: 0
      }
    case SELECT_PLAYER:
      return {
        ...guessState,
        hasGuessed: false,
        correctGuesses: 0
      }
    default:
      return guessState
  }
}
