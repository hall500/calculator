import React from 'react';
import './App.css';

const calculations = {
  '/': (first, second) => first/second,
  '*': (first, second) => first * second,
  '+': (first, second) => first + second,
  '-': (first, second) => first - second,
  '=': (first, second) => second
};

const Display = (props) => {
	return (
	<div id="display">{props.currentValue}</div>
	);
}

const Buttons = (props) => {
	return (
	<div className="Buttons">
		<button id="nine" onClick={props.numbers}>9</button>
		<button id="eight" onClick={props.numbers}>8</button>
		<button id="seven" onClick={props.numbers}>7</button>
		<button id="add" className="operator" value="+" onClick={props.operator}>+</button>
		<button id="six" onClick={props.numbers}>6</button>
		<button id="five" onClick={props.numbers}>5</button>
		<button id="four" onClick={props.numbers}>4</button>
		<button id="subtract" className="operator" value="-" onClick={props.operator}>-</button>
		<button id="three" onClick={props.numbers}>3</button>
		<button id="two" onClick={props.numbers}>2</button>
		<button id="one" onClick={props.numbers}>1</button>
		<button id="divide" className="operator" value="/" onClick={props.operator}>/</button>
		<button id="zero" onClick={props.numbers}>0</button>
		<button id="decimal" onClick={props.decimal}>.</button>
		<button id="clear" onClick={props.clear}>AC</button>
		<button id="multiply" className="operator" value="*" onClick={props.operator}>x</button>
		<button id="equals" value="=" onClick={props.operator}>=</button>
		<button id="on" onClick={props.power}>ON</button>
	</div>
	);
}

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			power: true,
			displayValue: "0",
			firstOperand: null,
			waitingForSecondOperand: false,
			operator: null
		}
		this.handleClear = this.handleClear.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleDecimal = this.handleDecimal.bind(this);
		this.handlePower = this.handlePower.bind(this);
		this.handleOperator = this.handleOperator.bind(this);
		this.compute = this.compute.bind(this);
		this.maxDigits = this.maxDigits.bind(this);
	}
	
	handlePower(){
		this.setState({
			power: !this.state.power,
			displayValue: (this.state.power) ? "" : "0"
		});
	}
	
	handleClear(){
		if(!this.state.power) return;
		
		this.setState({
			displayValue: '0',
			firstOperand: null,
			waitingForSecondOperand: false,
			operator: null
		});
	}
	
	handleInput(e){
		e.preventDefault();
		if(!this.state.power) return;
		
		const digit = e.target.innerHTML;
		const { displayValue, waitingForSecondOperand } = this.state;
		
		if(waitingForSecondOperand){
			this.setState({
				displayValue: digit,
				waitingForSecondOperand: false
			});
		}else{
			const val = displayValue === '0' ? digit : displayValue + digit
			this.setState({
				displayValue: val
			});
		}
		
	}
	
	handleDecimal(){
		if(!this.state.power) return;
		
		if(this.state.waitingForSecondOperand) return;
		
		if(!this.state.displayValue.includes('.')){
			this.setState({
				displayValue: this.state.displayValue + '.'
			});
		}
	}
	
	handleOperator(e){
		if(!this.state.power) return;
		
		const nextOperator = e.target.value;
		const { firstOperand, displayValue, operator } = this.state;
		let secondOperand = parseFloat(displayValue);
		
		if(operator && this.state.waitingForSecondOperand){
			this.setState({
				operator: nextOperator
			});
			return;
		}
		
		if(firstOperand === null){
		  this.setState({
			  displayValue: nextOperator,
			  firstOperand: secondOperand,
			  waitingForSecondOperand: true,
			  operator: nextOperator
		  });
		}else if (operator){
		  const currentValue = firstOperand || 0;
		  const result = calculations[operator](currentValue, secondOperand);
		  this.setState({
			  displayValue: String(result),
			  firstOperand: result,
			  waitingForSecondOperand: true,
			  operator: nextOperator
		  });
		}
		console.log(this.state);
	}
	
	compute(){
		
	}
	
	maxDigits(){
		this.setState();
	}
	
	render(){
	  return (
	  <div className="Container">
		  <Display currentValue={this.state.displayValue} />
		  <Buttons numbers={this.handleInput} clear={this.handleClear} decimal={ this.handleDecimal } power={ this.handlePower } operator={ this.handleOperator }/>
	  </div>
	  );
	}
}

export default App;
