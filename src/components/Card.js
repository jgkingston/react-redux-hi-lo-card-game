import React from "react";
import "../stylesheets/main.css";

// Card component
export default class Card extends React.Component {

  constructor(props) {
    super(props);
  }

  // render
  render() {
    const { image } = this.props;

    // render
    return (
      <div className='card'>
        <img src={ image } alt='foo'/>
      </div>
    );
  }
}
