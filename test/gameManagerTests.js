import Should from 'should';
import Card from '../src/card';
import Deck from '../src/deck';
import Player from '../src/player';
import GameManager from '../src/gameManager';

describe('GameManager', () => {
  describe('Gathering cards for comparison', () => {
    let manager = new GameManager([]);

    it('gathers the right number of cards', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
      ]));

      let player2 = new Player('player2', new Deck([
        new Card('heart', { face: 'Q', value: 12 }),
      ]));

      let result = manager.gatherCardsForComparison([player1, player2], 1);

      result.playedCards.length.should.equal(2);
    });

    it('eliminates a player without enough cards', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
      ]));

      let player2 = new Player('player2', new Deck([]));

      let result = manager.gatherCardsForComparison([player1, player2], 1);

      result.eliminatedPlayers.length.should.equal(1);
    });
  });

  describe('Comparing cards', () => {
    let manager = new GameManager([]);
    let player1 = new Player('player1', new Deck([]));
    let player2 = new Player('player2', new Deck([]));
    let player3 = new Player('player3', new Deck([]));

    it('finds a winner in a two-player round', () => {
      let result = manager.findWinner([
        { player: player1, card: new Card('club', { face: 'K', value: 13 }) },
        { player: player2, card: new Card('heart', { face: 'Q', value: 12 }) }
      ]);

      result.length.should.equal(1);
      result[0].player.name.should.equal('player1');
    });

    it('finds a winner even if the cards aren\'t in order', () => {
      let result = manager.findWinner([
        { player: player2, card: new Card('heart', { face: 'Q', value: 12 }) },
        { player: player1, card: new Card('club', { face: 'K', value: 13 }) }
      ]);

      result.length.should.equal(1);
      result[0].player.name.should.equal('player1');
    });

    it('finds a tie if the cards are the same value', () => {
      let result = manager.findWinner([
        { player: player2, card: new Card('heart', { face: 'K', value: 13 }) },
        { player: player1, card: new Card('club', { face: 'K', value: 13 }) },
        { player: player3, card: new Card('diamond', { face: '10', value: 10 }) }
      ]);

      result.length.should.equal(2);
    });
  });

  describe('Resolving rounds', () => {
    let manager = new GameManager([]);

    it('finds the winner of a round', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
      ]));

      let player2 = new Player('player2', new Deck([
        new Card('heart', { face: 'Q', value: 12 }),
      ]));

      let result = manager.resolveRound([player1, player2], 1);

      result.winner.name.should.equal('player1');
      result.playedCards.length.should.equal(2);
      result.eliminatedPlayers.length.should.equal(0);
    });

    it('properly handles a round where all players are eliminated', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
      ]));

      let player2 = new Player('player2', new Deck([
        new Card('heart', { face: 'Q', value: 12 }),
      ]));

      let result = manager.resolveRound([player1, player2], 2);

      Should.not.exist(result.winner);
      result.playedCards.length.should.equal(2);
      result.eliminatedPlayers.length.should.equal(2);
    });

    it('properly takes cards away from players', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
      ]));

      let player2 = new Player('player2', new Deck([
        new Card('heart', { face: 'Q', value: 12 }),
      ]));

      let result = manager.resolveRound([player1, player2], 1);

      player2.canTake(1).should.be.false();
    });

    it('properly awards cards to the winning player', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
      ]));

      let player2 = new Player('player2', new Deck([
        new Card('heart', { face: 'Q', value: 12 }),
      ]));

      let result = manager.resolveRound([player1, player2], 1);

      player1.canTake(2).should.be.true();
    });
  });

  describe('Resolving Wars', () => {
    let manager = new GameManager([]);

    it('finds a winner of a war', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: 'A', value: 14 }),
      ]));

      let player2 = new Player('player2', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: 'Q', value: 12 }),
      ]));

      let result = manager.resolveRound([player1, player2], 3);

      result.winner.name.should.equal('player1');
      result.playedCards.length.should.equal(6);
      result.eliminatedPlayers.length.should.equal(0);
    });

    it('handles a war where everyone was eliminated', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: 'A', value: 14 }),
      ]));

      let player2 = new Player('player2', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: 'A', value: 14 }),
      ]));

      let result = manager.resolveRound([player1, player2], 3);

      Should.not.exist(result.winner);
      result.playedCards.length.should.equal(6);
      result.eliminatedPlayers.length.should.equal(2);
    });

    it('properly handles a multi-player war', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: 'A', value: 14 }),
      ]));

      let player2 = new Player('player2', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: 'Q', value: 12 }),
      ]));

      let player3 = new Player('player2', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: '10', value: 10 }),
      ]));

      let result = manager.resolveRound([player1, player2, player3], 3);

      result.winner.name.should.equal('player1');
      result.playedCards.length.should.equal(9);
      result.eliminatedPlayers.length.should.equal(0);
    });

    it('properly resolves a tie during the war', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: 'A', value: 14 }),
        new Card('club', { face: 'K', value: 13 }),
        new Card('club', { face: '3', value: 3 }),
        new Card('club', { face: 'A', value: 14 })
      ]));

      let player2 = new Player('player2', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: 'A', value: 14 }),
        new Card('club', { face: 'K', value: 13 }),
        new Card('club', { face: '3', value: 3 }),
        new Card('club', { face: 'Q', value: 12 })
      ]));

      let result = manager.resolveRound([player1, player2], 3);

      result.winner.name.should.equal('player1');
      result.playedCards.length.should.equal(12);
      result.eliminatedPlayers.length.should.equal(0);
    });

    it('properly resolves a tie where not all players are involved', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: 'A', value: 14 }),
        new Card('club', { face: 'K', value: 13 }),
        new Card('club', { face: '3', value: 3 }),
        new Card('club', { face: 'A', value: 14 })
      ]));

      let player2 = new Player('player2', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: 'A', value: 14 }),
        new Card('club', { face: 'K', value: 13 }),
        new Card('club', { face: '3', value: 3 }),
        new Card('club', { face: 'Q', value: 12 })
      ]));

      let player3 = new Player('player3', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
        new Card('heart', { face: '3', value: 3 }),
        new Card('heart', { face: 'Q', value: 12 }),
        new Card('club', { face: 'K', value: 13 }),
        new Card('club', { face: '3', value: 3 }),
        new Card('club', { face: 'Q', value: 12 })
      ]));

      let result = manager.resolveRound([player1, player2, player3], 3);

      result.winner.name.should.equal('player1');
      result.playedCards.length.should.equal(18);
      result.eliminatedPlayers.length.should.equal(0);
    });
  });

  describe('Handling end-game states', () => {
    it('removes eliminated players from the active players list', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
      ]));

      let player2 = new Player('player2', new Deck([]));

      let manager = new GameManager([player1, player2]);

      let result = manager.playTurn();

      result.winner.name.should.equal('player1');
      result.eliminatedPlayers.length.should.equal(1);

      // this is reaching into the private fields of the manager.
      // they don't need to be exposed for normal function, but
      // I want to test that they're being manipulated properly
      // by this method.
      manager._activePlayers.length.should.equal(1);
      manager._eliminatedPlayers.length.should.equal(1);
    });

    it('detects a completed game', () => {
      let player1 = new Player('player1', new Deck([
        new Card('heart', { face: 'K', value: 13 }),
      ]));

      let player2 = new Player('player2', new Deck([]));

      let manager = new GameManager([player1, player2]);

      let result = manager.playTurn();

      manager.isGameComplete.should.be.true();
      manager.isGameTied.should.be.false();
    });

    it('detects a tied game', () => {
      let player1 = new Player('player1', new Deck([]));
      let player2 = new Player('player2', new Deck([]));

      let manager = new GameManager([player1, player2]);

      let result = manager.playTurn();

      manager.isGameComplete.should.be.true();
      manager.isGameTied.should.be.true();
    });

    it('is iterable', () => {
      let player1 = new Player('player1', new Deck([]));
      let player2 = new Player('player2', new Deck([]));

      let manager = new GameManager([player1, player2]);

      let rounds = [];

      for (let result of manager) {
        rounds.push(result);
      }

      rounds.length.should.be.above(0);
    });
  });
});
