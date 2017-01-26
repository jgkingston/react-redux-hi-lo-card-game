export const REQUEST_DECK = 'REQUEST_DECK'
export const RECEIVE_DECK = 'RECEIVE_DECK'
export const RECEIVE_PILES = 'RECEIVE_PILES'
export const SHUFFLE_DECK = 'SHUFFLE_DECK'
export const SELECT_PLAYER = 'SELECT_PLAYER'
export const MAKE_GUESS = 'MAKE_GUESS'
export const INVALIDATE_GUESS = 'INVALIDATE_GUESS'


export const selectPlayer = player => ({
  type: SELECT_PLAYER,
  player
})

export const shuffleDeck = deck_id => ({
  type: SHUFFLE_DECK,
  deck_id
})

export const requestDeck = () => ({
  type: REQUEST_DECK
})

export const receiveDeck = json => ({
  type: RECEIVE_DECK,
  deck: json,
  receivedAt: Date.now()
})

export const receivePiles = (json, player) => ({
  type: RECEIVE_PILES,
  deck: json,
  player: player,
  receivedAt: Date.now()
})

export const makeGuess = (nextCardIsHigher, lastCard, selectedPlayer) => ({
  type: MAKE_GUESS,
  nextCardIsHigher,
  lastCard,
  player: selectedPlayer
})

export const invalidateGuess = () => ({
  type: INVALIDATE_GUESS
})

const baseURI = 'https://deckofcardsapi.com/api/deck/';

const fetchDeck = deck_id => dispatch => {
  const id = 'new' // || deck_id // was shuffling existing deck, but the piles persist after shuffle
  dispatch(requestDeck())
  return fetch(baseURI + id + '/shuffle/') //?deck_count=1 assumed
    .then(response => response.json())
    .then(json => dispatch(receiveDeck(json)))
}

const drawCard = deck_id => dispatch => {
  return fetch(baseURI + deck_id +'/draw/?count=1')
    .then(response => response.json())
    .then(json => dispatch(receiveDeck(json)))
}

function shouldFetchDeck(state) {
  const { deck } = state
  if (!deck.deck_id) {
    return true
  } else if (deck.isFetching) {
    return false
  } else {
    return deck.shouldShuffle
  }
}

function shouldDrawCard(state) {
  const { deck: { cards, isFetching } } = state
  if (isFetching) {
    return false
  } else if (!cards) {
    return true
  } else {
    return false
  }
}

export const fetchDeckIfNeeded = () => (dispatch, getState) => {
  const { deck: { deck_id } } = getState();
  if (shouldFetchDeck(getState())) {
    return dispatch(fetchDeck(deck_id))
  }
}

export const drawCardIfNeeded = () => (dispatch, getState) => {
  const { deck: { deck_id } } = getState();
  if (shouldDrawCard(getState())) {
    return dispatch(drawCard(deck_id))
  }
}

// https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=AS,2S
const addToPile = (deck_id, cardCodes, pile, player) => dispatch => {
  return fetch(baseURI + deck_id +'/pile/' + pile + '/add/?cards=' + cardCodes)
    .then(response => response.json())
    .then(json => dispatch(receivePiles(json, player)))
}

export const flipNextCard = () => (dispatch, getState) => {
  const { deck: { deck_id, cards }, selectedPlayer } = getState();
  const cardCodes = cards.map(card => {
    return card.code
  }).join(',')
  return dispatch(addToPile(deck_id, cardCodes, 'discard', selectedPlayer))
}
