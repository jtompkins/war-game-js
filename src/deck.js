import Card from './card';
import _ from 'lodash';

/**
 * Class representing a deck of cards.
 * NOTE: This class represents a group of cards for use by a player.
 * It doesn't necessarily contain a complete, 52-card deck of cards - in
 * fact, it probably usually won't.
 */
export default class Deck {
  /**
   * A helper method that returns an unshuffled standard 52-card deck.
   * @returns {Deck}
   */
  static standardDeck() {
    let cards = [];

    for (let suit of Card.SUITS.keys()) {
      for (let card of Card.CARDS) {
        cards.push(new Card(suit, card));
      }
    }

    return new Deck(cards);
  }

  /**
   * @constructor
   * @param {array} - An array of {@link Card} objects.
   */
  constructor(cards) {
    this._cards = cards;
  }

  /**
   * Draw a variable number of {@link Card}s from the deck.
   * The cards are drawn from the top of the deck.
   * @param {number} - The number of cards to draw. Defaults to 1 card.
   */
  draw(numberOfCards = 1) {
    return this._cards.splice(0, numberOfCards);
  }

  /**
   * Add an array of cards to the deck.
   * The cards are added to the bottom of the deck.
   * @param {Array} - An array of {@link Card} objects.
   */
  add(cards) {
    this._cards.push(...cards);
  }

  /**
   * Split the deck into a number of smaller decks.
   * Cards are "dealt" to the new decks in order until this
   * deck is empty. This may result in decks with an uneven
   * number of cards.
   * @param {number} - The number of decks to split this deck into.
   * @returns {Array} - An array of {@link Deck} objects.
   */
  split(numberOfWays) {
    let decks = [];
    let i = 0;

    while(this.count > 0) {
      if (!decks[i])
        decks[i] = new Deck([]);

      decks[i].add(this.draw());

      i = i + 1;

      if (i >= numberOfWays)
        i = 0;
    }

    return decks;
  }

  /**
   * Shuffle the deck in place.
   * NOTE: Shuffling an array is harder than you might think.
   * This method uses lodash's shuffle method, which (as of this writing)
   * implements a Fisher-Yates shuffle. See https://bost.ocks.org/mike/shuffle/
   * for (lots) more information.
   */
  shuffle() {
    this._cards = _.shuffle(this._cards);
  }

  /**
   * Get the number of cards remaining in the deck.
   * @returns {number}
   */
  get count() {
    return this._cards.length;
  }
}
