import shipFactory from "../scripts/ship.js";

const makeShips = () => {
  return [
    shipFactory(2), //patrol
    shipFactory(3), //submarine
    shipFactory(3), //destroyer
    shipFactory(4), //battleship
    shipFactory(5), //carrier
  ];
};

const playerShips = makeShips();
const computerShips = makeShips();

const createShipDisplay = () => {
  const shipHolder = document.createElement("div");
  shipHolder.classList.add("ship-holder");
  playerShips.forEach((ship, idx) => {
    const shipContainer = document.createElement("div");
    shipContainer.classList.add("ship");
    shipContainer.setAttribute("data-ship", idx);
    shipContainer.draggable = true;
    for (let i = 0; i < ship.getLength(); i++) {
      const shipTile = document.createElement("div");
      shipTile.classList.add("ship-tile");
      shipTile.setAttribute("data-index", i);
      shipContainer.appendChild(shipTile);
    }
    shipHolder.appendChild(shipContainer);
  });
  return shipHolder;
};

export { createShipDisplay, computerShips, playerShips };
