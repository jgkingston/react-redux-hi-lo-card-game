
// The value, one of A (for an ace), 2, 3, 4, 5, 6, 7, 8, 9, 0 (for a ten), J (jack), Q (queen), or K (king);

const faceCardHash = {
  'JACK': 11,
  'QUEEN': 12,
  'KING': 13,
  'ACE': 14
}

export const mapCardValues = (value) =>  {
  return parseInt(faceCardHash[value] || value)
}
