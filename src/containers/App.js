import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { passPlay, fetchDeckIfNeeded, drawCard, drawCardIfNeeded, discardIfNeeded, shuffleDeck, makeGuess, invalidateGuess, resetScores, recordResultIfReady } from '../actions'
import CardPiles from '../components/CardPiles'
import ScoreBoard from '../components/ScoreBoard'
import { Actions as GameActions } from '../components/Actions'
import "../stylesheets/main.scss";

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.handleFlipClick = this.handleFlipClick.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handlePassClick = this.handlePassClick.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchDeckIfNeeded())
    this.flipCardSound = new Audio('flip-card.mp3');
    this.shuffleSound = new Audio('shuffling-cards-1.mp3');
    this.shuffleSound.play();
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, deck, guess, selectedPlayer } = nextProps
    setTimeout(() => {
      dispatch(discardIfNeeded(deck.deck_id))
      dispatch(recordResultIfReady(deck, guess, selectedPlayer))
      dispatch(drawCardIfNeeded(deck.deck_id))
    }, 800)
  }

  handleRefreshClick = e => {
    e.preventDefault()
    const { dispatch } = this.props
    this.shuffleSound.play();
    dispatch(shuffleDeck())
    dispatch(invalidateGuess())
    dispatch(resetScores())
    dispatch(fetchDeckIfNeeded())
  }

  handleFlipClick = (nextCardIsHigher) => {
    const { dispatch, deck: { deck_id }, selectedPlayer } = this.props
    this.flipCardSound.play();
    dispatch(makeGuess(nextCardIsHigher, selectedPlayer))
    dispatch(drawCard(deck_id))
  }

  handlePassClick = e => {
    e.preventDefault()
    const { dispatch, selectedPlayer } = this.props
    dispatch(passPlay(selectedPlayer))
  }



  render() {
    const {
      deck: { deck_id, cards, remaining, readyForGuess },
      guess: { lastCard, cardsInPile, correctGuesses },
      scoreByPlayer,
      selectedPlayer,
      players,
      errors } = this.props
    const gameOver = remaining === 0

    return (
        <div className="card-table">
          { gameOver &&
            <div className="pyro">
              <div className="before"></div>
              <div className="after"></div>
            </div>
          }
          <ScoreBoard
            gameOver={gameOver}
            scoreByPlayer={scoreByPlayer}
            selectedPlayer={selectedPlayer}
            players={players}
            correctGuesses={correctGuesses}/>
          <div className="play-area">
            <CardPiles
              cards={cards}
              remaining={remaining}
              cardsInPile={cardsInPile}
              lastCard={lastCard}/>
            { errors.message &&
              <div className="error-message-container">
                <h4 className="text-danger">{errors.response.status} Error: {errors.message}</h4>
              </div>
            }
            {deck_id &&
              <GameActions
                gameOver={gameOver}
                readyForGuess={readyForGuess}
                remaining={remaining}
                correctGuesses={correctGuesses}
                onFlipClick={this.handleFlipClick}
                onPassClick={this.handlePassClick}
                onRefreshClick={this.handleRefreshClick}/>
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
    scoreByPlayer: state.scoreByPlayer,
    players: state.players,
    errors: state.errors
  }
}

export default connect(mapStateToProps)(App)
