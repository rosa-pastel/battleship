import Ship from "../modules/ship";
it("creates ship with correct properties", () => {
  const ship = new Ship(2);
  expect(ship.length).toBe(2);
  expect(ship.timesHit).toBe(0);
  expect(ship.sunk).toBeFalsy();
});
it("hits ship", () => {
  const ship = new Ship(2);
  ship.hit();
  expect(ship.timesHit).toBe(1);
});
it("updates ship sunk state when hit", () => {
  const ship = new Ship(1);
  ship.hit();
  expect(ship.sunk).toBeTruthy();
});
