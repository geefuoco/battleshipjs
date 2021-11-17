import shipFactory from "../src/scripts/ship.js";

const ship = shipFactory(4);

test("should display the ship's hitpoints", () => {
  expect(ship.getHitPoints()).toEqual(4);
});

test("getting hit should damage the ship", () => {
  ship.hit();
  expect(ship.getHitPoints()).toEqual(3);
});

describe("when testing if a ship is sunk", () => {
  test("it should not be sunk when values are not all 1s", () => {
    expect(ship.isSunk()).toBeFalsy();
  });
  test("it should be sunk if all values are 1", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });
});
