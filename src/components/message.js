const message = (text) => {
  const container = document.createElement("container");
  const message = document.createElement("p");
  const button = document.createElement("button");

  container.classList.add("game-over");
  message.classList.add("game-over-text");
  button.classList.add("game-over-button");

  button.innerText = "Play Again ?";
  message.innerText = text;
  container.appendChild(message);
  container.appendChild(button);

  button.addEventListener("click", () => {
    location.reload();
  });

  return container;
};

export default message;
