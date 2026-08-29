(function () {
  "use strict";

  const expressionEl = document.getElementById("expression");
  const resultEl = document.getElementById("result");
  const buttons = document.querySelectorAll(".btn");

  // Calculator state
  let result = "0";
  let expression = "";
  let shouldResetDisplay = false;

  // ── Rendering ──
  function render() {
    const formatted = formatNumber(result);
    resultEl.textContent = formatted;
    expressionEl.textContent = expression || " ";

    // Dynamically shrink the number if it's too long
    resultEl.classList.toggle(
      "shrink",
      formatted.length > 14 || result.includes("\n")
    );
  }

  function formatNumber(numStr) {
    // If result already contains line break (multiple lines), don't reformat
    if (result.includes("\n")) return result.replace(/\n/g, " ");

    const [intPart, decPart] = String(numStr).split(".");
    let formattedInt = "";

    if (intPart.length > 18) {
      // Use scientific notation for very large numbers
      const sci = parseFloat(numStr).toExponential(6);
      return sci;
    }

    // Group by thousands (handles negative sign)
    let intStr = intPart.replace("-", "");
    for (let i = intStr.length; i > 0; i -= 3) {
      formattedInt =
        (i - 3 > 0 ? "," : "") + intStr.slice(Math.max(0, i - 3), i) + formattedInt;
    }
    if (intPart.startsWith("-")) formattedInt = "-" + formattedInt;

    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  }

  // ── Helpers ──
  function inputDigit(digit) {
    if (result === "0" || shouldResetDisplay) {
      result = digit;
      shouldResetDisplay = false;
    } else {
      result += digit;
    }
  }

  function appendDecimal() {
    if (shouldResetDisplay) {
      result = "0.";
      shouldResetDisplay = false;
      return;
    }
    if (!result.includes(".")) result += ".";
  }

  function appendOperator(opSymbol) {
    // Don't append operator right after equals (start fresh)
    if (shouldResetDisplay && expression) {
      calculate();
    }

    const lastChar = expression.slice(-1);

    // Replace last operator if operator button pressed again
    if (/[+\-*/]/.test(lastChar)) {
      expression = expression.slice(0, -1);
    }

    expression += " " + opSymbol;
    shouldResetDisplay = true;
  }

  function calculate() {
    if (!expression || shouldResetDisplay) return;

    const expr = expression.replace(/÷/g, "/").replace(/×/g, "*");

    // Safety: only allow digits, operators, parentheses, decimal, spaces
    if (!/^[0-9.+\-*/()\s]+$/.test(expr)) {
      // If invalid expression, just clear
      resetCalculator();
      return;
    }

    try {
      // eslint-disable-next-line no-eval
      let value = Function('"use strict"; return (' + expr + ")")();

      if (!isFinite(value)) {
        throw new Error("Invalid result");
      }

      // Limit to 12 significant digits to avoid floating-point noise
      if (value !== 0) {
        value = Number(parseFloat(value.toPrecision(14)));
      }

      // Round tiny floating-point artifacts
      if (Math.abs(value) < 1e-13) value = 0;

      result = String(value);
      expression = "";
      shouldResetDisplay = true;
    } catch (e) {
      result = "Error";
      expression = "";
      shouldResetDisplay = true;
    }
  }

  function applyPercent() {
    if (shouldResetDisplay) {
      // Apply percent to the previous result in expression
      const prevNumber = expression.slice(expression.lastIndexOf(" ") + 1);
      if (prevNumber) {
        const val = parseFloat(prevNumber);
        result = String(val / 100);
      }
      return;
    }
    result = String(parseFloat(result) / 100);
  }

  function resetCalculator() {
    result = "0";
    expression = "";
    shouldResetDisplay = false;
  }

  function handleButton(el) {
    const action = el.dataset.action;
    const number = el.dataset.number;
    const op = el.dataset.op;

    if (number !== undefined) {
      inputDigit(number);
    } else if (action === "decimal") {
      appendDecimal();
    } else if (action === "equals") {
      calculate();
    } else if (action === "clear") {
      resetCalculator();
    } else if (action === "percent") {
      applyPercent();
    } else if (op !== undefined) {
      appendOperator(
        op === "/" ? "÷" : op === "*" ? "×" : op
      );
    }

    render();
  }

  // ── Event Listeners ──
  buttons.forEach((btn) => btn.addEventListener("click", () => handleButton(btn)));

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (/\d/.test(key)) {
      handleButton({ dataset: { number: key } });
    } else if (key === ".") {
      handleButton({ dataset: { action: "decimal" } });
    } else if (key === "=" || key === "Enter") {
      handleButton({ dataset: { action: "equals" } });
    } else if (key === "Escape") {
      handleButton({ dataset: { action: "clear" } });
    } else if (key === "Backspace") {
      handleButton({ dataset: { action: "clear" } });
    } else if (key === "%") {
      handleButton({ dataset: { action: "percent" } });
    } else if (key === "+" || key === "-") {
      handleButton({
        dataset: { op: key === "+" ? "+" : "-" }
      });
    } else if (key === "*") {
      handleButton({ dataset: { op: "*" } });
    } else if (key === "/") {
      handleButton({ dataset: { op: "/" } });
    }
  });

  // ── Init ──
  function init() {
    result = "0";
    expression = "";
    shouldResetDisplay = false;
    render();
  }

  init();
})();
