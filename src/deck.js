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

  draw(numberOfCards = 1) {
    return this._cards.splice(0, numberOfCards);
  }

  add(cards) {
    this._cards.push(...cards);
  }

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
