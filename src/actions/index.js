import { mapCardValues } from '../utilities/mapCardValues'

export const REQUEST_DECK = 'REQUEST_DECK'
export const RECEIVE_DECK = 'RECEIVE_DECK'
export const RECEIVE_PILES = 'RECEIVE_PILES'
export const SHUFFLE_DECK = 'SHUFFLE_DECK'
export const SELECT_PLAYER = 'SELECT_PLAYER'
export const MAKE_GUESS = 'MAKE_GUESS'
export const INVALIDATE_GUESS = 'INVALIDATE_GUESS'
export const RECEIVE_DISCARD_PILE = 'RECEIVE_DISCARD_PILE'


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

export const drawCard = deck_id => dispatch => {
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

export const fetchDeckIfNeeded = () => (dispatch, getState) => {
  const { deck: { deck_id } } = getState();
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
  } else if (!lastCard.value) {
    return true
  } else {
    return false
  }
}

export const drawCardIfNeeded = () => (dispatch, getState) => {
  const { deck: { deck_id } } = getState();
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

const discard = (deck_id, cards, player, lastCard) => dispatch => {
  const lastCard = cards[0]
  const cardCodes = cards.map(card => {
    return card.code
  }).join(',')
  dispatch(requestDeck())
  return fetch(baseURI + deck_id +'/pile/discard/add/?cards=' + cardCodes)
    .then(response => response.json())
    .then(json => dispatch(receiveDiscardPile(json, player, lastCard)))
}

export const discardIfNeeded = () => (dispatch, getState) => {
  const { deck: { deck_id, cards }, selectedPlayer } = getState();
  console.log('SHOULD DISCARD', shouldDiscard(getState()))
  if (shouldDiscard(getState())) {
    console.log('DISCARD RECEIVE PROPS')
    return dispatch(discard(deck_id, cards, selectedPlayer))
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

const takeDiscardPile = (deck_id, cardsInPile, currentCard, selectedPlayer) => dispatch => {
  // This is a bit silly. I had anticipated having the ability to draw using a ?card_count parameter
  //  from a pile, but the API does not support that
  dispatch(requestDeck())
  return fetch(baseURI + deck_id +'/pile/discard/draw/?cards=' + cardsInPile.join(','))
    .then(response => response.json())
    .then(json => dispatch(addToPlayerPile(json, currentCard, selectedPlayer)))
}

export const recordResultIfReady = (deck, guess, selectedPlayer) => (dispatch, getState) => {
  const { deck: { deck_id, cards }, guess: { cardsInPile } } = getState()
  if (shouldRecordResult(getState())) {
    if (guessIsCorrect(getState())) {
      console.log('DISCARD AFTER GUESS')
      dispatch(discard(deck_id, cards, selectedPlayer))
    } else {
      const currentCard = cards[0]
      dispatch(takeDiscardPile(deck_id, cardsInPile, currentCard, selectedPlayer))
    }
  }
}

// https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=AS,2S
const addToPlayerPile = (deck, currentCard, player) => dispatch => {
  const { deck_id, cards } = deck
  cards.push(currentCard)
  const cardCodes = cards.map(card => {
    return card.code
  }).join(',')
  return fetch(baseURI + deck_id +'/pile/' + player + '/add/?cards=' + cardCodes)
    .then(response => response.json())
    .then(json => dispatch(receivePiles(json, player)))
}

export const passPlay = (currentPlayer) => dispatch => {
  const newPlayer = {
    'player1': 'player2',
    'player2': 'player1'
  }
  dispatch(selectPlayer(newPlayer[currentPlayer]))
}
