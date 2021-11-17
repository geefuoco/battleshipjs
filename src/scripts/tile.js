const tileFactory = (x, y) => {
  const position = [x, y];
  const EMPTY = 0;
  const OCCUPIED = 1;
  const HIT = 2;
  let currentShip = null;
  let state = EMPTY;

  const getState = () => {
    return state;
  };

  const setState = (newState) => {
    state = newState;
  };

  const getPosition = () => {
    return [...position];
  };

  const setShip = (ship) => {
    setState(OCCUPIED);
    currentShip = ship;
  };

  const getShip = () => {
    return currentShip;
  };

  return Object.freeze({
    getPosition,
    EMPTY,
    OCCUPIED,
    HIT,
    getState,
    setState,
    getShip,
    setShip,
  });
};

export default tileFactory;
