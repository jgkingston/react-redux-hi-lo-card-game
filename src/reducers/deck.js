
export const deck = (deckState = {
  isFetching: false,
  shouldShuffle: false
}, action) => {
  switch (action.type) {
    case 'SHUFFLE_DECK':
      return {
        ...deckState,
        shouldShuffle: true
      }
    case 'REQUEST_DECK':
      return {
        ...deckState,
        isFetching: true,
        shouldShuffle: false
      }
    case 'RECEIVE_PILES':
    case 'RECEIVE_DISCARD_PILE':
    case 'RECEIVE_DECK':
      return {
        isFetching: false,
        shouldShuffle: false,
        lastUpdated: action.receivedAt,
        ...action.deck
      }
    default:
      return deckState
  }
}
