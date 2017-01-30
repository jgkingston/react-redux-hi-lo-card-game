import React, { Component, PropTypes } from "react";
import { Button } from 'react-bootstrap'
import "../stylesheets/main.css";

// Actions component
export class Actions extends Component {
  static propTypes = {
    remaining: PropTypes.number,
    correctGuesses: PropTypes.number,
    onFlipClick: PropTypes.func,
    onRefreshClick: PropTypes.func,
    onPassClick: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = { disabled: false };
  }

  componentWillReceiveProps(nextProps) {
    const { readyForGuess} = nextProps
    setTimeout(() => {
      if (readyForGuess) {
        this.setState({disabled: false})
      }
    }, 1000);
  }

  handleFlipClick(e, nextCardIsHigher) {
    e.preventDefault()
    this.setState({disabled: true})
    this.props.onFlipClick(nextCardIsHigher)
  }

  // render
  render() {
    const { remaining, correctGuesses, onPassClick, onRefreshClick } = this.props

    return (
      <div className="actions-row">
        <Button
          bsStyle="primary"
          onClick={(e) => this.handleFlipClick(e, true)}
          disabled={!(remaining > 0) || this.state.disabled }>
            Higher
        </Button>
        <Button
          bsStyle="primary"
          onClick={(e) => this.handleFlipClick(e, false)}
          disabled={!(remaining > 0)  || this.state.disabled }>
            Lower
        </Button>
        <Button
          bsStyle="success"
          onClick={onPassClick}
          disabled={correctGuesses < 3 || !(remaining > 0)}>
            Pass
        </Button>
        <Button
          bsStyle="warning"
          onClick={onRefreshClick}>
            Reset Deck
        </Button>
      </div>
    );
  }
}
