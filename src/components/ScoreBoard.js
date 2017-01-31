
import React, { Component, PropTypes } from "react";
import "../stylesheets/main.css";

// ScoreBoard component
export default class ScoreBoard extends Component {
  static propTypes = {
    remaining: PropTypes.number,
    players: PropTypes.array,
    scoreByPlayer: PropTypes.object,
    selectedPlayer: PropTypes.string.isRequired,
    correctGuesses: PropTypes.number
  }

  // render
  render() {
    const { players, scoreByPlayer, correctGuesses, remaining, selectedPlayer } = this.props;
    const activePlayerTitle = players[selectedPlayer] && players[selectedPlayer].title || 'Player 1'

    return (
      <div className="score-board">
        <div className="tracker player-tracker">
          {
            players.map((player, index) => {
              const isActive = player.name === selectedPlayer
              const activeStyle = isActive ? ' player-active' : ''
              const points = scoreByPlayer[player.name] ? scoreByPlayer[player.name].points : 0
              return (
                <div className={`player${activeStyle}`}  key={index}>
                  <span className="player-score"  title={`${player.title} has ${points} points`}>
                    {player.title}: {points}
                  </span>
                </div>
              )
            })
          }
        </div>
        <div className="tracker guess-tracker">
          <span className="guess-status"  title={`${correctGuesses} of 3 cosecutive correct guesses needed to pass`}>
            { correctGuesses > 0 && `${correctGuesses} Correct!` }
          </span>
        </div>
      </div>
    );
  }
}
