import Should from 'should';
import Deck from '../src/deck';

describe('Deck', () => {
  describe('creating Decks', () => {
    it('should be able to create a standard deck', () => {
      const deck = Deck.standardDeck();

      deck.count.should.equal(52);
    });
  });

  describe('drawing and adding cards', () => {
    it('should allow cards to be taken off of the top of the deck', () => {
      const deck = Deck.standardDeck();

      deck.count.should.equal(52);

      let cards = deck.draw();

      cards.length.should.equal(1);
      deck.count.should.equal(51);

      cards = deck.draw(3);

      cards.length.should.equal(3);
      deck.count.should.equal(48);
    });

    it('should allow cards to be added to the bottom of the deck', () => {
      const deck = Deck.standardDeck();

      let cards = deck.draw();

      deck.count.should.equal(51);

      deck.add(cards);

      deck.count.should.equal(52);

      // reaching into the private array here for the test,
      // which is probably not the best practice.
      deck._cards[51].suit.should.equal(cards[0].suit);
      deck._cards[51].face.should.equal(cards[0].face);
    });
  });

  describe('splitting the deck', () => {
    it('should split the deck evenly for two players', () => {
      const deck = Deck.standardDeck();

      let newDecks = deck.split(2);

      newDecks.length.should.equal(2);

      newDecks.forEach(d => d.count.should.equal(26));
    });

    it('should handle splitting the deck for three players', () => {
      const deck = Deck.standardDeck();

      let newDecks = deck.split(3);

      newDecks.length.should.equal(3);

      newDecks[0].count.should.equal(18);
      newDecks[1].count.should.equal(17);
      newDecks[2].count.should.equal(17);
    });
  });
});
