import Gameboard from "./gameboard";
import { displayMove } from "./dom";

export default class Player {
  constructor(playerName = "Someone", isComputer = 0) {
    this.name = playerName;
    this.gameboard = new Gameboard();
    this.ships;
    this.isComputer = isComputer;
  }
  play(x, y, board) {
    let playSuccess = board.receiveAttack(x, y);
    return playSuccess;
  }
  playRandomly(board) {
    let x;
    let y;
    while (true) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      if (this.play(x, y, board) !== "fail") {
        let square = document.querySelector(
          `#player-board>div:nth-child(${x + 1})>div:nth-child(${y + 1})`
        );
        displayMove(square, board.board[x][y].ship);
        break;
      }
    }
  }
}
