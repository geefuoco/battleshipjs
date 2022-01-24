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

  const gameOver = () => {
    let win = false;
    players.forEach((player) => {
      if (player.getBoard().allSunk()) {
        win = true;
      }
    });
    return win;
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
    gameOver,
    takeTurn,
  };
};

export default gameFactory;
