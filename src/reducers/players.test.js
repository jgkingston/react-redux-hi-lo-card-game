import {
  RECEIVE_PLAYER_PILE,
  RESET_SCORES,
  SELECT_PLAYER
} from '../actions'
import { players, scoreByPlayer, selectedPlayer } from './players'

describe('players reducer', () => {
  it('should return the initial state', () => {
    expect(
      players(undefined, {})
    ).toEqual([
      { name: 'player1', title: 'Player 1' },
      { name: 'player2', title: 'Player 2' }
    ])
  })
})

describe('scoreByPlayer reducer', () => {
  it('should return the initial state', () => {
    expect(
      scoreByPlayer(undefined, {})
    ).toEqual({
      player1: {
        points: 0
      },
      player2: {
        points: 0
      }
    })
  })

  it('should handle RECEIVE_PLAYER_PILE', () => {
    expect(
      scoreByPlayer({
        player1: {
          points: 0
        },
        player2: {
          points: 0
        }
      }, {
        type: RECEIVE_PLAYER_PILE,
        player: 'player1',
        deck: {
          piles: {
            'player1': {
              remaining: 2
            }
          }
        }
      })
    ).toEqual({
      player1: {
        points: 2
      },
      player2: {
        points: 0
      }
    })
  })
})

describe('selectedPlayer reducer', () => {
  it('should return the initial state', () => {
    expect(
      selectedPlayer(undefined, {})
    ).toEqual('player1')
  })

  it('should handle SELECT_PLAYER', () => {
    expect(
      selectedPlayer('player1', {
        type: SELECT_PLAYER,
        player: 'player2'
      })
    ).toEqual('player2')
  })
})
