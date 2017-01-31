import React, { Component, PropTypes } from "react";
import RulesModal from './RulesModal'
import { Button } from 'react-bootstrap'
import "../stylesheets/main.scss";

// Actions component
export class Actions extends Component {
  static propTypes = {
    gameOver: PropTypes.bool,
    correctGuesses: PropTypes.number,
    onFlipClick: PropTypes.func,
    onRefreshClick: PropTypes.func,
    onPassClick: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = { disabled: false }
    this.handleFlipClick = this.handleFlipClick.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.readyForGuess !== nextProps.readyForGuess) {
      return true
    }
    if (this.props.correctGuesses !== nextState.correctGuesses) {
      return true
    }
    return false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.readyForGuess) {
      this.setState({disabled: false})
    }
  }

  handleFlipClick(e, nextCardIsHigher) {
    e.preventDefault()
    this.setState({disabled: true})
    this.props.onFlipClick(nextCardIsHigher)
  }

  // render
  render() {
    const { gameOver, correctGuesses, onPassClick, onRefreshClick } = this.props
    const guessNeededToPass = 3 - correctGuesses

    return (
      <div>
        <div className="actions-row">
          <Button
            bsStyle="danger"
            bsSize="large"
            onClick={(e) => this.handleFlipClick(e, true)}
            disabled={gameOver || this.state.disabled}>
              Higher
          </Button>
          <Button
            bsStyle="primary"
            bsSize="large"
            onClick={(e) => this.handleFlipClick(e, false)}
            disabled={gameOver || this.state.disabled}>
              Lower
          </Button>
        </div>
        <div className="actions-row">
          <Button
            bsStyle="success"
            onClick={onPassClick}
            disabled={correctGuesses < 3 || gameOver}>
              Pass{ guessNeededToPass > 0 && ` (${3 - correctGuesses})`}
          </Button>
          <Button
            bsStyle="warning"
            onClick={onRefreshClick}>
              { gameOver ? 'Play again?' : 'Reset Deck' }
          </Button>
          <RulesModal/>
        </div>
      </div>
    );
  }
}
