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
          comparedCards.push({ player: p, card: cards[numberOfCards - 1] });
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
    * @returns {Object} - An object tuple in the form of {winner, playedCards, eliminatedPlayers}.
    */
    resolveRound(players, numberOfCards = 1) {
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
          let tieResult = this.resolveRound(result.map(t => t.player), 3);

          winner = tieResult.winner;
          playedCards.push(...tieResult.playedCards);
          eliminatedPlayers.push(...tieResult.eliminatedPlayers);
        }
        else {
          winner = result[0].player;
        }

        // remember, the war can also result in everyone being eliminated
        if (winner)
          winner.give(playedCards);
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
}
