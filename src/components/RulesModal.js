import React, { Component, PropTypes } from "react";
import { Button, Modal } from 'react-bootstrap'
import "../stylesheets/main.css";

// RulesModal component
export default class RulesModal extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.state = { showModal: false }
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
  }

  close() {
    this.setState({ showModal: false })
  }

  open() {
    this.setState({ showModal: true })
  }

  // render
  render() {
    const { showModal } = this.state

    return (
      <div>
        <Button
          bsStyle="info"
          onClick={this.open}>
            Review ruleset
        </Button>
        <Modal show={showModal} onHide={this.close}>
         <Modal.Header closeButton>
           <Modal.Title>Hi-Lo: The Rules</Modal.Title>
         </Modal.Header>
         <Modal.Body>
          <p>Play consists of a dealer and a player.</p>
          <ul className="rule-list">
            <li>The dealer draws a card from the top of the deck and places it face up.</li>
            <li>The player must guess whether the next card drawn from the deck will be higher or lower than the face up card.</li>
            <li>Once the player guesses, the dealer draws the next card and places it face up on top of the previous card.</li>
            <li>If the player is correct, go back to step 2.</li>
            <li>If the player is wrong, the player receives a point for each card in the face up pile, and the face up pile is discarded. Then play begins at step 1 again.</li>
          </ul>
          <p>When the player has made three correct guesses in a row, s/he may make another guess, or choose to pass and the roles are reversed with the face up pile continuing to build. The player may choose to continue if there is a high likelihood that their next guess would be correct. If they are wrong, play starts over at step 1 and the player must again make three correct guesses before being allowed to pass. If they are correct, they can continue or pass.</p>
          <p>The goal is to end the game with as few points as possible.</p>
         </Modal.Body>
         <Modal.Footer>
           <Button onClick={this.close}>Got it</Button>
         </Modal.Footer>
       </Modal>
      </div>
    )
  }
}
