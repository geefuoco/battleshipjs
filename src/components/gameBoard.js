const playerBoard = (tileSet) => {
  const board = document.createElement("div");
  board.classList.add("player-board");
  generateTiles(tileSet, board);
  return board;
};

const computerBoard = (tileSet) => {
  const board = document.createElement("div");
  board.classList.add("enemy-board");
  board.classList.add("hidden");
  generateTiles(tileSet, board);
  return board;
};

const generateTiles = (tileSet, container) => {
  tileSet.forEach((tileRow) => {
    const tileRowElement = document.createElement("div");
    tileRowElement.classList.add("tile-row");
    tileRow.forEach((tile) => {
      const tileElement = document.createElement("div");
      tileElement.classList.add("tile");
      tileElement.setAttribute("data-tile", tile.getPosition());
      tileRowElement.appendChild(tileElement);
    });
    container.appendChild(tileRowElement);
  });
};

export { playerBoard, computerBoard };
