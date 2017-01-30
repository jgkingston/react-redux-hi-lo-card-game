
import React, { Component, PropTypes } from "react";
import "../stylesheets/main.css";

// ScoreBoard component
export default class ScoreBoard extends Component {
  static propTypes = {
    cardsRemaining: PropTypes.number,
    players: PropTypes.array
  }

  // render
  render() {
    const { players, scoreByPlayer, correctGuesses, selectedPlayer } = this.props;

    return (
      <div className="score-board">
        <div className="tracker player-tracker">
          {
            players.map((player, index) => {
              const isActive = player.name === selectedPlayer
              const activeStyle = isActive ? ' text-success' : ''
              const points = scoreByPlayer[player.name] ? scoreByPlayer[player.name].points : 0
              return (
                <div className={`player${activeStyle}`}  key={index}>
                  <h2 title={`${player.title} has ${points} points`}>
                    {isActive ? '*' : ''}{player.title}: {points}{isActive ? '*' : ''}
                  </h2>
                </div>
              )
            })
          }
        </div>
        <div className="tracker guess-tracker">
          <h4 className="guess-status"  title={`${correctGuesses} of 3 cosecutive correct guesses needed to pass`}>
            { correctGuesses - 2 > 0 ? 'Pass (when ready)' : `${correctGuesses} / 3` }
          </h4>
        </div>
      </div>
    );
  }
}
