# war-game-js

A simple program for simulating the [card game War](https://www.pagat.com/war/war.html).

## Setup

Before running the program, you'll need NodeJS 5 installed. It's possible to run the program on earlier versions of Node, but the Babel configuration is set up to only transpile ES6 feature that aren't in Node 5.

1. Clone the repo.
2. `npm install`

## Running the Game

`npm start`

## Running the Tests

There are 34 Mocha/Should tests. Run them using NPM:

`npm test`

## System Design

The game of War is relatively simple, and our architecture reflects that. The system is built from four simple components, arranged in a linear dependency tree:

````
+--------+    +--------+    +----------+    +---------------+
|        |    |        |    |          |    |               |
|  Card  +---->  Deck  +---->  Player  +---->  GameManager  |
|        |    |        |    |          |    |               |
+--------+    +--------+    +----------+    +---------------+
````

Each component is implemented as an ES6 class. In practice, they're pretty unremarkable, but were a few interesting decisions to be made:

### What happens if you run out of cards during a War?

The [game rules](https://www.pagat.com/war/war.html) are ambigious with regards to what happens if a player runs out of cards during a war, and note a couple of possible options:

1. A player who runs out of cards is eliminated from the game
2. The player's last card is used as the "top" card for the war.

I went with option #1, mostly because it was easier to implement.

### Who gets to participate in a multi-player War?

According to the rules, in War games with three or more players, if a War occurs involving fewer than the total number of players in the game, *all* players participate in the war. That wasn't my recollection of how the game is played, but a) the spec says to do it that way and b) it definitely seems to make the games go faster.

### Man, these games take a long time!

Sometimes, unit tests just don't tell you everything. With all the code written and all tests passing, I settled in to test a full game, sticking with just two players. I told the game to start, and waited.

And waited.

And waited.

103,267 turns later, the game finally finished. I started the game again. I wish I could tell you how many turns it took to finish, but I don't know - I killed the process after 5 minutes.

The rules mention games can take a long time, but that didn't seem right. Googling "expected game length of war" told me that a surprising amount of research has been done on the game - including one critical point: there are many game states that are both stable and cyclical. These stable states seem to stem from a surprisingly boring place - the order of the cards when they're placed in the winning player's deck after a war.

My initial implementation was straightforward, placing the cards on the bottom of the deck in player order. Unfortunately, discussion on [this stack exchange question](http://mathoverflow.net/questions/11503/does-war-have-infinite-expected-length/) indicated that player-ordering the cards was one of the things that frequently led to the cyclic states. [One answer](http://mathoverflow.net/a/31185) cited research suggesting that randomizing the order of the cards as they entered the winning player's deck tended toward finite-length games, so that's what I do. Most games I tried now ended in 200-ish games, which is around the expected length predicted by simulation in [this article](http://www.esorensen.com/2009/10/26/the-science-of-war/).

### What's a `*[Symbol.iterator]`?

The `GameManager` class maintains game state - the active players, round number, etc. `GameManager` can happily execute a game turn, but I wanted a way to easily drive the game from outside `GameManager` while still being able to report the progress of the game.

What I decided to do was use a new ES6 feature and make the `GameManager` [iterable](http://www.2ality.com/2015/02/es6-iteration.html), allowing it to be run to completion using the new `for-of` loop and yielding an object to report the current game state each turn.

Implementing an iterator is simple:

````
*[Symbol.iterator]() {
  while (!this.isGameComplete)
    yield this.playTurn();
}
````

...and actually running the game is as easy as looping over the `GameManager` instance:

````
const manager = new GameManager(...);

for (const round of manager) {
  // report round results here!
}
````

This is cutting-edge in the JavaScript world, but anyone used to Ruby's blocks is probably pretty unimpressed right now.