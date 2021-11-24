import tileFactory from "./tile.js";

const boardFactory = (dimension) => {
  const boardSize = dimension;
  const gameBoard = createBoard(boardSize);
  const ships = [];
  const sunkenShips = [];
  const shipMap = {};

  function createBoard(boardSize) {
    const board = [];
    for (let i = 0; i < boardSize; i++) {
      board[i] = [];
      for (let j = 0; j < boardSize; j++) {
        board[i].push(tileFactory(i, j));
      }
    }
    return board;
  }

  const getBoard = () => {
    return [...gameBoard];
  };

  const getTile = (x, y) => {
    if (outOfBounds(x, y)) {
      throw "ERROR: Outside of board";
    }
    return gameBoard[x][y];
  };

  const outOfBounds = (x, y) => {
    return x > boardSize - 1 || y > boardSize - 1 || x < 0 || y < 0;
  };

  const getSurroundingTiles = (x, y) => {
    const surroundingTiles = {};
    addValidTiles(x, y, surroundingTiles);
    return surroundingTiles;
  };

  const addValidTiles = (x, y, object) => {
    const values = [-1, 1];
    for (let i of values) {
      if (!outOfBounds(x + i, y)) {
        object[[x + i, y]] = getTile(x + i, y);
      }
      if (!outOfBounds(x, y + i)) {
        object[[x, y + i]] = getTile(x, y + i);
      }
      if (!outOfBounds(x + i, y + i)) {
        object[[x + i, y + i]] = getTile(x + i, y + i);
      }
      if (!outOfBounds(x - i, y + i)) {
        object[[x - i, y + i]] = getTile(x - i, y + i);
      }
      if (!outOfBounds(x + i, y - i)) {
        object[[x + i, y - i]] = getTile(x + i, y - i);
      }
    }
  };

  const markHit = (x, y) => {
    const tile = getTile(x, y);
    tile.setState(tile.HIT);
    if (tile.getShip()) {
      tile.getShip().hit();
      updateBoard();
    }
  };

  const updateBoard = () => {
    const sunkShips = ships.filter((ship) => ship.isSunk() === true);
    for (let ship of sunkShips) {
      if (sunkenShips.includes(ship)) continue;
      filterShipTiles(ship);
      sunkenShips.push(ship);
    }
  };

  const filterShipTiles = (ship) => {
    const tiles = shipMap[ship];
    tiles.forEach((tile) => {
      const position = tile.getPosition();
      markTilesHit(position);
    });
  };

  const markTilesHit = (position) => {
    const surroundingTiles = getSurroundingTiles(position[0], position[1]);
    for (let [key, value] of Object.entries(surroundingTiles)) {
      value.setState(value.HIT);
    }
  };

  const placeShip = (ship, coords, offset = 0) => {
    const tile = getTile(coords[0], coords[1]);
    if (tile.getState() === tile.OCCUPIED) {
      throw "ERROR: Ship is too close to another ship.";
    }
    const shipTiles = getShipTiles(ship, coords, offset);
    shipTiles.push(tile);
    validateShipTiles(shipTiles, ship, coords);
    shipTiles.forEach((tile) => tile.setShip(ship));
    ships.push(ship);
    shipMap[ship] = shipTiles;
  };

  const getShipTiles = (ship, coords, offset) => {
    // Makes sure all tiles are on the board
    const length = ship.getLength();
    const shipTiles = [];
    for (let i = 0; i < length; i++) {
      let nextTile = null;
      if (ship.getOrientation() === ship.HORIZONTAL) {
        nextTile = getTile(coords[0], Number(coords[1]) + i - offset);
      } else {
        nextTile = getTile(Number(coords[0]) + i - offset, coords[1]);
      }
      shipTiles.push(nextTile);
    }
    return shipTiles;
  };

  const validateShipTiles = (shipTiles, ship, coords) => {
    // Makes sure that no other ships are within 1 square
    shipTiles.forEach((tile) => {
      const position = tile.getPosition();
      const tiles = Object.entries(
        getSurroundingTiles(position[0], position[1])
      );
      for (let [k, v] of tiles) {
        if (v.getState() !== tile.EMPTY) {
          if (v.getShip() === ship) continue;
          alert("Ships must be placed at least 1 tile apart");
          throw "ERROR: Ship already on tile";
        }
      }
    });
  };

  const allSunk = () => {
    return (
      ships.length === ships.filter((ship) => ship.isSunk() === true).length
    );
  };

  return {
    getBoard,
    getTile,
    getSurroundingTiles,
    markHit,
    placeShip,
    allSunk,
  };
};

export default boardFactory;
