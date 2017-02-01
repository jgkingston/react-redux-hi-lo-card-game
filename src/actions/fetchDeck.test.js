import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { fetchDeckIfNeeded, REQUEST_DECK, RECEIVE_DECK } from './index.js'
import fetchMock from 'fetch-mock'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('fetchDeckIfNeeded async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('creates RECEIVE_DECK when fetching deck has been done', () => {
    fetchMock.get('https://deckofcardsapi.com/api/deck/new/shuffle/', { deck_id: 'foo' })

    const expectedActions = [
      { type: REQUEST_DECK },
      { type: RECEIVE_DECK, deck: { deck_id: 'foo' } } // mocking Date.now() is a bit of a headache
    ]
    const store = mockStore({ deck: {} })

    return store.dispatch(fetchDeckIfNeeded())
      .then(() => { // return of async actions
        const actions = store.getActions()
        expect(actions[0]).toEqual(expectedActions[0])
        expect(actions[1].type).toEqual(expectedActions[1].type)
        expect(actions[1].deck).toEqual(expectedActions[1].deck)
      })
  })
})
