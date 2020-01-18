'use strict'


const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';
const SCORE_BOARD_ID = 'scoreBoard';

const getGrid = () => document.getElementById(GRID_ID);
const getBoard = () => document.getElementById(SCORE_BOARD_ID);

const getCellId = (colId, rowId) => `c${colId}_${rowId}`;
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
  cell.classList.remove('food');
};

const assignScore = function(score) {
  const scoreCard = document.getElementById('score');
  scoreCard.innerText = score;
}

const gameOver = () => {
  clearInterval(gameAnimation);
  clearInterval(randomlyTurn);
  const gameOver = document.createElement('div');
  gameOver.innerText = 'Game Over';
  gameOver.className = 'gameOver';
  document.body.appendChild(gameOver);
};

const updateSnake = function(snake) {
  eraseTail(snake);
  drawSnake(snake);
}

const updateFood = function(food) {
  drawFood(food);
  eraseFood(food);
}

const updateAndDrawGame = function(game) {
  game.moveSnake();
  game.moveGhostSnake();
  const { food, ghostSnake, snake, score } = game.getStatus();
  if (game.isGameOver()) {
    gameOver();
    return;
  }
  updateSnake(snake);
  updateSnake(ghostSnake);
  updateFood(food);
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

const randomlyTurnSnake = ghostSnake => {
  let x = Math.random() * 100;
  if (x > 50) {
    ghostSnake.turnLeft();
  }
};

let gameAnimation, randomlyTurn;

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food(40, 45, [0, 0], NUM_OF_COLS, NUM_OF_ROWS);
  const scoreCard = new ScoreCard(0);
  const game = new Game(snake, ghostSnake, food, scoreCard, NUM_OF_COLS, NUM_OF_ROWS);
  setup(game);
  gameAnimation = setInterval(updateAndDrawGame, 100, game);
  randomlyTurn = setInterval(randomlyTurnSnake, 200, game.ghostSnake);
};
