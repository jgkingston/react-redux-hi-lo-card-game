import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { passPlay, fetchDeckIfNeeded, drawCard, drawCardIfNeeded, discardIfNeeded, flipNextCard, shuffleDeck, makeGuess, invalidateGuess, recordResultIfReady } from '../actions'
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
    const { dispatch, deck, guess, selectedPlayer } = nextProps
    setTimeout(() => {
      dispatch(discardIfNeeded(deck.deck_id))
      dispatch(recordResultIfReady(deck, guess, selectedPlayer))
    }, 1000);
    dispatch(drawCardIfNeeded(deck.deck_id))
  }

  handleRefreshClick = e => {
    e.preventDefault()
    const { dispatch, deck: { deck_id } } = this.props
    dispatch(shuffleDeck())
    dispatch(invalidateGuess())
    dispatch(fetchDeckIfNeeded())
  }

  handleFlipClick = (e, nextCardIsHigher) => {
    e.preventDefault()
    const { dispatch, deck: { deck_id, cards }, selectedPlayer } = this.props
    dispatch(makeGuess(nextCardIsHigher, selectedPlayer))
    dispatch(drawCard(deck_id))
  }

  handlePass = e => {
    e.preventDefault()
    const { dispatch, selectedPlayer } = this.props
    dispatch(passPlay(selectedPlayer))
  }

  render() {
    const {
      deck: { deck_id, cards, isFetching, remaining },
      guess: { hasGuessed, isHigher, lastCard, cardsInPile, correctGuesses },
      scoreByPlayer,
      selectedPlayer,
      players } = this.props

    return (
        <div className="card-table">
          <div className="score-board">
            <h4>Active player: {selectedPlayer}</h4>
            {
              players.map((player, index) => {
                return <h4>{player.name} score: {scoreByPlayer[player.name] ? scoreByPlayer[player.name].points : 0}</h4>
              })
            }
            { hasGuessed && (
              isHigher ? <h4>Guessed: Higher</h4>
              : <h4>Guessed: Lower</h4>
            )}
            <h4>Player has guessed: {hasGuessed ? 'Yes' : 'No'}</h4>
            <h4>Correct Guesses {correctGuesses}</h4>
            <h4>Cards remaing: {remaining}</h4>
            <h4>Cards in pile: {cardsInPile.join(', ')}</h4>
          </div>
          <div className="play-area">
          <div className="hand">
            { lastCard.image ?
              <Card image={lastCard.image}/>
              : <div className="draw-pile">Discard Pile</div>
            }
            { cards ?
              <Card image={cards[0].image}/>
              : <div className="discard-pile">Draw Pile</div>
            }
          </div>
          {remaining > 0 &&
            <div className="actions-row">
              <button
                 onClick={(e) => this.handleFlipClick(e, true)}>
                High
              </button>
              <button
                 onClick={(e) => this.handleFlipClick(e, false)}>
                Low
              </button>
              <button
                onClick={this.handlePass}
                disabled={correctGuesses < 3}>
                Pass
              </button>
            </div>
          }
          <div>
            {deck_id &&
              <button
                 onClick={this.handleRefreshClick}>
                Shuffle Deck
              </button>
            }
          </div>
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
    scoreByPlayer: state.scoreByPlayer,
    players: state.players
  }
}

export default connect(mapStateToProps)(App)
