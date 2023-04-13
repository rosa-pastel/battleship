import Player from "./player";
import { win, displayMove } from "./dom";
export default function Game(username, ships) {
  let player1 = new Player(username);
  let player2 = new Player("Computer", 1);
  player1.gameboard.ships = player1.gameboard.placeShipsFromDOM(ships);
  player2.gameboard.ships = player2.gameboard.placeShipsRandomly();
  let turn = player1;
  function squareClicked(x, y) {
    if (turn === player1 && turn.play(x, y, player2.gameboard) !== "fail") {
      let square = document.querySelector(
        `#computer-board>div:nth-child(${x + 1})>div:nth-child(${y + 1})`
      );
      displayMove(square, player2.gameboard.board[x][y].ship);
      if (checkWinner()) return 0;
      turn = player2;
      setTimeout(() => {
        turn.playRandomly(player1.gameboard);
        if (checkWinner()) return 0;
        turn = player1;
      }, 1200);
      return 1;
    }
    return 0;
  }
  function checkWinner() {
    if (
      player1.gameboard.ships.every((obj) => {
        let ship = obj.ship;
        return ship.isSunk();
      })
    ) {
      win(0);
      return player1;
    } else if (
      player2.gameboard.ships.every((obj) => {
        let ship = obj.ship;
        return ship.isSunk();
      })
    ) {
      win(1);
      return player2;
    } else return null;
  }
  return { player1, player2, squareClicked };
}
