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

  hasTouchedItself() {
    const bodyPositions = this.location.slice(0, -1);
    const booleanValue = bodyPositions.some(([bodyX, bodyY]) => {
      const [headX, headY] = this.head;
      return bodyX == headX && bodyY == headY;
    })
    return booleanValue;
  }
}
