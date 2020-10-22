import React, { Component } from "react";
import Board from "./Board";
import "./sandbox.css";

export default class sandbox extends Component {
  state = {
    board: [
      [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
      ],
      [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
      ],
    ],
    p1Health: 17,
    p2Health: 17,
    gameover: false,
    player: 1,
    ships: [
      {
        sm: {
          horizontal: false,
          health: 2,
        },
        m1: {
          horizontal: false,
          health: 3,
        },
        m2: {
          horizontal: false,
          health: 3,
        },
        lg: {
          horizontal: false,
          health: 3,
        },
        bs: {
          horizontal: false,
          health: 5,
        },
      },
      {
        sm: {
          horizontal: false,
          health: 2,
        },
        m1: {
          horizontal: false,
          health: 3,
        },
        m2: {
          horizontal: false,
          health: 3,
        },
        lg: {
          horizontal: false,
          health: 4,
        },
        bs: {
          horizontal: false,
          health: 5,
        },
      },
    ],
  };

  checkHit(x, y, player) {
    if (player === 0) {
      const cell = this.state.board[0][y][x];
      if (cell > 1) {
        this.setState({
          p1Health: this.state.p1Health - 1,
        });
        return 8;
      } else return 0; //miss
    } else {
      const cell = this.state.board[1][y][x];
      if (cell > 1) {
        this.setState({
          p2Health: this.state.p2Health - 1,
        });
        return 8;
      } else return 0; //miss
    }
  }

  changePlayer() {
    if (this.state.player === 1) {
      this.setState({ player: 0 });
    } else {
      this.setState({ player: 1 });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let x = document.getElementById("x").value;
    let y = document.getElementById("y").value;
    let p1Board = this.state.board[0]; //!temp removed change player
    p1Board[y][x] = this.checkHit(x, y, 0);

    this.setState({
      board: p1Board,
    });

    //this.changePlayer();

    this.getDumbAiMove();

    console.log(
      "sandbox -> handleSubmit -> this.state.p1Health",
      this.state.p1Health
    );
    console.log(
      "sandbox -> handleSubmit -> this.state.p1Health",
      this.state.p2Health
    );

    if (this.state.p1Health <= 0) {
      this.setState({
        gameover: true,
      });
    }

    if (this.state.p2Health <= 0) {
      this.setState({
        gameover: true,
      });
    }
  };

  generateBoard(player) {
    this.setBs(0);
    this.setBs(1);
    this.setLg(0);
    this.setLg(1);
    this.setMd2(0);
    this.setMd2(1);
    this.setMd1(0);
    this.setMd1(1);
    this.setSm(0);
    this.setSm(1);
  }

  setSm(player) {
    let board = this.state.board;
    let validMove = false;
    let x = 0;
    let y = 0;
    let horizontal = false;

    while (!validMove) {
      y = Math.floor(Math.random() * 7) + 1;
      console.log("2 sandbox -> setSm -> y", y);
      x = Math.floor(Math.random() * 7) + 1;
      console.log("2 sandbox -> setSm -> x", x);
      horizontal = Math.random() < 0.5;

      if (!horizontal) {
        if (board[y][x] === 1 && board[y - 1][x] === 1) {
          board[y][x] = 2;
          board[y - 1][x] = 2;
          this.setState({ board: board });
          validMove = true;
        }
      } else {
        if (board[y][x] === 1 && board[y][x - 1] === 1) {
          board[y][x] = 2;
          board[y][x - 1] = 2;
          this.setState({ board: board });
          validMove = true;
        }
      }
    }
  }

  setMd1(player) {
    let board = this.state.board;
    let validMove = false;
    let x = 0;
    let y = 0;
    let horizontal = true;

    while (!validMove) {
      y = Math.floor(Math.random() * 6) + 2;
      console.log("3 sandbox -> y", y);
      x = Math.floor(Math.random() * 6) + 2;
      console.log("3 sandbox -> x", x);
      horizontal = Math.random() < 0.5;

      if (!horizontal) {
        if (
          board[y][x] === 1 &&
          board[y - 1][x] === 1 &&
          board[y - 2][x] === 1
        ) {
          board[y][x] = 3;
          board[y - 1][x] = 3;
          board[y - 2][x] = 3;
          this.setState({ board: board });
          validMove = true;
        }
      } else {
        if (
          board[y][x] === 1 &&
          board[y][x - 1] === 1 &&
          board[y][x - 2] === 1
        ) {
          board[y][x] = 3;
          board[y][x - 1] = 3;
          board[y][x - 2] = 3;
          this.setState({ board: board });
          validMove = true;
        }
      }
    }
  }

  setMd2(player) {
    let board = this.state.board;
    let validMove = false;
    let x = 0;
    let y = 0;
    let horizontal = true;

    while (!validMove) {
      y = Math.floor(Math.random() * 6) + 2;
      console.log("3 sandbox -> y", y);
      x = Math.floor(Math.random() * 6) + 2;
      console.log("3 sandbox -> x", x);
      horizontal = Math.random() < 0.5;

      if (!horizontal) {
        if (
          board[y][x] === 1 &&
          board[y - 1][x] === 1 &&
          board[y - 2][x] === 1
        ) {
          board[y][x] = 7;
          board[y - 1][x] = 7;
          board[y - 2][x] = 7;
          this.setState({ board: board });
          validMove = true;
        }
      } else {
        if (
          board[y][x] === 1 &&
          board[y][x - 1] === 1 &&
          board[y][x - 2] === 1
        ) {
          board[y][x] = 7;
          board[y][x - 1] = 7;
          board[y][x - 2] = 7;
          this.setState({ board: board });
          validMove = true;
        }
      }
    }
  }

  setLg(player) {
    let board = this.state.board;
    let validMove = false;
    let x = 0;
    let y = 0;
    let horizontal = true;

    while (!validMove) {
      y = Math.floor(Math.random() * 5) + 3;
      console.log("3 sandbox -> y", y);
      x = Math.floor(Math.random() * 5) + 3;
      console.log("3 sandbox -> x", x);
      horizontal = Math.random() < 0.5;

      if (!horizontal) {
        if (
          board[y][x] === 1 &&
          board[y - 1][x] === 1 &&
          board[y - 2][x] === 1 &&
          board[y - 3][x] === 1
        ) {
          board[y][x] = 4;
          board[y - 1][x] = 4;
          board[y - 2][x] = 4;
          board[y - 3][x] = 4;
          this.setState({ board: board });
          validMove = true;
        }
      } else {
        if (
          board[y][x] === 1 &&
          board[y][x - 1] === 1 &&
          board[y][x - 2] === 1 &&
          board[y][x - 3] === 1
        ) {
          board[y][x] = 4;
          board[y][x - 1] = 4;
          board[y][x - 2] = 4;
          board[y][x - 3] = 4;
          this.setState({ board: board });
          validMove = true;
        }
      }
    }
  }

  setBs(player) {
    let board = this.state.board;
    let validMove = false;
    let x = 0;
    let y = 0;
    let horizontal = true;

    while (!validMove) {
      y = Math.floor(Math.random() * 4) + 4;
      console.log("3 sandbox -> y", y);
      x = Math.floor(Math.random() * 4) + 4;
      console.log("3 sandbox -> x", x);
      horizontal = Math.random() < 0.5;

      if (!horizontal) {
        if (
          board[y][x] === 1 &&
          board[y - 1][x] === 1 &&
          board[y - 2][x] === 1 &&
          board[y - 3][x] === 1 &&
          board[y - 4][x] === 1
        ) {
          board[y][x] = 5;
          board[y - 1][x] = 5;
          board[y - 2][x] = 5;
          board[y - 3][x] = 5;
          board[y - 4][x] = 5;
          this.setState({ board: board });
          validMove = true;
        }
      } else {
        if (
          board[y][x] === 1 &&
          board[y][x - 1] === 1 &&
          board[y][x - 2] === 1 &&
          board[y][x - 3] === 1 &&
          board[y][x - 4] === 1
        ) {
          board[y][x] = 5;
          board[y][x - 1] = 5;
          board[y][x - 2] = 5;
          board[y][x - 3] = 5;
          board[y][x - 4] = 5;
          this.setState({ board: board });
          validMove = true;
        }
      }
    }
  }

  componentDidMount() {
    this.generateBoard();
  }

  getDumbAiMove() {
    let board = this.state.board;
    let validMove = false;
    let x = 0;
    let y = 0;
    let cell;

    while (!validMove) {
      y = Math.floor(Math.random() * 8);
      x = Math.floor(Math.random() * 8);
      cell = board[1][y][x];

      if (cell !== 0 && cell !== 8) {
        validMove = true;
      }
    }

    board[1][y][x] = this.checkHit(x, y, 1);

    this.setState({
      board: board,
    });
  }

  render() {
    return (
      <div className="sandbox">
        {" "}
        AI board:
        <Board
          board={this.state.board[0]}
          key={this.state.board}
          className="test"
        ></Board>
        Player board:
        <Board board={this.state.board[1]} key={this.state.board + 1}></Board>
        <form className="attackForm">
          <label>
            {this.state.gameover && <p>Game Over</p>}
            <br />
            x:
            <input type="text" name="x" id="x" />
            y:
            <input type="text" name="y" id="y" />
          </label>
          <input
            className="submit"
            type="submit"
            value="Submit"
            onClick={this.handleSubmit}
          />
        </form>
      </div>
    );
  }
}
