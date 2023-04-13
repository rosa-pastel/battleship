import Gameboard from "../modules/gameboard";
import Ship from "../modules/ship";
it("Creates new board", () => {
  const gameboard = new Gameboard();
  expect(gameboard.board.length).toBe(10);
  expect(gameboard.board[0].length).toBe(10);
  expect(gameboard.board[0][0].hit).toBeFalsy();
  expect(gameboard.board[0][0].ship).toBeNull();
});
it("Places ship of size 1 on board", () => {
  const gameboard = new Gameboard();
  const ship = new Ship(1);
  gameboard.placeShip(ship, 0, 0);
  expect(gameboard.board[0][0].ship).not.toBeNull();
  expect(gameboard.board[0][1].ship).toBeNull();
  expect(gameboard.board[1][0].ship).toBeNull();
});
it("Places ship of size 5 on board", () => {
  const gameboard = new Gameboard();
  const ship = new Ship(5);
  gameboard.placeShip(ship, 0, 0);
  expect(gameboard.board[0][0].ship).not.toBeNull();
  expect(gameboard.board[0][1].ship).toBeNull();
  expect(gameboard.board[4][0].ship).not.toBeNull();
  expect(gameboard.board[5][0].ship).toBeNull();
});
it("Doesn't place ship if it doesn't fit the board", () => {
  const gameboard = new Gameboard();
  const ship = new Ship(5);
  gameboard.placeShip(ship, 5, 0);
  expect(gameboard.board[6][0].ship).toBeNull();
});
it("Doesn't place ship if it doesn't fit the board", () => {
  const gameboard = new Gameboard();
  const shipSmall = new Ship(2);
  gameboard.placeShip(shipSmall, 0, 0);
  const shipBig = new Ship(5);
  gameboard.placeShip(shipBig, 0, 0);
  expect(gameboard.board[0][0].ship.length).toBe(2);
  expect(gameboard.board[2][0].ship).toBeNull();
});
it("Receives attack to empty square", () => {
  const gameboard = new Gameboard();
  gameboard.receiveAttack(0, 0);
  expect(gameboard.board[0][0].hit).toBeTruthy();
});
it("Receives attack to ship", () => {
  const gameboard = new Gameboard();
  const ship = new Ship(1);
  gameboard.placeShip(ship, 0, 0);
  gameboard.receiveAttack(0, 0);
  expect(gameboard.board[0][0].hit).toBeTruthy();
});
it("Doesn't receive attack to already hit square", () => {
  const gameboard = new Gameboard();
  const ship = new Ship(1);
  gameboard.placeShip(ship, 0, 0);
  gameboard.receiveAttack(0, 0);
  expect(gameboard.board[0][0].hit).toBeTruthy();
  expect(gameboard.receiveAttack(0, 0)).toBe("fail");
});
