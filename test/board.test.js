import boardFactory from "../src/scripts/board.js";

const board = boardFactory(10);
const ship = {
  HORIZONTAL: 1,
  getLength: function () {
    return 2;
  },
  getOrientation: function () {
    return ship.HORIZONTAL;
  },
  hit: function () {},
  isSunk: function () {
    return true;
  },
  getId: function () {
    return 120;
  },
};

describe("when getting a tile", () => {
  test("it should return the tile from the position given", () => {
    expect(typeof board.getTile(1, 2)).toBe("object");
  });

  test("it should throw error when getting a tile out of bounds", () => {
    expect(() => board.getTile(50, 30)).toThrow();
  });
});

describe("when it gets the surrounding tiles", () => {
  test("it should get an array of surrounding tiles", () => {
    expect(typeof board.getSurroundingTiles(1, 2)).toBe("object");
  });

  test("it should only get 3 tiles if its a corner", () => {
    const tiles = Object.entries(board.getSurroundingTiles(0, 0));
    let count = 0;
    for (let i of tiles) {
      count++;
    }
    expect(count).toBe(3);
  });

  test("it should get the correct tiles", () => {
    const tiles = Object.entries(board.getSurroundingTiles(3, 3));
    const border = [];
    for (let [key, value] of tiles) {
      border.push(value.getPosition());
    }
    expect(border).toEqual([
      [2, 3],
      [3, 2],
      [2, 2],
      [4, 2],
      [2, 4],
      [4, 3],
      [3, 4],
      [4, 4],
    ]);
  });
});

describe("when placing a ship on the board", () => {
  test("it should update the tile to have a ship", () => {
    const tile = board.getTile(4, 4);
    const spy = jest.spyOn(tile, "setShip");
    board.placeShip(ship, [4, 4]);
    expect(spy).toHaveBeenCalled();
  });

  test("it should throw an error if a ship is already present", () => {
    const otherShip = {};
    expect(() => board.placeShip(otherShip, [4, 4])).toThrow();
  });

  test("it should throw an error if the ship will go off the board", () => {
    expect(() => board.placeShip(ship, [9, 9])).toThrow();
  });

  test("it should throw an error if a ship is next to the tile", () => {
    const otherShip = {
      HORIZONTAL: 1,
      getLength: function () {
        return 2;
      },
      getOrientation: function () {
        return ship.HORIZONTAL;
      },
      hit: function () {},
      isSunk: function () {
        return true;
      },
    };
    expect(() => board.placeShip(otherShip, [5, 5])).toThrow();
  });

  test("it should cover the correct tiles", () => {
    const otherTile = board.getTile(4, 5);
    expect(otherTile.getShip()).toBe(otherTile.getShip());
  });
});

describe("when all the ships have been sunk", () => {
  const newBoard = boardFactory(10);
  const testShip = {
    HORIZONTAL: 1,
    getLength: function () {
      return 2;
    },
    getOrientation: function () {
      return ship.HORIZONTAL;
    },
    hit: function () {},
    isSunk: function () {
      return true;
    },
    getId: function () {
      return 123;
    },
  };
  const testShip2 = {
    HORIZONTAL: 1,
    getLength: function () {
      return 2;
    },
    getOrientation: function () {
      return ship.HORIZONTAL;
    },
    hit: function () {},
    isSunk: function () {
      return true;
    },
    getId: function () {
      return 125;
    },
  };

  newBoard.placeShip(testShip, [0, 0]);
  newBoard.placeShip(testShip2, [5, 5]);

  test("should send a message is isSunk method of ship", () => {
    const spy = jest.spyOn(testShip, "isSunk");
    newBoard.allSunk();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("it should return true", () => {
    expect(newBoard.allSunk()).toBeTruthy();
  });
});

describe("when a ship has been sunk", () => {
  const board = boardFactory(10);
  const ship = {
    HORIZONTAL: 1,
    getLength: function () {
      return 2;
    },
    getOrientation: function () {
      return ship.HORIZONTAL;
    },
    hit: function () {},
    isSunk: function () {
      return true;
    },
    getId: function () {
      return 123;
    },
  };
  board.placeShip(ship, [3, 3]);
  board.markHit(3, 3);
  test("it should mark all the tiles around it as hit", () => {
    const tiles = Object.entries(board.getSurroundingTiles(3, 3));
    let marked = true;
    for (let [key, tile] of tiles) {
      if (tile.getState() === tile.EMPTY) {
        marked = false;
      }
    }
    expect(marked).toBeTruthy();
  });
});
