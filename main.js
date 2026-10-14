// A small calculator that works on numbers, not strings, so there is no eval().

const MAX_DIGITS = 15;
const SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷", "^": "^" };

const historyEl = document.getElementById("history");
const outputEl = document.getElementById("output");

let state = {
  current: "0", // what is being typed, as a string
  previous: null, // the left-hand number, once an operator is picked
  operator: null,
  waiting: false, // true right after an operator, until the next number is typed
  justEvaluated: false,
};

function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? NaN : a / b;
    case "^": return Math.pow(a, b);
  }
  return b;
}

// Round away floating point noise like 0.1 + 0.2 = 0.30000000000000004.
function format(value) {
  if (!Number.isFinite(value)) return "Error";
  const rounded = parseFloat(value.toPrecision(12));
  const text = String(rounded);
  return text.length > MAX_DIGITS ? rounded.toExponential(6) : text;
}

function render() {
  outputEl.textContent = state.current;
  outputEl.classList.toggle("is-long", state.current.length > 9);
  historyEl.textContent =
    state.operator !== null ? `${format(state.previous)} ${SYMBOLS[state.operator]}` : "";
  document.querySelectorAll(".key--op").forEach((key) => {
    key.classList.toggle("is-active", key.dataset.op === state.operator && state.waiting);
  });
}

function startFresh() {
  if (state.waiting || state.justEvaluated || state.current === "Error") {
    state.current = "0";
    state.waiting = false;
    state.justEvaluated = false;
  }
}

function inputDigit(digit) {
  startFresh();
  if (state.current.replace(/[-.]/g, "").length >= MAX_DIGITS) return;
  state.current = state.current === "0" ? digit : state.current + digit;
}

function inputDecimal() {
  startFresh();
  if (!state.current.includes(".")) state.current += ".";
}

function chooseOperator(op) {
  if (state.current === "Error") return;
  const value = parseFloat(state.current);
  if (state.operator === null || state.justEvaluated) {
    state.previous = value;
  } else if (!state.waiting) {
    // Chain operations: 2 + 3 + shows 5 before the next number.
    state.previous = calculate(state.previous, value, state.operator);
  }
  state.operator = op;
  state.current = format(state.previous);
  state.waiting = true;
  state.justEvaluated = false;
}

function equals() {
  if (state.operator === null || state.waiting) return;
  const result = calculate(state.previous, parseFloat(state.current), state.operator);
  historyEl.textContent = "";
  state = { current: format(result), previous: null, operator: null, waiting: false, justEvaluated: true };
}

// 50 % → 0.5, and 200 + 10 % → 200 + 20, like most phone calculators.
function percent() {
  if (state.current === "Error" || state.waiting) return;
  const value = parseFloat(state.current);
  const base = state.operator === "+" || state.operator === "-" ? state.previous : 1;
  state.current = format((base * value) / 100);
}

function backspace() {
  if (state.waiting) return;
  if (state.justEvaluated || state.current === "Error") {
    state.current = "0";
    state.justEvaluated = false;
    return;
  }
  state.current = state.current.length > 1 ? state.current.slice(0, -1) : "0";
  if (state.current === "-") state.current = "0";
}

function clear() {
  state = { current: "0", previous: null, operator: null, waiting: false, justEvaluated: false };
}

function handle(key) {
  if (key.digit !== undefined) inputDigit(key.digit);
  else if (key.op) chooseOperator(key.op);
  else if (key.action === "decimal") inputDecimal();
  else if (key.action === "equals") equals();
  else if (key.action === "percent") percent();
  else if (key.action === "delete") backspace();
  else if (key.action === "clear") clear();
  render();
}

document.querySelector(".keys").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button) handle(button.dataset);
});

const KEYBOARD = {
  Enter: { action: "equals" },
  "=": { action: "equals" },
  Backspace: { action: "delete" },
  Escape: { action: "clear" },
  ".": { action: "decimal" },
  ",": { action: "decimal" },
  "%": { action: "percent" },
};

document.addEventListener("keydown", (event) => {
  let key = null;
  if (/^\d$/.test(event.key)) key = { digit: event.key };
  else if (event.key in SYMBOLS) key = { op: event.key };
  else if (event.key in KEYBOARD) key = KEYBOARD[event.key];
  if (!key) return;
  event.preventDefault();
  handle(key);
});

render();
