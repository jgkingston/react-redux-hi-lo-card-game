export const guess = (guessState = {
  hasGuessed: false,
  lastCard: {},
  cardsInPile: [],
  correctGuesses: 0
}, action) => {
  switch (action.type) {
    case 'RECEIVE_DISCARD_PILE':
      return {
        ...guessState,
        hasGuessed: false,
        cardsInPile: guessState.cardsInPile.concat([action.lastCard.code]),
        lastCard: action.lastCard,
        correctGuesses: action.deck.piles.discard.remaining - 1
      }
    case 'RECEIVE_PILES':
      return {
        ...guessState,
        hasGuessed: false,
        cardsInPile: [],
        lastCard: {},
        correctGuesses: 0
      }
    case 'MAKE_GUESS':
      return {
        ...guessState,
        hasGuessed: true,
        isHigher: action.nextCardIsHigher
      }
    case 'INVALIDATE_GUESS':
      return {
        ...guessState,
        hasGuessed: false,
        lastCard: {},
        cardsInPile: [],
        correctGuesses: 0
      }
    case 'SELECT_PLAYER':
      return {
        ...guessState,
        correctGuesses: 0
      }
    default:
      return guessState
  }
}
