const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
const MOVE_UP = "U",
  MOVE_DOWN = "D",
  MOVE_LEFT = "L",
  MOVE_RIGHT = "R";

class Field {
  constructor(field) {
    this.field = field;
  }
  print() {
    this.field.forEach((row) => console.log(row.join("")));
  }

  static generateField(rows = 5, cols = 5, percentageOfHoles = 0.1) {
    const numberOfHoles = 1 / percentageOfHoles;
    const numberOfWhiteSpace = 1 / (1 - percentageOfHoles);
    const numberOfStates = numberOfHoles + numberOfWhiteSpace;
    function getRandomNumber(max) {
      return Math.floor(Math.random() * (max + 1));
    }

    const field = [...Array(rows)].map((e) =>
      [...Array(cols)].map((e) =>
        getRandomNumber(numberOfStates) > numberOfHoles ? "O" : "░"
      )
    );
    const colCount = field[0].length;
    const rowCount = field.length;
    field[getRandomNumber(rowCount - 1)][getRandomNumber(colCount - 1)] = hat;
    return new Field(field);
  }
  get colCount() {
    return this.field[0].length;
  }

  get rowCount() {
    return this.field.length;
  }
  getState({ x, y }) {
    const col = y;
    const row = x;
    return this.field[row][col];
  }
  setState({ x, y }, state) {
    this.field[x][y] = state;
  }
}

class Game {
  constructor(board = Field.generateField()) {
    this.board = board;
    this.width = board.ColRow;
    this.height = board.ColCount;
    this.history = [];
    this.player = { x: 0, y: 0 };
    this.state = "running";
    this.nextMove = { x: 0, y: 0 };
  }
  new() {
    this.constructor();
  }

  createBoard() {
    return Field.generateField(5, 5);
  }
  print() {
    this.board.print();
  }
  checkState() {
    const { x, y } = this.player;
    const char = this.board.getState({ x, y });
    if (char === hole) {
      return "lost";
    } else if (char === hat) {
      return "win";
    }

    return "running";
  }

  next() {
    this.player = this.nextMove;
    this.state = this.checkState();
    const state = this.state;

    if (state === "running") {
      this.board.setState(this.player, pathCharacter);
      this.print();
    } else if (state === "lost") {
      this.end();
    } else if (state === "win") {
      this.end();
    }
  }
  movePlayer(direction) {
    const playerLocation = this.player;
    const nextLocation = Object.assign(playerLocation);
    switch (direction) {
      case MOVE_UP:
        if (playerLocation.x > 0) nextLocation.x--;
        break;
      case MOVE_DOWN:
        if (playerLocation.x < this.board.rowCount - 1) nextLocation.x++;
        break;
      case MOVE_LEFT:
        if (playerLocation.y > 0) nextLocation.y--;
        break;
      case MOVE_RIGHT:
        if (playerLocation.y < this.board.colCount - 1) nextLocation.y++;
        break;
    }
    console.log(nextLocation);
    this.nextMove = nextLocation;

    this.next();
  }

  start() {
    // Set player on board
    this.board.setState(this.player, pathCharacter);
    this.print();
    const moves = [MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT];
    function isValidMove(input) {
      for (const move of moves) {
        if (move === input) {
          return true;
        }
      }
      return false;
    }
    while (this.state === "running") {
      console.log("Which way?");
      const input = prompt().toUpperCase();
      // CheckInput
      if (isValidMove(input)) {
        console.log("moving player to " + input);
        this.movePlayer(input);
        // Check state
      } else if (input === "exit") {
        break;
      } else {
        console.log("Invalid move");
      }
    }
    this.state = "end";
  }
  end() {
    console.log("ending game");
    console.log("player " + this.state);
  }
  reset() {
    this.constructor();
  }
}

const game = new Game();
game.start();
