export const players = (state = [{name: 'player1'}, {name:'player2'}], action) => {
  switch (action.type) {
    default:
      return state
  }
}

const score = (state = {
  points: 0,
}, action) => {
  switch (action.type) {
    case 'RECEIVE_PILES':
      return {
        ...state,
        points: action.deck.piles[action.player].remaining
      }
    default:
      return state
  }
}

export const scoreByPlayer = (state = { }, action) => {
  switch (action.type) {
    case 'RECEIVE_PILES':
      return {
        ...state,
        [action.player]: score(state[action.player], action)
      }
    default:
      return state
  }
}

export const selectedPlayer = (state = 'player1', action) => {
  switch (action.type) {
    case 'SELECT_PLAYER':
      return action.player
    default:
      return state
  }
}
