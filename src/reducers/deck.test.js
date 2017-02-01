import {
  SHUFFLE_DECK,
  REQUEST_DECK,
  RECEIVE_PLAYER_PILE,
  RECEIVE_DECK,
  RECEIVE_DISCARD_PILE } from '../actions'
import { deck } from './deck'

describe('deck reducer', () => {
  it('should return the initial state', () => {
    expect(
      deck(undefined, {})
    ).toEqual({
      isFetching: false,
      shouldShuffle: false,
      readyForGuess: false
    })
  })

  it('should handle SHUFFLE_DECK', () => {
    expect(
      deck({}, {
        type: SHUFFLE_DECK
      })
    ).toEqual(
      {
        readyForGuess: false,
        shouldShuffle: true
      }
    )
    expect(
      deck({
        readyForGuess: true,
        shouldShuffle: false
      }, {
        type: SHUFFLE_DECK
      })
    ).toEqual(
      {
        readyForGuess: false,
        shouldShuffle: true
      }
    )
  })

  it('should handle REQUEST_DECK', () => {
    expect(
      deck({}, {
        type: REQUEST_DECK
      })
    ).toEqual(
      {
        readyForGuess: false,
        isFetching: true,
        shouldShuffle: false
      }
    )
    expect(
      deck({
        readyForGuess: true,
        isFetching: false,
        shouldShuffle: true
      }, {
        type: REQUEST_DECK
      })
    ).toEqual(
      {
        readyForGuess: false,
        isFetching: true,
        shouldShuffle: false
      }
    )
  })

  it('should handle RECEIVE_PLAYER_PILE', () => {
    expect(
      deck({}, {
        type: RECEIVE_PLAYER_PILE,
        deck: { deck_id: 'foo' },
        receivedAt: 'time'
      })
    ).toEqual(
      {
        isFetching: false,
        readyForGuess: false,
        shouldShuffle: false,
        lastUpdated: 'time',
        deck_id: 'foo'
      }
    )
    expect(
      deck({
        isFetching: true,
        readyForGuess: true,
        shouldShuffle: true,
        lastUpdated: 'time1',
        deck_id: 'foo'
      }, {
        type: RECEIVE_PLAYER_PILE,
        deck: { deck_id: 'bar' },
        receivedAt: 'time2'
      })
    ).toEqual(
      {
        isFetching: false,
        readyForGuess: false,
        shouldShuffle: false,
        lastUpdated: 'time2',
        deck_id: 'bar'
      }
    )
  })

  it('should handle RECEIVE_DECK', () => {
    expect(
      deck({}, {
        type: RECEIVE_DECK,
        deck: { deck_id: 'foo' },
        receivedAt: 'time'
      })
    ).toEqual(
      {
        isFetching: false,
        readyForGuess: false,
        shouldShuffle: false,
        lastUpdated: 'time',
        deck_id: 'foo'
      }
    )
    expect(
      deck({
        isFetching: true,
        readyForGuess: true,
        shouldShuffle: true,
        lastUpdated: 'time1',
        deck_id: 'foo'
      }, {
        type: RECEIVE_DECK,
        deck: { deck_id: 'bar' },
        receivedAt: 'time2'
      })
    ).toEqual(
      {
        isFetching: false,
        readyForGuess: false,
        shouldShuffle: false,
        lastUpdated: 'time2',
        deck_id: 'bar'
      }
    )
  })

  it('should handle RECEIVE_DISCARD_PILE', () => {
    expect(
      deck({}, {
        type: RECEIVE_DISCARD_PILE,
        deck: { deck_id: 'foo' },
        receivedAt: 'time'
      })
    ).toEqual(
      {
        isFetching: false,
        readyForGuess: true,
        shouldShuffle: false,
        lastUpdated: 'time',
        deck_id: 'foo'
      }
    )
    expect(
      deck({
        isFetching: true,
        readyForGuess: false,
        shouldShuffle: true,
        lastUpdated: 'time1',
        deck_id: 'foo'
      }, {
        type: RECEIVE_DISCARD_PILE,
        deck: { deck_id: 'bar' },
        receivedAt: 'time2'
      })
    ).toEqual(
      {
        isFetching: false,
        readyForGuess: true,
        shouldShuffle: false,
        lastUpdated: 'time2',
        deck_id: 'bar'
      }
    )
  })
})
