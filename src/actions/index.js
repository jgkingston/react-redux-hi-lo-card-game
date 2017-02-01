import { mapCardValues } from '../utilities/mapCardValues'

export const REQUEST_DECK = 'REQUEST_DECK'
export const RECEIVE_DECK = 'RECEIVE_DECK'
export const RECEIVE_PLAYER_PILE = 'RECEIVE_PLAYER_PILE'
export const SHUFFLE_DECK = 'SHUFFLE_DECK'
export const SELECT_PLAYER = 'SELECT_PLAYER'
export const MAKE_GUESS = 'MAKE_GUESS'
export const CORRECT_GUESS = 'CORRECT_GUESS'
export const INVALIDATE_GUESS = 'INVALIDATE_GUESS'
export const RESET_SCORES = 'RESET_SCORES'
export const RECEIVE_DISCARD_PILE = 'RECEIVE_DISCARD_PILE'
export const RECEIVE_ERROR = 'RECEIVE_ERROR'


export const selectPlayer = player => ({
  type: SELECT_PLAYER,
  player
})

export const shuffleDeck = () => ({
  type: SHUFFLE_DECK
})

export const requestDeck = () => ({
  type: REQUEST_DECK
})

export const receiveDeck = json => ({
  type: RECEIVE_DECK,
  deck: json,
  receivedAt: Date.now()
})

export const receivePlayerPile = (json, player) => ({
  type: RECEIVE_PLAYER_PILE,
  deck: json,
  player,
  receivedAt: Date.now()
})

export const receiveDiscardPile = (json, player, lastCard) => ({
  type: RECEIVE_DISCARD_PILE,
  deck: json,
  player,
  lastCard,
  receivedAt: Date.now()
})

export const makeGuess = (nextCardIsHigher, player) => ({
  type: MAKE_GUESS,
  nextCardIsHigher,
  player
})

export const correctGuess = () => ({
  type: CORRECT_GUESS
})

export const invalidateGuess = () => ({
  type: INVALIDATE_GUESS
})

export const resetScores = () => ({
  type: RESET_SCORES
})

export const receiveError = error => ({
  type:  RECEIVE_ERROR,
  message: error.message,
  response: error.response
})

const baseURI = 'https://deckofcardsapi.com/api/deck/'

async function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  }
  const errorResponse = await response.json()
  const error = new Error(errorResponse.error)
  error.response = response
  throw error
}

const fetchDeck = deck_id => dispatch => {
  const id = 'new' // || deck_id // was shuffling existing deck, but the piles persist after shuffle
  dispatch(requestDeck())

  return fetch(baseURI + id + '/shuffle/') //?deck_count=1 assumed
    .then(checkStatus)
    .then(json => dispatch(receiveDeck(json)))
    .catch(error => dispatch(receiveError(error)))
}

export const drawCard = deck_id => dispatch => {
  dispatch(requestDeck())
  return fetch(baseURI + deck_id +'/draw/?count=1')
    .then(checkStatus)
    .then(json => dispatch(receiveDeck(json)))
    .catch(error => dispatch(receiveError(error)))
}

// https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=AS,2S
export const addToPlayerPile = (deck, currentCard, player) => dispatch => {
  const { deck_id, cards } = deck
  cards.push(currentCard)
  const cardCodes = cards.map(card => {
    return card.code
  }).join(',')
  dispatch(requestDeck())
  return fetch(baseURI + deck_id +'/pile/' + player + '/add/?cards=' + cardCodes)
    .then(checkStatus)
    .then(json => dispatch(receivePlayerPile(json, player)))
    .catch(error => dispatch(receiveError(error)))
}

const drawDiscardPile = (deck_id, cardsInPile, currentCard, selectedPlayer) => dispatch => {
  // This is a bit silly. I had anticipated having the ability to draw using a ?card_count parameter
  //  from a pile, but the API does not support that
  dispatch(requestDeck())
  return fetch(baseURI + deck_id +'/pile/discard/draw/?cards=' + cardsInPile.join(','))
    .then(checkStatus)
    .then(json => dispatch(addToPlayerPile(json, currentCard, selectedPlayer)))
    .catch(error => dispatch(receiveError(error)))
}

const discard = (deck_id, card, player, lastCard) => dispatch => {
  dispatch(requestDeck())
  return fetch(baseURI + deck_id +'/pile/discard/add/?cards=' + card.code)
    .then(checkStatus)
    .then(json => dispatch(receiveDiscardPile(json, player, card)))
    .catch(error => dispatch(receiveError(error)))
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

export const fetchDeckIfNeeded = () => (dispatch, getState) => {
  const { deck: { deck_id } } = getState()
  if (shouldFetchDeck(getState())) {
    return dispatch(fetchDeck(deck_id))
  }
}

function shouldDrawCard(state) {
  const { deck: { cards, isFetching, remaining }, guess: { lastCard } } = state
  if (isFetching) {
    return false
  } else if (cards) {
    return false
  } else if ( remaining === 0) {
    return false
  } else if (!lastCard.value) {
    return true
  } else {
    return false
  }
}

export const drawCardIfNeeded = () => (dispatch, getState) => {
  const { deck: { deck_id } } = getState()
  if (shouldDrawCard(getState())) {
    return dispatch(drawCard(deck_id))
  }
}

function shouldDiscard(state) {
  const { deck: { cards, isFetching }, guess: { lastCard } } = state
  if (isFetching) {
    return false
  } else if (cards && !lastCard.value) {
    return true
  } else {
    return false
  }
}

export const discardIfNeeded = () => (dispatch, getState) => {
  const { deck: { deck_id, cards }, selectedPlayer } = getState()
  if (shouldDiscard(getState())) {
    return dispatch(discard(deck_id, cards[0], selectedPlayer))
  }
}

function shouldRecordResult(state) {
  const { deck: { cards, isFetching }, guess: { hasGuessed, lastCard } } = state
  if ( isFetching ) {
    return false
  } else if ( hasGuessed && cards && lastCard.code && lastCard.code !== cards[0].code ) {
    return true
  } else {
    return false
  }
}

function guessIsCorrect(state) {
  const { deck: { cards }, guess: { lastCard, isHigher } } = state
  const currentCardValue = cards && mapCardValues(cards[0].value)
  const lastCardValue = mapCardValues(lastCard.value)
   if (isHigher) {
     return currentCardValue > lastCardValue
   }
   return currentCardValue < lastCardValue
}

export const recordResultIfReady = (deck, guess, selectedPlayer) => (dispatch, getState) => {
  const { deck: { deck_id, cards }, guess: { cardsInPile } } = getState()
  if (shouldRecordResult(getState())) {
    const newCard = cards[0]
    if (guessIsCorrect(getState())) {
      dispatch(correctGuess())
      dispatch(discard(deck_id, newCard, selectedPlayer))
    } else {
      dispatch(drawDiscardPile(deck_id, cardsInPile, newCard, selectedPlayer))
    }
  }
}

export const passPlay = (currentPlayer) => dispatch => {
  const newPlayer = {
    'player1': 'player2',
    'player2': 'player1'
  }
  dispatch(selectPlayer(newPlayer[currentPlayer]))
}
