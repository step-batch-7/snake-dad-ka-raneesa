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
    const ghostSnake = {
      location: this.ghostSnake.location,
      species: this.ghostSnake.species,
      previousTail: this.ghostSnake.tail
    };
    const food = {
      location: this.food.position,
      previousLocation: this.food.previousFoodLocation
    };
    return { snake, food, ghostSnake, score: this.scoreCard.points };
  }

  isFoodEaten(snake) {
    const [headX, headY] = snake.head;
    const [foodX, foodY] = this.food.position;
    return headX == foodX && headY == foodY;
  }

  isCrossedBoundaries() {
    const [headX, headY] = this.snake.head;
    const isHeadXOutOfCols = headX < 0 || headX >= this.NUM_OF_COLS;
    const isHeadYOutOfRows = headY < 0 || headY >= this.NUM_OF_ROWS;
    return isHeadXOutOfCols || isHeadYOutOfRows;
  }

  moveSnake() {
    this.snake.move();
    this.isGameOver = this.isCrossedBoundaries() || this.snake.hasTouchedItself();
    if (this.isFoodEaten(this.snake)) {
      this.food.generateNewFood();
      this.snake.grow();
      this.scoreCard.update(1);
    }
  }
  moveGhostSnake() {
    this.ghostSnake.move();
    if (this.isFoodEaten(this.ghostSnake)) {
      this.food.generateNewFood();
      this.ghostSnake.grow();
    }
  }
}
