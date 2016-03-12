import Should from 'should';
import Deck from '../src/deck';

describe('Deck', () => {
  describe('creating Decks', () => {
    it('should be able to create a standard deck', () => {
      const deck = Deck.standardDeck();
      
      deck.count.should.equal(52);
    });
  })
});