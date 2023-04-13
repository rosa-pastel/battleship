export default class Ship {
  constructor(size) {
    this.length = size;
    this.timesHit = 0;
    this.sunk = 0;
  }
  hit() {
    this.timesHit++;
    this.isSunk();
  }
  isSunk() {
    return (this.sunk = this.timesHit >= this.length);
  }
}
