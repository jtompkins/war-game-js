import should from 'should';
import Card from '../src/card';

describe('Card', () => {
  describe('creating cards', () => {
    it('should know the available suits', () => {
      Card.isValidSuit('club').should.be.true();
      Card.isValidSuit('foo').should.be.false();
    });
    
    it('should know the available faces', () => {
      Card.isValidFace('2').should.be.true();
      Card.isValidFace('Q').should.be.true();
      Card.isValidFace('q').should.be.true();
      Card.isValidFace('E').should.be.false();
    });
    
    it('should know the available values', () => {
      Card.isValidValue(2).should.be.true();
      Card.isValidValue(1).should.be.false();
      Card.isValidValue('1').should.be.false();
    });
    
    it('should construct a well-formed card', () => {
      const card = new Card('club', { face: 'K', value: 13 });
      
      card.suit.should.equal('club');
      card.face.should.equal('K');
      card.value.should.equal(13);
    });
    
    it('should throw when given an invalid suit', () => {
      (() => new Card('foo', { face: 'K', value: 13 })).should.throw();
    });

    it('should throw when given an invalid face', () => {
      (() => new Card('club', { face: 'E', value: 13 })).should.throw();
    });

    it('should throw when given an invalid value', () => {
      (() => new Card('club', { face: 'K', value: 15 })).should.throw();
    });
  });
});
