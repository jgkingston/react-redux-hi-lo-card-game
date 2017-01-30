import {
  SHUFFLE_DECK,
  REQUEST_DECK,
  RECEIVE_PLAYER_PILE,
  RECEIVE_DECK,
  RECEIVE_DISCARD_PILE } from '../actions'


export const deck = (deckState = {
  isFetching: false,
  shouldShuffle: false,
  readyForGuess: false
}, action) => {
  switch (action.type) {
    case SHUFFLE_DECK:
      return {
        ...deckState,
        readyForGuess: false,
        shouldShuffle: true
      }
    case REQUEST_DECK:
      return {
        ...deckState,
        readyForGuess: false,
        isFetching: true,
        shouldShuffle: false
      }
    case RECEIVE_PLAYER_PILE:
    case RECEIVE_DECK:
      return {
        isFetching: false,
        readyForGuess: false,
        shouldShuffle: false,
        lastUpdated: action.receivedAt,
        ...action.deck
      }
    case RECEIVE_DISCARD_PILE:
      return {
        isFetching: false,
        readyForGuess: true,
        shouldShuffle: false,
        lastUpdated: action.receivedAt,
        ...action.deck
      }
    default:
      return deckState
  }
}
