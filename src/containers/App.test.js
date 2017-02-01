import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import ConnectedApp, { App } from './App';

const defaultProps = {
  deck: {
    deck_id: 'foo',
    cards: []
  },
  guess: {
    lastCard: {}
  },
  errors: {},
  players: [{name:'player1'},{name:'player2'}],
  scoreByPlayer: {
    player1: {},
    player2: {}
  },
  selectedPlayer: 'bar'
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  shallow(<App {...defaultProps}/>, div);
});
