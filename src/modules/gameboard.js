import Ship from "./ship";
export default class Gameboard {
  constructor() {
    this.board = [];
    this.ships = [];
    for (let x = 0; x < 10; x++) {
      this.board[x] = [];
      for (let y = 0; y < 10; y++) {
        this.board[x][y] = { hit: 0, ship: null };
      }
    }
  }
  placeShip(ship, x, y) {
    let squares = [];
    let length = ship.length;
    let board = this.board;
    if (x + length > 9) return "fail";
    for (let i = 0; i < length; i++) {
      if (board[x + i][y].ship) return "fail";
      squares.push(board[x + i][y]);
    }
    this.ships.push(ship);
    squares.map((sq) => {
      sq.ship = ship;
    });
    return 1;
  }
  placeShipsRandomly() {
    let ships = [];
    [2, 3, 3, 4, 5].forEach((size) => {
      let ship = new Ship(size);
      while (true) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        let success = this.placeShip(ship, x, y);
        if (success !== "fail") {
          ships.push({ ship, x, y });
          break;
        }
      }
    });
    return ships;
  }
  placeShipsFromDOM(ships) {
    let shipObjs = [];
    ships.forEach((obj) => {
      let ship = new Ship(obj.size);
      let x = obj.x;
      let y = obj.y;
      this.placeShip(ship, x, y);
      shipObjs.push({ ship, x, y });
    });
    return shipObjs;
  }
  receiveAttack(x, y) {
    if (
      this.board[x][y].hit ||
      (this.board[x][y].ship && this.board[x][y].ship.sunk)
    )
      return "fail";
    if (this.board[x][y].ship) this.board[x][y].ship.hit();
    this.board[x][y].hit = 1;
    return 1;
  }
}
