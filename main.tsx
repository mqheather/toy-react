import {ToyReact, Component} from './ToyReact'
import './main.css'

class Square extends Component {ßß
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }
  render() {
      return (
          <button className="square"
          onClick={() => this.setState({value: 'X'})}>
          {this.state.vaule ? this.state.value: ""}
          </button>
      );
  }
}

class Board extends Component {
    renderSquare(i) {
        return <Square value={i} />;
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }


let a = <Board/>

console.log(a);
ToyReact.render(a, document.body);
console.log(ToyReact.name);
console.log(ToyReact.createElement('span', {name: "Heather"}))