import playerFactory from "../src/scripts/player.js";
import boardFactory from "../src/scripts/board.js";

const player = playerFactory(boardFactory(10));
const enemy = playerFactory(boardFactory(10));

test("it should return a board object", () => {
  expect(typeof enemy.getBoard()).toBe("object");
});

test("it should throw an error if the same move is made", () => {
  player.attack(enemy.getBoard(), [4, 4]);
  expect(() => player.attack(enemy.getBoard(), [4, 4])).toThrow();
});

test("it should make an attack on the enemey board", () => {
  const spy = jest.spyOn(enemy.getBoard(), "markHit");
  player.attack(enemy.getBoard(), [3, 3]);
  expect(spy).toHaveBeenCalled();
});
