import "../styles/main.scss";
import { playerBoard } from "../components/gameBoard.js";
import { computerBoard } from "../components/gameBoard.js";
import gameFactory from "./game.js";
import { computerShips } from "../components/shipComponent.js";
import { playerShips } from "../components/shipComponent.js";
import { createShipDisplay } from "../components/shipComponent.js";
import startScreen from "../components/startScreen";
import rotate from "../components/rotateButton.js";
import message from "../components/message.js";

const init = (() => {
  const game = gameFactory();
  const playerTileSet = game.getCurrentPlayer().getBoard().getBoard();
  const computerTileSet = game.getOtherPlayer().getBoard().getBoard();
  const playerDataBoard = game.getCurrentPlayer().getBoard();
  const computerDataBoard = game.getOtherPlayer().getBoard();
  const boardsContainer = document.createElement("div");
  const computerGuesses = [];

  const playerBoardUI = playerBoard(playerTileSet);
  const computerBoardUI = computerBoard(computerTileSet);
  let shipElement = null;
  let shipTile = null;

  const bindEvents = () => {
    document.querySelectorAll(".ship").forEach((ship) => {
      ship.addEventListener("mousedown", setCurrentShip);
    });
    Array.from(playerBoardUI.children).forEach((tileRow) => {
      Array.from(tileRow.children).forEach((tile) => {
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("drop", dragDrop);
      });
    });
    document.querySelector(".rotate").addEventListener("click", () => {
      document.querySelectorAll(".ship").forEach((el) => {
        el.classList.toggle("column");
        const ship = playerShips[Number(el.getAttribute("data-ship"))];
        ship.swapOrientation();
      });
    });
    computerBoardUI.querySelectorAll(".tile").forEach((tile) => {
      tile.addEventListener("click", markTile);
    });
  };

  const setCurrentShip = (ev) => {
    shipTile = ev.target;
    shipElement = ev.target.parentNode;
  };
  const dragEnter = (ev) => {
    ev.preventDefault();
  };

  const dragOver = (ev) => {
    ev.preventDefault();
  };

  const markTile = (ev) => {
    const data = ev.target.getAttribute("data-tile").split(",");
    const x = Number(data[0]);
    const y = Number(data[1]);
    const ship = computerDataBoard.getTile(x, y).getShip();
    const marker = createMarker();
    computerDataBoard.markHit(x, y);
    ev.target.appendChild(marker);
    ev.target.removeEventListener("click", markTile);
    updateSurroundingTiles();
    if (ship) {
      marker.classList.add("hit-ship");
      if (game.gameOver()) return gameEnd();
    } else {
      toggleComputerTiles();
      takeComputerTurn();
    }
  };

  const toggleComputerTiles = () => {
    computerBoardUI.classList.toggle("no-events");
  };

  const takeComputerTurn = () => {
    if (game.gameOver()) return gameEnd();
    let coords = getUniqueCoordinates();
    computerGuesses.push(JSON.stringify(coords));
    const [x, y] = coords;
    playerDataBoard.markHit([x], [y]);
    const element = playerBoardUI.querySelector(`[data-tile="${[x]},${y}"]`);
    const marker = createMarker();
    if (element.classList.contains("ship-tile")) {
      marker.classList.add("hit-ship");
      takeComputerTurn();
    } else {
      toggleComputerTiles();
    }
    element.appendChild(marker);
  };

  const getUniqueCoordinates = () => {
    let unique = generateRandomPosition();
    if (!computerGuesses.includes(JSON.stringify(unique))) return unique;
    return getUniqueCoordinates();
  };

  const updateSurroundingTiles = () => {
    const marker = createMarker();
    computerDataBoard.getHitTiles().forEach((tile) => {
      const [x, y] = tile.getPosition();
      const tileElement = computerBoardUI.querySelector(
        `.tile[data-tile="${[x]},${[y]}"]`
      );
      if (!tileElement.hasChildNodes()) {
        tileElement.appendChild(marker.cloneNode());
        tileElement.removeEventListener("click", markTile);
      }
    });
  };

  const gameEnd = () => {
    document.querySelector("html").appendChild(message("Game Over"));
  };

  const createMarker = () => {
    const marker = document.createElement("div");
    marker.classList.add("hit");
    return marker;
  };

  const dragDrop = (ev) => {
    if (!shipElement) return;
    if (!shipTile) return;
    swapTilesWithShip(shipElement, ev.target);
  };

  const swapTilesWithShip = (shipElement, eventTarget) => {
    const ship = playerShips[Number(shipElement.getAttribute("data-ship"))];
    const [x, y] = eventTarget.getAttribute("data-tile").split(",");
    const shipLength = ship.getLength();
    const shipTileIndex = shipTile.getAttribute("data-index");
    const tiles = [];
    getSelectedTiles([x], [y], ship, tiles);
    if (tiles.length !== shipLength) {
      alert("Cannot place ship there. Pick a different spot");
      return;
    }
    const dX = Number([x]);
    const dY = Number([y]);
    try {
      playerDataBoard.placeShip(ship, [dX, dY], shipTileIndex);
    } catch (err) {
      console.error(err);
      return;
    }
    tiles.forEach((tile) => {
      tile.classList.toggle("tile");
      tile.classList.add("ship-tile");
    });
    removeShipFromHolder(shipElement);
  };

  const getSelectedTiles = (x, y, ship, tiles) => {
    const shipTileIndex = shipTile.getAttribute("data-index");
    for (let i = 0; i < ship.getLength(); i++) {
      let pos1 = Number(x);
      let pos2 = Number(y);
      if (ship.getOrientation() === ship.HORIZONTAL) {
        pos2 += i - shipTileIndex;
      } else {
        pos1 += i - shipTileIndex;
      }
      const tile = playerBoardUI.querySelector(
        `.tile[data-tile="${pos1},${pos2}"]`
      );
      if (!tile) break;
      tiles.push(tile);
    }
  };

  const removeShipFromHolder = (ship) => {
    const holder = document.querySelector(".ship-holder");
    try {
      holder.removeChild(ship);
    } catch (err) {
      console.warn("No ship to remove");
      console.error(err);
    } finally {
      shipElement = null;
      if (holder.childNodes.length === 0) {
        removeElements();
        startGame();
      }
    }
  };

  const removeElements = () => {
    const holder = document.querySelector(".ship-holder");
    const rotate = document.querySelector(".rotate");
    document.body.removeChild(holder);
    document.querySelector(".boards").removeChild(rotate);
  };

  const startGame = () => {
    computerBoardUI.classList.toggle("hidden");
    boardsContainer.classList.toggle("column");
    playerBoardUI.classList.toggle("no-events");
    placeComputerShips(computerShips);
  };

  const placeComputerShips = (arrayOfShips) => {
    const placedShips = [];
    const orientationCount = 0;
    while (placedShips.length != arrayOfShips.length) {
      for (let i = 0; i < arrayOfShips.length; i++) {
        if (placedShips.find((ship) => ship === arrayOfShips[i])) continue;
        if (orientationCount % 2 == 0) {
          arrayOfShips[i].swapOrientation();
        }
        const position = generateRandomPosition();
        try {
          computerDataBoard.placeShip(arrayOfShips[i], position);
          placedShips.push(arrayOfShips[i]);
        } catch {}
      }
    }
  };

  const generateRandomPosition = () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return [x, y];
  };

  boardsContainer.className = "boards column";
  boardsContainer.appendChild(playerBoardUI);
  boardsContainer.appendChild(computerBoardUI);
  boardsContainer.appendChild(rotate());
  document.body.appendChild(boardsContainer);
  document.body.appendChild(createShipDisplay());
  document.body.appendChild(startScreen());
  bindEvents();
})();
