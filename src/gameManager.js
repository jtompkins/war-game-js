import Deck from './deck';
import Player from './player';

/**
 * A manager of game state for the card game War.
 */
export default class GameManager {
    /**
     * Initialize the game manager and prepare the game state for play.
     * Creates the starting deck and splits it between the participating
     * {@link Player} objects (which are also created).
     * @constructor
     * @param {number} numberOfPlayers - The number of players participating.
     */
    constructor(numberOfPlayers = 2) {
      this._activePlayers = [];
      this._eliminatedPlayers = [];
      this._round = 1;

      const startingDeck = Deck.standardDeck();

      startingDeck.shuffle();

      this._activePlayers = startingDeck
        .split(numberOfPlayers)
        .map((deck, index) => new Player(`player${index}`, deck));
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
      return this.isGameComplete() && this._activePlayers.length < 1;
    }

    /**
     * Given a set of cards, find the winners.
     * @param {Array} - An array of tuples in the form of [{@link Player}, {@link Card}].
     * @returns {Array} - An array containing the winning tuple. In the case of a tie,
     * multiple tuples are returned.
     */
    findWinner(cards) {

    }

    /**
    * Resolve a round of the game. Each player will draw cards and a winner will be
    * determined. In the case of a tie, a series of Wars will be resolved until
    * a winner is determined. In either case, once a winner is found, the winning
    * player receives all cards played in the round.
    * @returns {Array} - An array tuple in the form of [winner, eliminated players].
    */
    resolveRound() {

    }

    /**
     * Recursively resolves wars between a list of players until a winner is determined.
     * NOTE: This method does NOT reward cards; that function is delegated to the caller.
     * @param {Array} players - The {@link Player}s participating in the war.
     * @returns {Array} - An array tuple in the form of [winner, eliminated players, cards played].
     */
    resolveWar(players) {

    }
}
