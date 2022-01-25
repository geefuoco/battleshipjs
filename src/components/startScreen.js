const startScreen = () => {
  const background = document.createElement("div");
  const title = document.createElement("h1");
  const start = document.createElement("button");

  background.classList.add("start-background");
  title.classList.add("start-title");
  start.classList.add("start-game-button");

  title.innerText = "Battleships";
  start.innerText = "Start Game";

  const startGame = () => {
    const element = document.querySelector(".start-background");
    document.body.removeChild(element);
  };

  start.addEventListener("click", startGame);

  background.appendChild(title);
  background.appendChild(start);

  return background;
};

export default startScreen;
