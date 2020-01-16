'use strict'

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
  }

  get location() {
    return this.positions.slice();
  }

  get species() {
    return this.type;
  }

  get tail() {
    return this.previousTail;
  }

  get head() {
    return this.location[this.location.length - 1];
  }

  turnLeft() {
    this.direction.turnLeft();
  }

  grow() {
    this.positions.unshift(this.previousTail);
  }

  move() {
    const [headX, headY] = this.head;
    this.previousTail = this.positions.shift();

    const [deltaX, deltaY] = this.direction.delta;

    this.positions.push([headX + deltaX, headY + deltaY]);
  }

  hasCrossedBoundaries() {
    const [headX, headY] = this.head;
    const isHeadXOutOfCols = headX < 0 || headX >= NUM_OF_COLS;
    const isHeadYOutOfRows = headY < 0 || headY >= NUM_OF_ROWS;
    return isHeadXOutOfCols || isHeadYOutOfRows;
  }
}
