const shipFactory = (size, orientation = 0) => {
  if (orientation < 0 || orientation > 1) {
    throw "ERROR: Orientation must be 0 (Vertical) or 1 (Horizontal)";
  }
  const length = size;
  let hitPoints = size;
  const shipOrientation = orientation;
  const HORIZONTAL = 1;
  const VERTICAL = 0;

  const hit = () => {
    if (hitPoints > 0) {
      hitPoints -= 1;
    }
  };

  const getHitPoints = () => {
    return hitPoints;
  };

  const getOrientation = () => {
    return shipOrientation;
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
    HORIZONTAL,
    VERTICAL,
  };
};

export default shipFactory;
