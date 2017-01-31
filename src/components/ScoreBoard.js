
import React, { Component, PropTypes } from "react";
import "../stylesheets/main.scss";

// ScoreBoard component
export default class ScoreBoard extends Component {
  static propTypes = {
    gameOver: PropTypes.bool,
    players: PropTypes.array,
    scoreByPlayer: PropTypes.object,
    selectedPlayer: PropTypes.string.isRequired,
    correctGuesses: PropTypes.number
  }

  determineWinner = (scoreByPlayer, players) => {
    const player1Points = scoreByPlayer[players[0].name].points
    const player2Points = scoreByPlayer[players[1].name].points
    if ( player1Points < player2Points ) {
      return players[0].title + ' wins!'
    } else if ( player1Points > player2Points ) {
      return players[1].title + ' wins!'
    } else {
      return "It's a tie!"
    }
  }

  // render
  render() {
    const { gameOver, players, scoreByPlayer, correctGuesses, selectedPlayer } = this.props;
    const gameOverMessage = this.determineWinner(scoreByPlayer, players)

    return (
      <div className="score-board">
        <div className="tracker player-tracker">
          {
            players.map((player, index) => {
              const isActive = player.name === selectedPlayer
              const activeStyle = isActive ? ' player-active' : ''
              const points = scoreByPlayer[player.name] ? scoreByPlayer[player.name].points : 0
              const titleMessage = player.title + (isActive ? ' is active and' : '') + ' has ' + points + ' points'
              return (
                <div className={`player${activeStyle}`} key={index}>
                  <span className="player-score"  title={titleMessage}>
                    {player.title}: {points}
                  </span>
                </div>
              )
            })
          }
        </div>
        <div className="tracker guess-tracker">
          <span className="guess-status"  title={`${correctGuesses} of 3 consecutive correct guesses needed to pass`}>
            { gameOver && <h2>{gameOverMessage}</h2> }
            { correctGuesses > 0 && !gameOver && `${correctGuesses} Correct!` }
          </span>
        </div>
      </div>
    );
  }
}
