'use strict'

class Food {
  constructor(colId, rowId, previousFood) {
    this.colId = colId;
    this.rowId = rowId;
    this.previousFood = previousFood;
  }

  get position() {
    return [this.colId, this.rowId];
  }

  get previousFoodLocation() {
    return this.previousFood.slice();
  }

  generateNewFood() {
    this.previousFood = [this.colId, this.rowId];
    this.rowId = Math.floor(Math.random() * NUM_OF_ROWS);
    this.colId = Math.floor(Math.random() * NUM_OF_COLS);
  }
}