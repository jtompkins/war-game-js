export default class Card {
  static isValidSuit(suit) {
    const suitLower = suit.toLowerCase();

    return [...Card.SUITS.values()]
      .findIndex(s => s.toLowerCase() === suitLower) > -1;
  }

  static isValidFace(face) {
    const faceLower = face.toLowerCase();

    return [...Card.CARDS.values()]
      .map(c => c.face.toLowerCase())
      .findIndex(f => f === faceLower) > -1;
  }

  static isValidValue(value) {
    return [...Card.CARDS.values()]
      .map(c => c.value)
      .findIndex(v => v === value) > -1;
  }

  constructor(suit, {face, value}) {
    if (!Card.isValidSuit(suit) ||
      !Card.isValidFace(face) ||
      !Card.isValidValue(value))
      throw Error('Invalid arguments!');

    this._suit = suit;
    this._face = face;
    this._value = value;
  }

  get suit() {
    return this._suit;
  }

  get face() {
    return this._face;
  }

  get value() {
    return this._value;
  }

  toString() {
    return `${this.face} of ${this.suit}`;
  }
}

Card.SUITS = new Set([
  'club',
  'diamond',
  'heart',
  'spade'
]);

Card.CARDS = new Set([
  { face: '2', value: 2 },
  { face: '3', value: 3 },
  { face: '4', value: 4 },
  { face: '5', value: 5 },
  { face: '6', value: 6 },
  { face: '7', value: 7 },
  { face: '8', value: 8 },
  { face: '9', value: 9 },
  { face: '10', value: 10 },
  { face: 'J', value: 11 },
  { face: 'Q', value: 12 },
  { face: 'K', value: 13 },
  { face: 'A', value: 14 },
]);
