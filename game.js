'use strict'

class Game {
  constructor(snake, ghostSnake, food, scoreCard) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.scoreCard = scoreCard;
    this.isGameOver = false;
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
    const snakeLocation = this.snake.location;
    const foodLocation = this.food.position;
    return snakeLocation.some(part =>
      part.every((coordinate, index) => coordinate === foodLocation[index])
    );
  }

  moveSnake() {
    this.snake.move();
    this.isGameOver = this.snake.hasCrossedBoundaries()
    if (this.isFoodEaten()) {
      this.food.generateNewFood();
      this.snake.grow();
      this.scoreCard.update(1);
    }
  }
}
