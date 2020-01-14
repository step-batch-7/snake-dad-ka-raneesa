const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

class Direction {
  constructor(initialHeading) {
    this.heading = initialHeading;
    this.deltas = {};
    this.deltas[EAST] = [1, 0];
    this.deltas[WEST] = [-1, 0];
    this.deltas[NORTH] = [0, -1];
    this.deltas[SOUTH] = [0, 1];
  }

  get delta() {
    return this.deltas[this.heading];
  }

  turnLeft() {
    this.heading = (this.heading + 1) % 4;
  }
}

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

class ScoreCard {
  constructor(score) {
    this.score = score;
  }

  get points() {
    return this.score;
  }

  update(points) {
    this.score += points;
  }
}

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

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';
const SCORE_BOARD_ID = 'scoreBoard';

const getGrid = () => document.getElementById(GRID_ID);
const getBoard = () => document.getElementById(SCORE_BOARD_ID);

const getCellId = (colId, rowId) => colId + '_' + rowId;
const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const drawFood = function(food) {
  let [colId, rowId] = food.location;
  const cell = getCell(colId, rowId);
  cell.classList.add("food");
}

const eraseFood = function(food) {
  let [colId, rowId] = food.previousLocation;
  const cell = getCell(colId, rowId);
  cell.classList.remove("food");
};

const assignScore = function(score) {
  const scoreCard = document.getElementById('score');
  scoreCard.innerText = score;
}

const gameOver = () => {
  document.body.removeChild(getGrid());
  const gameOver = document.createElement('div');
  gameOver.innerText = 'Game Over';
  gameOver.className = 'gameOver';
  document.body.appendChild(gameOver);
};

const updateAndDrawGame = function(game) {
  const { food, snake, score } = game.getStatus();
  if (game.isGameOver) {
    clearInterval(gameAnimation);
    gameOver();
    return;
  }
  game.moveSnake();
  eraseTail(snake);
  eraseFood(food);
  drawSnake(snake);
  drawFood(food);
  assignScore(score);
};

const attachEventListeners = game => {
  document.body.onkeydown = () => game.turnSnakeLeft();
};

const createScoreBoard = function() {
  const scoreBoard = getBoard();
  const scoreCard = document.createElement('div');
  scoreCard.id = 'score';
  scoreBoard.innerText = 'Score:';
  scoreBoard.appendChild(scoreCard);
}

const initSnake = () => {
  const snakePosition = [
    [40, 25],
    [41, 25],
    [42, 25]
  ];
  return new Snake(snakePosition, new Direction(EAST), "snake");
};
const initGhostSnake = () => {
  const ghostSnakePosition = [
    [40, 30],
    [41, 30],
    [42, 30]
  ];
  return new Snake(ghostSnakePosition, new Direction(SOUTH), "ghost");
};

const setup = game => {
  attachEventListeners(game);
  createGrids();
  createScoreBoard();
  updateAndDrawGame(game);
};

const animateSnakes = game => {
  updateAndDrawGame(game);
};

// const randomlyTurnSnake = ghostSnake => {
//   let x = Math.random() * 100;
//   if (x > 80) {
//     ghostSnake.turnLeft();
//   }
// };

let gameAnimation;

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food(99, 25, [0, 0]);
  const scoreCard = new ScoreCard(0);
  const game = new Game(snake, ghostSnake, food, scoreCard);
  setup(game);
  gameAnimation = setInterval(animateSnakes, 100, game);
  // setInterval(randomlyTurnSnake, 200, ghostSnake);
};
