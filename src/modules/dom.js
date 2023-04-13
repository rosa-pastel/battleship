import Game from "./game";
import soundtrackSrc from "../audio/rain.mp3";
import hitSoundSrc from "../audio/hit.mp3";
import missSoundSrc from "../audio/miss.mp3";

export function initPage() {
  let soundtrack = new Audio(soundtrackSrc);
  soundtrack.addEventListener("canplaythrough", () => {
    soundtrack.play().catch(() => {
      window.addEventListener("click", () => {
        soundtrack.play();
      });
    });
  });
  displayDragAndDrop();
  const startBtn = document.getElementById("start");
  startBtn.addEventListener("click", () => {
    let username = getUsername();
    if (username.length < 2) displayUsernameWarning();
    else {
      let ships = getShips();
      let game = Game(username, ships);
      cleanPage();
      displayGameboards(game);
      displayPlayerShips(game.player1.gameboard.ships);
    }
  });
}
export function win(playerWins) {
  cleanPage();
  const content = document.getElementById("content");

  const winner = document.createElement("h1");
  winner.id = "winner";
  winner.textContent = playerWins ? "YOU WIN" : "ENEMY WINS";

  const info = document.createElement("h2");
  info.textContent = playerWins
    ? "All of the enemy ships have sunk"
    : "All of your ships have sunk";
  content.appendChild(winner);
  content.appendChild(info);

  const newGameBtn = document.createElement("button");
  content.appendChild(newGameBtn);
  newGameBtn.textContent = "NEW GAME";
  newGameBtn.id = "new-game";
  newGameBtn.addEventListener("click", () => {
    location.reload();
  });

  setTimeout(() => {
    winner.classList.add("opacity-transition");
  }, 1);
}
function displayUsernameWarning() {
  const warning = document.querySelector("p.warning");
  warning.setAttribute("style", "z-index: 0");
}
function cleanPage() {
  const content = document.getElementById("content");
  Array.from(content.children).map((element) => {
    if (element.id === "game" || element.id === "heading") return 0;
    else content.removeChild(element);
  });
  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = "";
}
function getShips() {
  let ships = [];
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 10; row++) {
      let colDiv = document.querySelector(
        `.board>div.col:nth-child(${col + 1})>div:nth-child(${row + 1})`
      );
      if (colDiv.firstChild) {
        let size = colDiv.firstChild.getBoundingClientRect().width / 40;
        ships.push({ size: size, x: col, y: row });
      }
    }
  }
  return ships;
}
function displayDragAndDrop() {
  const gameDiv = document.getElementById("game");
  let boardDiv = document.createElement("div");
  boardDiv.classList.add("board");
  for (let col = 0; col < 10; col++) {
    let colDiv = document.createElement("div");
    colDiv.className = "col";
    for (let row = 0; row < 10; row++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.addEventListener("dragover", () => {
        let draggable = document.querySelector(".dragging");
        if (
          draggable &&
          canDropShip(draggable.getBoundingClientRect().width / 40, col, row)
        ) {
          square.appendChild(draggable);
        }
      });
      colDiv.appendChild(square);
    }
    boardDiv.appendChild(colDiv);
  }
  gameDiv.appendChild(boardDiv);
  let submarineCreated = 0;
  let ships = [2, 3, 3, 4, 5];
  ships = ships.map((size) => {
    let x;
    let y;
    while (true) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      if (canDropShip(size, x, y)) break;
    }
    const shipDiv = document.createElement("div");
    shipDiv.draggable = true;
    shipDiv.addEventListener("dragstart", () => {
      shipDiv.classList.add("dragging");
      let parentsColumn = Array.prototype.indexOf.call(
        shipDiv.parentElement.parentElement.parentElement.children,
        shipDiv.parentElement.parentElement
      );
      let parentsRow = Array.prototype.indexOf.call(
        shipDiv.parentElement.parentElement.children,
        shipDiv.parentElement
      );
      for (let i = 0; i < size; i++) {
        let squareDiv = document.querySelector(
          `.board>div:nth-child(${parentsColumn + 1 + i})>div:nth-child(${
            parentsRow + 1
          })`
        );
        if (!squareDiv || !squareDiv) return 0;
        squareDiv.classList.remove("taken");
        squareDiv = squareDiv.nextElementSibling;
      }
    });
    shipDiv.addEventListener("dragend", () => {
      shipDiv.classList.remove("dragging");
      let parentsColumn = Array.prototype.indexOf.call(
        shipDiv.parentElement.parentElement.parentElement.children,
        shipDiv.parentElement.parentElement
      );
      let parentsRow = Array.prototype.indexOf.call(
        shipDiv.parentElement.parentElement.children,
        shipDiv.parentElement
      );
      for (let i = 0; i < size; i++) {
        let squareDiv = document.querySelector(
          `.board>div:nth-child(${parentsColumn + 1 + i})>div:nth-child(${
            parentsRow + 1
          })`
        );
        if (!squareDiv || !squareDiv) return 0;
        squareDiv.classList.add("taken");
        squareDiv = squareDiv.nextElementSibling;
      }
    });
    shipDiv.classList.add("ship", "draggable");
    switch (size) {
      case 2:
        shipDiv.classList.add("patrolboat");
        break;
      case 3:
        submarineCreated
          ? shipDiv.classList.add("destroyer")
          : shipDiv.classList.add("submarine");
        submarineCreated = 1;
        break;
      case 4:
        shipDiv.classList.add("battleship");
        break;
      default:
        shipDiv.classList.add("carrier");
    }
    let squareDiv = document.querySelector(
      `.board>div:nth-child(${x + 1})>div:nth-child(${y + 1})`
    );
    squareDiv.appendChild(shipDiv);
    for (let i = x; i < x + size; i++) {
      squareDiv = document.querySelector(
        `.board>div:nth-child(${i + 1})>div:nth-child(${y + 1})`
      );
      squareDiv.classList.add("taken");
    }
    return { size, x, y };
  });
}
function canDropShip(size, x, y) {
  let squareDiv;
  for (let i = x; i < x + size; i++) {
    squareDiv = document.querySelector(
      `.board>div:nth-child(${i + 1})>div:nth-child(${y + 1})`
    );
    if (!squareDiv || squareDiv.classList.contains("taken")) return 0;
  }
  return 1;
}
function getUsername() {
  const nameField = document.getElementById("username");
  return nameField.value;
}
function displayGameboards(game) {
  const gameDiv = document.getElementById("game");

  const playerBoardContainer = document.createElement("div");
  const playerBoard = document.createElement("div");
  playerBoardContainer.appendChild(playerBoard);
  playerBoard.id = "player-board";
  playerBoard.classList.add("board");
  const playerBoardHeading = document.createElement("h1");
  playerBoardHeading.textContent = `${game.player1.name}'s Board`;
  playerBoardContainer.appendChild(playerBoardHeading);

  const computerBoardContainer = document.createElement("div");
  const computerBoard = document.createElement("div");
  computerBoardContainer.appendChild(computerBoard);
  computerBoard.id = "computer-board";
  computerBoard.classList.add("board");
  const computerBoardHeading = document.createElement("h1");
  computerBoardHeading.textContent = `${game.player2.name}'s Board`;
  computerBoardContainer.appendChild(computerBoardHeading);

  fillBoard(playerBoard, game.player2, game);
  fillBoard(computerBoard, game.player1, game);

  gameDiv.appendChild(playerBoardContainer);
  gameDiv.appendChild(computerBoardContainer);
}
function fillBoard(boardDiv, player, game) {
  for (let col = 0; col < 10; col++) {
    let colDiv = document.createElement("div");
    colDiv.className = "col";
    for (let row = 0; row < 10; row++) {
      let square = document.createElement("div");
      if (!player.isComputer) {
        square.addEventListener("click", () => {
          game.squareClicked(col, row);
        });
      }
      square.classList.add("square");
      colDiv.appendChild(square);
    }
    boardDiv.appendChild(colDiv);
  }
}
export function displayMove(square, hit) {
  if (hit) {
    let hitImg = document.createElement("div");
    square.appendChild(hitImg);
    hitImg.className = "hit";
    setTimeout(() => {
      hitImg.className = "burn";
    }, 2500);
    let hitSound = new Audio(hitSoundSrc);
    hitSound.play();
  } else {
    let missImg = document.createElement("div");
    missImg.className = "miss";
    square.appendChild(missImg);
    let missSound = new Audio(missSoundSrc);
    missSound.play();
  }
}
export function displayPlayerShips(ships) {
  let submarineCreated = 0;
  ships.forEach((ship) => {
    let x = ship.x;
    let y = ship.y;
    let size = ship.ship.length;
    let shipDiv = document.createElement("div");
    shipDiv.classList.add("ship");
    switch (size) {
      case 2:
        shipDiv.classList.add("patrolboat");
        break;
      case 3:
        submarineCreated
          ? shipDiv.classList.add("destroyer")
          : shipDiv.classList.add("submarine");
        submarineCreated = 1;
        break;
      case 4:
        shipDiv.classList.add("battleship");
        break;
      default:
        shipDiv.classList.add("carrier");
    }
    let squareDiv = document.querySelector(
      `#player-board>div.col:nth-child(${x + 1})>div:nth-child(${y + 1})`
    );
    squareDiv.appendChild(shipDiv);
  });
  return ships;
}
