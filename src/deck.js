import Card from './card';
import _ from 'lodash';

export default class Deck {
  static standardDeck() {
    let cards = [];

    for (let suit of Card.SUITS.keys()) {
      for (let card of Card.CARDS) {
        cards.push(new Card(suit, card));
      }
    }

    return new Deck(cards);
  }

  constructor(cards) {
    this._cards = cards;
  }

  split(numberOfWays) {

  }

  shuffle() {
    this._cards = _.shuffle(this._cards);
  }

  get cards() {
    return this._cards;
  }

  get count() {
    return this._cards.length;
  }
}
