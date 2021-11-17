import tile from "../src/scripts/tile.js";

const tempTile = tile(1, 2);

test("it should return its coordinate position", () => {
  expect(tempTile.getPosition()).toEqual([1, 2]);
});

test("it should return the state of the tile", () => {
  expect(tempTile.getState()).toBe(tempTile.EMPTY);
});

test("it should set the state of the tile", () => {
  tempTile.setState(tempTile.HIT);
  expect(tempTile.getState()).toBe(tempTile.HIT);
});

test("it should return null for a tile with no ship", () => {
  expect(tempTile.getShip()).toBeNull();
});

test("it should set the ship onto a tile", () => {
  const mockShip = jest.fn();
  tempTile.setShip(mockShip);
  expect(tempTile.getShip()).toBe(mockShip);
});
