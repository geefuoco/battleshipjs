const playerFactory = (board) => {
  const gameBoard = board;
  const moves = {};

  const getBoard = () => {
    return gameBoard;
  };

  const attack = (board, position) => {
    if (moves[position]) throw "ERROR: Move already made";
    moves[position] = true;
    board.markHit(position[0], position[1]);
  };

  return {
    getBoard,
    attack,
  };
};

export default playerFactory;
