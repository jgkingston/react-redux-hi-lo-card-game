import { combineReducers } from 'redux'
import { deck } from './deck'
import { guess } from './guess'
import { players, scoreByPlayer, selectedPlayer } from './players'

const rootReducer = combineReducers({
  deck,
  selectedPlayer,
  guess,
  scoreByPlayer,
  players
})

export default rootReducer
