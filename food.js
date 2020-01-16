'use strict'

class Food {
  constructor(colId, rowId, previousFood, NUM_OF_COLS, NUM_OF_ROWS) {
    this.colId = colId;
    this.rowId = rowId;
    this.previousFood = previousFood;
    this.NUM_OF_COLS = NUM_OF_COLS;
    this.NUM_OF_ROWS = NUM_OF_ROWS;
  }

  get position() {
    return [this.colId, this.rowId];
  }

  get previousFoodLocation() {
    return this.previousFood.slice();
  }

  generateNewFood() {
    this.previousFood = [this.colId, this.rowId];
    this.rowId = Math.floor(Math.random() * this.NUM_OF_ROWS);
    this.colId = Math.floor(Math.random() * this.NUM_OF_COLS);
  }
}