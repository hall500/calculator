import React from "react";
import "./App.css";

const isOperator = /[x/+‑]/,
  endsWithOperator = /[x+‑/]$/,
  endsWithNegativeSign = /[x/+]‑$/;

const Display = (props) => {
  return <div id="display"> {props.current} </div>;
};

const Buttons = (props) => {
  return (
    <div className="Buttons">
      <button id="nine" onClick={props.numbers}>
        {""}
        9{""}
      </button>{""}
      <button id="eight" onClick={props.numbers}>
        {""}
        8{""}
      </button>{""}
      <button id="seven" onClick={props.numbers}>
        {""}
        7{""}
      </button>{""}
      <button id="add" className="operator" value="+" onClick={props.operator}>
        {""}
        +{""}
      </button>{""}
      <button id="six" onClick={props.numbers}>
        {""}
        6{""}
      </button>{""}
      <button id="five" onClick={props.numbers}>
        {""}
        5{""}
      </button>{""}
      <button id="four" onClick={props.numbers}>
        {""}
        4{""}
      </button>{""}
      <button
        id="subtract"
        className="operator"
        value="-"
        onClick={props.operator}
      >
        {""}
        -{""}
      </button>{""}
      <button id="three" onClick={props.numbers}>
        {""}
        3{""}
      </button>{""}
      <button id="two" onClick={props.numbers}>
        {""}
        2{""}
      </button>{""}
      <button id="one" onClick={props.numbers}>
        {""}
        1{""}
      </button>{""}
      <button
        id="divide"
        className="operator"
        value="/"
        onClick={props.operator}
      >
        {""}
        /
      </button>
      <button id="zero" onClick={props.numbers}>
        {""}
        0{""}
      </button>{""}
      <button id="decimal" onClick={props.decimal}>
        {""}
        .{""}
      </button>{""}
      <button id="clear" onClick={props.clear}>
        {""}
        AC{""}
      </button>{""}
      <button
        id="multiply"
        className="operator"
        value="*"
        onClick={props.operator}
      >
        {""}
        x{""}
      </button>{""}
      <button id="equals" value="=" onClick={props.evaluate}>
        ={""}
      </button>{""}
      <button id="on" onClick={props.power}>
        {""}
        ON{""}
      </button>{""}
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      power: true,
      current: "0",
      prev: "0",
      formula: "",
      currentSign: "pos",
      lastClicked: "",
      evaluated: false
    };
    this.initialize = this.initialize.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handlePower = this.handlePower.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.maxDigitsWarning = this.maxDigitsWarning.bind(this);
  }
  
 initialize(){
	 this.setState({
		 power: true,
		 current: "0",
		 prev: "0",
		 formula: "",
		 currentSign: "pos",
		 lastClicked: "",
		 evaluated: false
	 });
 }

  handlePower() {
    this.setState({
      power: !this.state.power,
      displayValue: this.state.power ? "" : "0",
    });
  }

  handleClear() {
    if (!this.state.power) return;

    this.initialize();
  }

  handleEvaluate() {
    console.log('formula', this.state.formula);
    console.log('current', this.state.current);
    return;
    if (!this.state.current.includes("Limit")) {
      let expression = this.state.formula;
      while (endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
      // eslint-disable-next-line no-eval
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
      this.setState({
        current: answer.toString(),
        formula: expression.replace(/\*/g, "⋅").replace(/-/g, "‑") + "=" + answer,
        prev: answer,
        evaluated: true
      });
    }
  }

  handleInput(e) {
    if (!this.state.current.includes("Limit")) {
      const { current, formula, evaluated } = this.state;
      const value = e.target.innerHTML;
      this.setState({ evaluated: false });
      if (current.length > 21) {
        this.maxDigitWarning();
      } else if (evaluated) {
        this.setState({
          current: value,
          formula: value !== "0" ? value : ""
        });
      } else {
        this.setState({
          current: current === "0" || isOperator.test(current) ? value : current + value,
          formula: current === "0" && value === "0" ? formula === "" ? value : formula : /([^.0-9]0|^0)$/.test(formula) ? formula.slice(0, -1) + value : formula + value
        });
      }
    }
  }

  handleDecimal() {
    if (this.state.evaluated === true) {
      this.setState({
        current: "0.",
        formula: "0.",
        evaluated: false
      });
    } else if (
      !this.state.current.includes(".") &&
      !this.state.current.includes("Limit")
    ) {
      this.setState({ evaluated: false });
      if (this.state.current.length > 21) {
        this.maxDigitWarning();
      } else if (
        endsWithOperator.test(this.state.formula) ||
        (this.state.current === "0" && this.state.formula === "")
      ) {
        this.setState({
          current: "0.",
          formula: this.state.formula + "0."
        });
      } else {
        this.setState({
          current: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
          formula: this.state.formula + "."
        });
      }
    }
  }

  handleOperator(e) {
    if (!this.state.current.includes("Limit")) {
      const value = e.target.innerHTML;
      const { formula, prev, evaluated } = this.state;
      this.setState({ current: value, evaluated: false });
      if (evaluated) {
        this.setState({ formula: prev + value });
      } else if (!endsWithOperator.test(formula)) {
        this.setState({
          prev: formula,
          formula: formula + value
        });
      } else if (!endsWithNegativeSign.test(formula)) {
        this.setState({
          formula: (endsWithNegativeSign.test(formula + value) ? formula : prev) + value
        });
      } else if (value !== "‑") {
        this.setState({
          formula: prev + value
        });
      }
    }
  }

  maxDigitsWarning() {
    this.setState({
      current: "Digit Limit Met",
      prev: this.state.current
    });
    setTimeout(() => this.setState({ current: this.state.prev }), 1000);
  }

  render() {
    return (
      <div className="Container">
        <Display current={this.state.current} />{""}
        <Buttons
          numbers={this.handleInput}
          clear={this.handleClear}
          decimal={this.handleDecimal}
          power={this.handlePower}
          evaluate={this.handleEvaluate}
          operator={this.handleOperator}
        />{""}
		<div className="author">
		Designed and coded by <span>Abdullah Momoh</span>
		</div>
      </div>
    );
  }
}

export default App;
