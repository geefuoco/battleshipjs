const shipFactory = (size) => {
  const length = size;
  let hitPoints = size;

  const hit = () => {
    if (hitPoints > 0) {
      hitPoints -= 1;
    }
  };

  const getHitPoints = () => {
    return hitPoints;
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
  };
};

export default shipFactory;
