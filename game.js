'use strict'

class Game {
  constructor(snake, ghostSnake, food, scoreCard, NUM_OF_COLS, NUM_OF_ROWS) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.scoreCard = scoreCard;
    this.isGameOver = false;
    this.NUM_OF_COLS = NUM_OF_COLS;
    this.NUM_OF_ROWS = NUM_OF_ROWS;
  }

  turnSnakeLeft() {
    this.snake.turnLeft();
  }

  getStatus() {
    const snake = {
      location: this.snake.location,
      species: this.snake.species,
      previousTail: this.snake.tail
    };
    const food = {
      location: this.food.position,
      previousLocation: this.food.previousFoodLocation
    };
    return { snake, food, score: this.scoreCard.points };
  }

  isFoodEaten() {
    const [headX, headY] = this.snake.head;
    const [foodX, foodY] = this.food.position;
    return headX == foodX && headY == foodY;
  }

  hasCrossedBoundaries() {
    const [headX, headY] = this.snake.head;
    const isHeadXOutOfCols = headX < 0 || headX >= this.NUM_OF_COLS;
    const isHeadYOutOfRows = headY < 0 || headY >= this.NUM_OF_ROWS;
    return isHeadXOutOfCols || isHeadYOutOfRows;
  }

  moveSnake() {
    this.snake.move();
    this.isGameOver = this.hasCrossedBoundaries() || this.snake.hasTouchedItself();
    if (this.isFoodEaten()) {
      this.food.generateNewFood();
      this.snake.grow();
      this.scoreCard.update(1);
    }
  }
}
