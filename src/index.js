import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import computerMove from './Components/Computer.js';
import Board from './Components/Board';
import calculateWinner from './util/calculateWinner';

// 'X' always starts

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      computerSym: false, // false means the computer is not playing
      showSetup: ""
    };
  }

  handleClick = (i, computerSym=false) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    if (this.state.stepNumber % 2 === 0) {
      squares[i] = 'X';
    } else {
      squares[i] = 'O';
    }
    this.setState(prevState => ({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      computerSym: prevState.computerSym,
    }));

    // console.log(`computerSym is ${computerSym}`);
    // console.log(`We are on step ${this.state.stepNumber} and computerSym is ${computerSym}`);
  }

  jumpTo = (step, computerSym) => {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      computerSym: computerSym
    });
  }

  handleComputerSetup = (sym) => {
    this.jumpTo(0, sym);
    this.render();
  }

  toggleSetup = (e) => {
    this.setState({
      showSetup: this.state.showSetup ? "" : "hide"
    });
  }

  compTurn = () => { // Checks if it's the computers go and triggers the move if so
    let sym = this.state.computerSym;
    if ((sym === 'X' && this.state.xIsNext)
      || (sym === 'O' && !this.state.xIsNext)){
        let i = computerMove(this.state.history[this.state.history.length - 1].squares, sym);
        console.log(`Computer suggests move ${i}`);
        this.handleClick(i-1, sym);
        return true;
    }
    return false;
  }

  componentDidUpdate() {
    console.log('Component updated');
    this.compTurn();
  }

  render() {
    console.log('Render');
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move :
      'Start new game';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move, this.state.computerSym)}>{desc}</button>
        </li>
      );
    }); // Need to check computerSym

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div id="game-setup" className={this.state.showSetup} onClick={this.toggleSetup}>
          <button onClick={() => this.jumpTo(0, false)}>Play against a friend</button><br/>
          <button onClick={() => this.handleComputerSetup('O')}>Play as X against the computer</button>
          <button onClick={() => this.handleComputerSetup('X')}>Play as O against the computer</button>
        </div>
        <div id="new-game">
          <button onClick={this.toggleSetup}>New game</button>
        </div>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>

        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
