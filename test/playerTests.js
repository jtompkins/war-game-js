import Should from 'should';
import Player from '../src/player';
import Deck from '../src/Deck';
import Card from '../src/Card';

describe('Player', () => {
  describe('creating a player', () => {
    it('should construct a well-formed player', () => {
      const player = new Player('player1', new Deck([]));

      player.name.should.equal('player1');
      player.canTake(1).should.be.false();
    });

    it('should allow for the bulk creation of players', () => {
      const deck = Deck.standardDeck();
      let players = Player.createPlayers(deck, 2);

      players.length.should.equal(2);
    });
  });

  describe('taking and giving cards', () => {
    it('should allow a card to be taken', () => {
      const card = new Card('club', { face: 'K', value: 14 });
      const deck = new Deck([card]);
      const player = new Player('player1', deck);

      player.canTake(1).should.be.true();

      let takenCards = player.take();

      takenCards.length.should.equal(1);
      player.canTake(1).should.be.false();
    });

    it('should allow a card to be given', () => {
      const card = new Card('club', { face: 'K', value: 14 });
      const card2 = new Card('heart', { face: 'Q', value: 13 });

      const deck = new Deck([card]);
      const player = new Player('player1', deck);

      player.give([card2]);

      player.canTake(2).should.be.true();
    });
  });
});
