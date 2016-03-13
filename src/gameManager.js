import _ from 'lodash';

/**
 * A manager of game state for the card game War.
 */
export default class GameManager {
  /**
   * Initialize the game manager and prepare the game state for play.
   * @constructor
   * @param {Array} players - The players participating.
   */
  constructor(players) {
    this._activePlayers = players;
    this._eliminatedPlayers = [];
    this._round = 0;
  }

  /**
   * Is this game complete?
   * NOTE: Does not distinguish between a game with a winner and
   * a tied game.
   * @returns {boolean}
   */
  get isGameComplete() {
    return this._activePlayers.length <= 1;
  }

  /**
   * Did the game finish in a tie?
   * @returns {boolean}
   */
  get isGameTied() {
    return this.isGameComplete && this._activePlayers.length < 1;
  }

  /**
   * Gets the winning {@link Player}.
   * @returns {Object} - The winning player if there is one; null otherwise.
   */
  get winner() {
    if (this.isGameComplete && !this.isGameTied)
      return this._activePlayers[0];

    return null;
  }

  /**
   * Gets the current round.
   * @returns {number} - The current round.
   */
  get round() {
    return this._round;
  }

  /**
   * Given a set of cards, find the winners.
   * @param {Array} - An arry of object tuples in the form of {player, card}.
   * @returns {Array} - An array containing the winning tuple. In the case of a tie,
   * multiple tuples are returned.
   */
  findWinner(cards) {
    let sortedCards = cards.sort((l, r) => {
      // the following looks weird, I know - but we want the *highest*
      // valued cards to appear at the beginning of the sorted list,
      // which means that we must sort a *higher value* to be *lower*.
      if (l.card.value > r.card.value) return -1;
      if (l.card.value < r.card.value) return 1;

      return 0;
    });

    return sortedCards.filter(t => t.card.value === sortedCards[0].card.value);
  }

  /**
   * Gathers cards from a list of players as preparation for a
   * game round. Finds players that should be eliminated, and
   * puts cards to be compared in the format required by {@link GameManager#findWinner}.
   * NOTE: this method follows "possibility 1" for the situation from
   * https://www.pagat.com/war/war.html for the situation where a player
   * runs out of cards while drawing cards for a war.
   * @private
   * @param {Array} players - A list of players that will participate
   * @param {number} numberOfCards - The number of cards required to particpate
   * @returns {Object} - An object tuple in the form of {comparedCards, playedCards, eliminatedPlayers}
   */
  gatherCardsForComparison(players, numberOfCards) {
    let playedCards = [];
    let comparedCards = [];
    let eliminatedPlayers = [];

    players.forEach(p => {
      if (!p.canTake(numberOfCards)) {
        // if the player can't give all the required cards,
        // they're eliminated from the game. take whatever
        // cards they have left and add them to the list of
        // cards played in the round.
        playedCards.push(...p.take(numberOfCards));
        eliminatedPlayers.push(p);
      }
      else {
        // the player has at least the required number of
        // cards left. take the cards and drop them into
        // the list of cards played this round. the last
        // drawn card is entered into the comparison against
        // the other players.
        let cards = p.take(numberOfCards);

        playedCards.push(...cards);
        comparedCards.push({ player: p, card: cards[cards.length - 1] });
      }
    });

    return {comparedCards, playedCards, eliminatedPlayers};
  }

  /**
  * Resolve a round of the game. Each player will draw cards and a winner will be
  * determined. In the case of a tie, a series of Wars will be resolved until
  * a winner is determined. In either case, once a winner is found, the winning
  * player receives all cards played in the round.
  * @param {Array} players - The participating players
  * @param {number} numberOfCards - The number of cards that will be played initially.
  * @param {boolean} awardCards - Whether or not cards should be awarded.
  * @returns {Object} - An object tuple in the form of {winner, playedCards, eliminatedPlayers}.
  */
  resolveRound(players, numberOfCards = 1, awardCards = true) {
    let winner = null;

    let {
      comparedCards,
      playedCards,
      eliminatedPlayers } = this.gatherCardsForComparison(players, numberOfCards);

    // everyone can be eliminated at once, so make sure we actually had
    // some cards to compare.
    if (comparedCards.length > 0) {
      let result = this.findWinner(comparedCards);

      if (result.length > 1) {
        // LET SLIP THE DOGS OF WAR
        // NOTE: we don't award cards until all wars have been resolved
        // additionally, according to https://www.pagat.com/war/war.html, ALL
        // players participate in the war if there's a tie, not just the people
        // who tied.
        let tieResult = this.resolveRound(players, 3, false);

        winner = tieResult.winner;
        playedCards.push(...tieResult.playedCards);
        eliminatedPlayers.push(...tieResult.eliminatedPlayers);

        // NOTE: the game manager object probably shouldn't be responsible for
        // displaying the results of individual comparisons, but if you really
        // want to see how wars are resolved, uncomment the following line.
        // console.log(`WAR! ${winner.name} won ${tieResult.playedCards.length} cards.`);
      }
      else {
        winner = result[0].player;
      }

      // remember, the war can also result in everyone being eliminated,
      // so don't award cards if there wasn't a winner. we also only
      // want to award cards if told to do so. in general, we only want
      // to award cards once the round is over and all of the possible
      // wars have been resolved.

      // NOTE: a single game of war can continue for a very long time, especially
      // if a particular player's cards are added to the bottom of the winner's
      // stack first consistently. according to http://mathoverflow.net/a/31185,
      // randomizing the order in which cards are added to the bottom of the stack
      // tends towards a finite game length, so follow that here.
      if (winner && awardCards)
        winner.give(_.shuffle(playedCards));
    }

    return {winner, playedCards, eliminatedPlayers};
  }

  /**
   * Play a round of war. This method keeps track of in-game state, and
   * moves players from the active to the eliminated list as they run out
   * of cards.
   * @returns {Object} - An object tuple of the form {round, winner, eliminatedPlayers}
   */
  playTurn() {
    let {winner, eliminatedPlayers} = this.resolveRound(this._activePlayers);

    eliminatedPlayers.forEach(p => {
      let index = this._activePlayers.findIndex(ap => ap.name === p.name);

      if (index > -1) {
        this._activePlayers.splice(index, 1);
        this._eliminatedPlayers.push(p);
      }
    });

    this._round = this._round + 1;

    return {round: this._round, winner, eliminatedPlayers};
  }

  *[Symbol.iterator]() {
    while (!this.isGameComplete)
      yield this.playTurn();
  }

  toString() {
    return this._activePlayers.map(p => p.toString()).join('\n');
  }
}
