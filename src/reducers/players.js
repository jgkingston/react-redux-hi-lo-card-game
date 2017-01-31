import {
  RECEIVE_PLAYER_PILE,
  RESET_SCORES,
  SELECT_PLAYER
} from '../actions'

export const players = (state = [
  { name: 'player1', title: 'Player 1' },
  { name: 'player2', title: 'Player 2' }
], action) => {
  switch (action.type) {
    default:
      return state
  }
}

const score = (state = {
  points: 0,
}, action) => {
  switch (action.type) {
    case RECEIVE_PLAYER_PILE:
      return {
        ...state,
        points: action.deck.piles[action.player].remaining
      }
    default:
      return state
  }
}

export const scoreByPlayer = (state = {
  player1: {
    points: 0
  },
  player2: {
    points: 0
  }
}, action) => {
  switch (action.type) {
    case RECEIVE_PLAYER_PILE:
      return {
        ...state,
        [action.player]: score(state[action.player], action)
      }
    case RESET_SCORES:
      return {
        player1: {
          points: 0
        },
        player2: {
          points: 0
        }
      }
    default:
      return state
  }
}

export const selectedPlayer = (state = 'player1', action) => {
  switch (action.type) {
    case SELECT_PLAYER:
      return action.player
    default:
      return state
  }
}
