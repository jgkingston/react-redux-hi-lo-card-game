import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { discardIfNeeded, REQUEST_DECK, RECEIVE_DISCARD_PILE } from './index.js'
import fetchMock from 'fetch-mock'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('discardIfNeeded async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('creates RECEIVE_DISCARD_PILE when discarding card has been done', () => {
    fetchMock.get('https://deckofcardsapi.com/api/deck/foo/pile/discard/add/?cards=AS', { deck_id: 'foo', piles: { discard: { remaining: 1 } } })

    const expectedActions = [
      { type: REQUEST_DECK },
      { type: RECEIVE_DISCARD_PILE, deck: { deck_id: 'foo', piles: { discard: { remaining: 1 } } } } // mocking Date.now() is a bit of a headache
    ]
    const store = mockStore({ deck: { deck_id: 'foo', cards: [{ code: 'AS' }] }, guess: { lastCard: {} } })

    return store.dispatch(discardIfNeeded())
      .then(() => { // return of async actions
        const actions = store.getActions()
        expect(actions[0]).toEqual(expectedActions[0])
        expect(actions[1].type).toEqual(expectedActions[1].type)
        expect(actions[1].deck).toEqual(expectedActions[1].deck)
        expect(actions[1].guess).toEqual(expectedActions[1].guess)
      })
  })
})
