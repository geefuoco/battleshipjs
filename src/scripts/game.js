import playerFactory from "./player.js";
import boardFactory from "./board.js";

const gameFactory = () => {
  const firstPlayer = playerFactory(boardFactory(10));
  const secondPlayer = playerFactory(boardFactory(10));

  const players = [firstPlayer, secondPlayer];

  const getCurrentPlayer = () => {
    return players[0];
  };

  const getOtherPlayer = () => {
    return players[1];
  };

  const swapPlayers = () => {
    players.reverse;
  };

  const checkForWinner = () => {
    const win = players.filter((player) => {
      player.getBoard().allSunk() === true;
    });
    return win.length > 0;
  };

  const takeTurn = (coords) => {
    const player = getCurrentPlayer();
    const enemy = getOtherPlayer();
    player.attack(enemy.getBoard(), coords);
  };

  return {
    getCurrentPlayer,
    getOtherPlayer,
    swapPlayers,
    checkForWinner,
    takeTurn,
  };
};

export default gameFactory;
