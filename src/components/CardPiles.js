import React, { Component, PropTypes } from "react";
import Card from '../components/Card'
import "../stylesheets/main.css";

// CardPiles component
export default class CardPiles extends Component {
  static propTypes = {
    cards: PropTypes.array,
    cardsInPile: PropTypes.array,
    lastCard: PropTypes.object.isRequired,
    remaining: PropTypes.number
  }

  static defaultProps = {
    cardsInPile: []
  }
  
  // render
  render() {
    const { cards, cardsInPile, lastCard, remaining } = this.props

    return (
      <div className="card-piles">
        <label>
          Cards in pile: {cardsInPile.length}
          <div title="Discard pile" className="discard-pile">
            { lastCard.image ?
              <Card {...lastCard}/>
              : 'Discard Pile'
            }
          </div>
        </label>
        <label>
          Cards remaining: {remaining}
          <div title="Draw pile"  className="draw-pile">
            { cards && lastCard.image ?
              <Card {...cards[0]}/>
              : ( remaining > 0 ? <div className="card"><img src='card-back.png' alt="card back"/></div>
              : 'Draw Pile' )
            }
          </div>
        </label>
      </div>
    );
  }
}
