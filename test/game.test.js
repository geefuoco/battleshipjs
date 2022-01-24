import gameFactory from "../src/scripts/game.js";

const game = gameFactory();

test("it should send a message to the allSunk method", () => {
  const player = game.getCurrentPlayer();
  const spy = jest.spyOn(player.getBoard(), "allSunk");
  game.gameOver();
  expect(spy).toHaveBeenCalled();
});
