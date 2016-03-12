export default class Player {
    constructor(name, deck) {
      this._name = name;
      this._deck = deck;
    }

    get name() {
      return this._name;
    }

    take(numberOfCards = 1) {
      return this._deck.draw(numberOfCards);
    }

    give(cards) {
      return this._deck.add(cards);
    }

    canTake(numberOfCards) {
      return this._deck.count >= numberOfCards;
    }
}
