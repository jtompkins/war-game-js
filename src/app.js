import Deck from './deck';
import Player from './player';
import GameManager from './gameManager';

import readline from 'readline';

const reader = readline.createInterface(process.stdin, process.stdout);

reader.setPrompt('How many players (2-4)? ');
reader.prompt();

reader.on('line', (line) => {
  const input = line.trim();
  const numberOfPlayers = parseInt(input);

  if (numberOfPlayers < 2 || numberOfPlayers > 4) {
    console.log('Please select a number between 2 and 4.');
    reader.prompt();
    return;
  }

  const startingDeck = Deck.standardDeck();
  const players = Player.createPlayers(startingDeck, numberOfPlayers);
  const manager = new GameManager(players);

  for (const round of manager) {
    const winner = round.winner ? `${round.winner.name}` : 'no one';
    const players = manager.activePlayers.map(p => `${p.name} (${p._deck.count} left)`).join(', ');

    console.log(`Round ${round.round}: ${winner} won, ${players} remain.`);

    // games of war can go on for a very long time, though the card award
    // mechanism we use should limit the trend towards infinity. just in case,
    // stop the game after 2,000 turns.
    if (round.round > 2000) {
      console.log('This looks like it could go on all day. Let\'s just call it a tie.');
      break;
    }
  }

  if (manager.winner)
    console.log(`Game over on round ${manager.round}! ${manager.winner.name} won!`);
  else
    console.log(`Game over on round ${manager.round}! The game was tied!`);

  process.exit(0);
}).on('close', () => {
  process.exit(0);
});
