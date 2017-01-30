import React, { Component, PropTypes } from "react";
import "../stylesheets/main.css";

// Card component
export default class Card extends Component {
  static propTypes = {
    image: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    suit: PropTypes.string.isRequired
  }
  // render
  render() {
    const { image, value, suit } = this.props;

    return (
      <div className='card'>
        <img src={ image } alt={`${value} of ${suit}`}/>
      </div>
    );
  }
}
