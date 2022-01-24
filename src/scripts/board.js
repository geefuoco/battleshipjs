import tileFactory from "./tile.js";

const boardFactory = (dimension) => {
  const boardSize = dimension;
  const gameBoard = createBoard(boardSize);
  const ships = [];
  const sunkenShips = [];
  const shipMap = {};
  const hitTiles = [];

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

  const getHitTiles = () => {
    return [...hitTiles];
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
    hitTiles.push(tile);
    if (tile.getShip()) {
      tile.getShip().hit();
      updateBoard(tile.getShip());
    }
  };

  const updateBoard = (ship) => {
    if (ship.isSunk()) {
      filterShipTiles(ship);
      sunkenShips.push(ship);
    }
  };

  const filterShipTiles = (ship) => {
    const tiles = shipMap[ship.getId()];
    tiles.forEach((tile) => {
      const position = tile.getPosition();
      markTilesHit(position);
    });
  };

  const markTilesHit = (position) => {
    const surroundingTiles = getSurroundingTiles(position[0], position[1]);
    for (let [key, value] of Object.entries(surroundingTiles)) {
      if (value.getState() !== value.HIT) {
        value.setState(value.HIT);
        hitTiles.push(value);
      }
    }
  };

  const placeShip = (ship, coords, offset = 0) => {
    const tile = getTile(coords[0], coords[1]);
    if (tile.getState() === tile.OCCUPIED) {
      throw "ERROR: Ship is too close to another ship.";
    }
    const shipTiles = getShipTiles(ship, coords, offset);
    validateShipTiles(shipTiles, ship);
    shipTiles.forEach((tile) => tile.setShip(ship));
    ships.push(ship);
    shipMap[ship.getId()] = shipTiles;
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

  const validateShipTiles = (shipTiles, ship) => {
    // Makes sure that no other ships are within 1 square
    shipTiles.forEach((tile) => {
      const position = tile.getPosition();
      const tiles = Object.entries(
        getSurroundingTiles(position[0], position[1])
      );
      for (let [k, v] of tiles) {
        if (v.getState() !== tile.EMPTY) {
          if (v.getShip() === ship) continue;
          throw "ERROR: Ship already on tile";
        }
      }
    });
  };

  const allSunk = () => {
    const sunk = ships.filter((ship) => ship.isSunk() === true);
    return ships.length === sunk.length;
  };

  return {
    getBoard,
    getTile,
    getSurroundingTiles,
    markHit,
    placeShip,
    allSunk,
    getHitTiles,
  };
};

export default boardFactory;
