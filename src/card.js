/** Class representing a standard playing card. */
export default class Card {
  /**
   * Checks to see if the given suit is one of the allowed values.
   * @param {string} suit - A standard playing card suit.
   * @returns {boolean}
   */
  static isValidSuit(suit) {
    const suitLower = suit.toLowerCase();

    return [...Card.SUITS.values()]
      .findIndex(s => s.toLowerCase() === suitLower) > -1;
  }

  /**
   * Checks to see if the given face is one of the allowed values.
   * @param {string} face - A standard playing card face (2-A).
   * @returns {boolean}
   */
  static isValidFace(face) {
    const faceLower = face.toLowerCase();

    return [...Card.CARDS.values()]
      .findIndex(c => c.face.toLowerCase() === faceLower) > -1;
  }

  /**
   * Checks to see if the given converted numeric value is one of the allowed values.
   * @param {number} value - The converted numeric value of a standard playing card.
   * @returns {boolean}
   */
  static isValidValue(value) {
    return [...Card.CARDS.values()]
      .findIndex(c => c.value === value) > -1;
  }

  /**
   * @constructor
   * @param {string} suit - A playing card suit
   * @param {string} face - A playing card face. Should be wrapped in a JS object.
   * @param {number} value - A playing card numeric value. Should be wrapped in a JS object.
   */
  constructor(suit, {face, value}) {
    if (!Card.isValidSuit(suit) ||
      !Card.isValidFace(face) ||
      !Card.isValidValue(value))
      throw Error('Invalid card values.');

    this._suit = suit;
    this._face = face;
    this._value = value;
  }

  /**
   * Gets the card's suit.
   * @public
   * @returns {string}
   */
  get suit() {
    return this._suit;
  }

  /**
   * Gets the card's face.
   * @public
   * @returns {string}
   */
  get face() {
    return this._face;
  }

  /**
   * Gets the card's converted numeric value.
   * @public
   * @returns {number}
   */
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
