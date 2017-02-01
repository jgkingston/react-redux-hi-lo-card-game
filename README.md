This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Overview

### The Game

This is a two-player, hot-seat card game where players take turns guessing whether the next flipped card will be higher or lower than the last. If the guessing player is incorrect they take the newly flipped card and all the cards that have accumulated in the discard pile. Each card is a point and the object is to end the game with the fewest points. If a player is able to make three correct guesses in a row they have the option to pass play to their opponent. Instead of passing a player may choose to continue guessing so as not to provide their opponent with a easy guess. However the active player only retains the ability to pass as long as they keep guessing correctly. If they guess incorrectly at any point the correct guess counter resets to zero.

### The App

This was built using React and Redux and leverages the API provided by http://deckofcardsapi.com/. As much as possible I wanted to keep this a 'stateless' application in the sense that the UI should only be responsible for displaying information that is returned from the API. However certain limitations of the API, which is a very fun resource, meant that it was necessary to track certain bits of information client-side. Tests are written with enzyme, expect, fetch-mock and redux-mock-store.

## Instructions for Local development

```sh
$ git clone https://github.com/jgkingston/react-redux-hi-lo-card-game.git react-hi-lo
$ cd react-hi-lo
$ npm install
$ npm start

```

If you have any issues check to make sure you are running Node ~5.1 and Npm ~3.3
