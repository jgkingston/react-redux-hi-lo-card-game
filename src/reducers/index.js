import { combineReducers } from 'redux'
import {
  SELECT_PLAYER, SHUFFLE_DECK,
  REQUEST_DECK, RECEIVE_DECK,
  MAKE_GUESS, INVALIDATE_GUESS,
  RECEIVE_PILES
} from '../actions'

const selectedPlayer = (state = 'player1', action) => {
  switch (action.type) {
    case SELECT_PLAYER:
      return action.player
    default:
      return state
  }
}

const guess = (guessState = {
  hasGuessed: false,
  lastCard: {}
}, action) => {
  switch (action.type) {
    case MAKE_GUESS:
      return {
        ...guessState,
        hasGuessed: true,
        lastCard: action.lastCard,
        isHigher: action.nextCardIsHigher
      }
    case INVALIDATE_GUESS:
      return {
        ...guessState,
        hasGuessed: false,
        lastCard: {}
      }
    default:
      return guessState
  }
}

const deck = (deckState = {
  isFetching: false,
  shouldShuffle: false
}, action) => {
  switch (action.type) {
    case SHUFFLE_DECK:
      return {
        ...deckState,
        shouldShuffle: true
      }
    case REQUEST_DECK:
      return {
        ...deckState,
        isFetching: true,
        shouldShuffle: false
      }
    case RECEIVE_PILES:
    case RECEIVE_DECK:
      return {
        isFetching: false,
        shouldShuffle: false,
        lastUpdated: action.receivedAt,
        ...action.deck
      }
    default:
      return deckState
  }
}

const score = (state = {
  points: 0,
  correctGuesses: 0
}, action) => {
  switch (action.type) {
    case RECEIVE_PILES:
      console.log(action)
      return {
        ...state,
        correctGuesses: action.deck.piles.discard.remaining - 1
      }
    default:
      return state
  }
}

const scoreByPlayer = (state = { }, action) => {
  switch (action.type) {
    case RECEIVE_PILES:
      return {
        ...state,
        [action.player]: score(state[action.player], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  deck,
  selectedPlayer,
  guess,
  scoreByPlayer
})

export default rootReducer
