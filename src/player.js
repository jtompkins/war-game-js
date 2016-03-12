/**
 * A class representing a player in the card game.
 */
export default class Player {
    /**
     * @constructor
     * @param {string} name - The name of the player.
     * @param {Array} deck - A {@link Deck} of {@link Card}s.
     */
    constructor(name, deck) {
      this._name = name;
      this._deck = deck;
    }

    /**
     * Gets the player's name.
     * @returns {string}
     */
    get name() {
      return this._name;
    }

    /**
     * Takes a number of cards from the player.
     * NOTE: while we "know" this taking cards from the player's
     * deck, there's no reason for consumers of the Player class
     * to care about how the Player is storing its cards.
     * @param {number} numberOfCards - The number of {@link Card}s to take.
     * @returns {Array} - An array of {@link Card}s.
     */
    take(numberOfCards = 1) {
      return this._deck.draw(numberOfCards);
    }

    /**
     * Gives a number of cards to the player.
     * @param {Array} cards - An array of {@link Card}s.
     */
    give(cards) {
      return this._deck.add(cards);
    }

    /**
     * Check to see if a number of cards can be taken from the player.
     * @param {number} numberOfCards - The number of {@link Card}s to take.
     * @returns {boolean}
     */
    canTake(numberOfCards) {
      return this._deck.count >= numberOfCards;
    }
}
