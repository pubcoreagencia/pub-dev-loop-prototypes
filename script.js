class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0' || this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (number === '0' && this.currentOperand === '0') return;
        if (this.currentOperand === '0') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.previousOperand = '';
        this.operation = undefined;
    }

    appendDecimal() {
        if (this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0') {
            this.currentOperand = '0.';
        } else {
            this.currentOperand = this.currentOperand.toString() + '.';
        }
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-action="number"]');
const operationButtons = document.querySelectorAll('[data-action="operation"]');
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const decimalButton = document.querySelector('[data-action="decimal"]');

const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operation);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

decimalButton.addEventListener('click', () => {
    calculator.appendDecimal();
    calculator.updateDisplay();
});

document.addEventListener('keydown', event => {
    if (event.key >= 0 && event.key <= 9) {
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    }
    if (event.key === '+') {
        calculator.chooseOperation('+');
        calculator.updateDisplay();
    }
    if (event.key === '-') {
        calculator.chooseOperation('−');
        calculator.updateDisplay();
    }
    if (event.key === '*') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
    }
    if (event.key === '/') {
        event.preventDefault();
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
    }
    if (event.key === '.' || event.key === ',') {
        calculator.appendDecimal();
        calculator.updateDisplay();
    }
    if (event.key === 'Enter' || event.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    }
    if (event.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    if (event.key === 'Escape' || event.key === 'Delete') {
        calculator.clear();
        calculator.updateDisplay();
    }
});
