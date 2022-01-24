const shipFactory = (size, orientation = 1) => {
  if (orientation < 0 || orientation > 1) {
    throw "ERROR: Orientation must be 0 (Vertical) or 1 (Horizontal)";
  }
  const length = size;
  let hitPoints = size;
  let shipOrientation = orientation;
  const id = Date.now() + Math.random(100);
  const HORIZONTAL = 1;
  const VERTICAL = 0;

  const hit = () => {
    if (hitPoints > 0) {
      hitPoints -= 1;
    }
  };

  const getId = () => {
    return id;
  };

  const getHitPoints = () => {
    return hitPoints;
  };

  const getOrientation = () => {
    return shipOrientation;
  };

  const swapOrientation = () => {
    if (shipOrientation === HORIZONTAL) {
      shipOrientation = VERTICAL;
    } else {
      shipOrientation = HORIZONTAL;
    }
  };

  const getLength = () => {
    return length;
  };

  const isSunk = () => {
    return hitPoints === 0;
  };

  return {
    hit,
    getHitPoints,
    getLength,
    isSunk,
    getOrientation,
    swapOrientation,
    getId,
    HORIZONTAL,
    VERTICAL,
  };
};

export default shipFactory;
