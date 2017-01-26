import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchDeckIfNeeded, drawCardIfNeeded, flipNextCard, shuffleDeck, makeGuess, invalidateGuess } from '../actions'
import Card from '../components/Card'
import { mapCardValues } from '../utilities/mapCardValues'
import "../stylesheets/main.css";

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchDeckIfNeeded())
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, deck: { deck_id, cards }, guess: { hasGuessed, isHigher, lastCard } } = nextProps
    dispatch(drawCardIfNeeded(deck_id))
    if ( hasGuessed && cards && lastCard.value !== cards[0].value ) {
      const currentCardValue = cards && mapCardValues(cards[0].value)
      const lastCardValue = mapCardValues(lastCard.value)
      isHigher ? console.log(currentCardValue, '>', lastCardValue) : console.log(currentCardValue, '<', lastCardValue)
    }
  }

  handleRefreshClick = e => {
    e.preventDefault()

    const { dispatch, deck: { deck_id } } = this.props
    dispatch(shuffleDeck())
    dispatch(invalidateGuess())
    dispatch(fetchDeckIfNeeded(deck_id))
  }

  handleFlipClick = (e, nextCardIsHigher) => {
    e.preventDefault()

    const { dispatch, deck: { deck_id, cards }, selectedPlayer } = this.props
    dispatch(makeGuess(nextCardIsHigher, cards[0], selectedPlayer))
    dispatch(flipNextCard('discard', deck_id, selectedPlayer))
  }

  render() {
    const { deck: { deck_id, cards, isFetching }, guess: { hasGuessed, isHigher, lastCard } } = this.props
    const currentCardValue = cards && mapCardValues(cards[0].value)
    const lastCardValue = mapCardValues(lastCard.value)

    return (
        <div className="card-table">
          { hasGuessed && (
            isHigher ? <h2>Guessed: Higher</h2>
            : <h2>Guessed: Lower</h2>
          )}
          { (lastCard.value && !isFetching) && (
            isHigher ? (currentCardValue > lastCardValue ? <h2>Correct!</h2>
            : <h2>Wrong</h2>) : (currentCardValue < lastCardValue ? <h2>Correct!</h2>
            : <h2>Wrong</h2>)
          )}
          { isFetching ? <h2>Loading...</h2>
            : <div className="hand">
                { lastCard.image &&
                  <Card image={lastCard.image}/>
                }
                { cards && cards.map((card, index) => {
                  return <Card image={card.image} key={index}/>;
                }) }
              </div>
          }
          <div className="actions-row">
            {deck_id &&
              <button
                 onClick={this.handleRefreshClick}>
                Shuffle Deck
              </button>
            }
            {cards &&
              <button
                 onClick={(e) => this.handleFlipClick(e, true)}>
                High
              </button>
            }
            {cards &&
              <button
                 onClick={(e) => this.handleFlipClick(e, false)}>
                Low
              </button>
            }
          </div>
        </div>

    )
  }
}

const mapStateToProps = state => {
  return {
    deck: state.deck,
    selectedPlayer: state.selectedPlayer,
    guess: state.guess,
    players: state.players
  }
}

export default connect(mapStateToProps)(App)
