import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { addToPlayerPile, REQUEST_DECK, RECEIVE_PLAYER_PILE } from './index.js'
import fetchMock from 'fetch-mock'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('addToPlayerPile async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('creates RECEIVE_PLAYER_PILE when cards have been added', () => {
    fetchMock.get('https://deckofcardsapi.com/api/deck/foo/pile/player1/add/?cards=AS,5H', { deck_id: 'foo', piles: { player1: { remaining: 2 } } })

    const expectedActions = [
      { type: REQUEST_DECK },
      { type: RECEIVE_PLAYER_PILE, deck: { deck_id: 'foo', piles: { player1: { remaining: 2 } } } } // mocking Date.now() is a bit of a headache
    ]
    const store = mockStore({})

    return store.dispatch(addToPlayerPile({ deck_id: 'foo', cards: [{ code: 'AS' }] }, { code: '5H' }, 'player1'))
      .then(() => { // return of async actions
        const actions = store.getActions()
        expect(actions[0]).toEqual(expectedActions[0])
        expect(actions[1].type).toEqual(expectedActions[1].type)
        expect(actions[1].deck).toEqual(expectedActions[1].deck)
        expect(actions[1].deck.piles).toEqual(expectedActions[1].deck.piles)
      })
  })
})
