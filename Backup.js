//getting History and results on the screen
function getHistory() {
  return document.getElementById("history-value-1").innerText;
}
function printHistory(num) {
  document.getElementById("history-value-1").innerText = num;
}
function getHistory2() {
  return document.getElementsByClassName("history-value-2").innerText;
}
function printHistory2(num) {
  document.getElementsByClassName("history-value-2").innerText = num;
}
function getOutput() {
  return document.getElementById("output-valuet").innerText;
}
function printOutput(num) {
  document.getElementById("output-valuet").innerText = num;
}
//Delete Button
var backSpace = document.getElementById("delete");
backSpace.addEventListener("click", function() {
  var output = getOutput();
  if (output != "" && this.id == "delete") {
    output = output.substring(0, output.length - 1);
    printOutput(output);
  }
});
//operators
var operator = document.getElementsByClassName("operator");
for (var i = 0; i < operator.length; i++) {
  operator[i].addEventListener("click", function() {
    if (this.id == "clear") {
      printHistory("");
      printOutput("");
    } else if (this.id == "^") {
      var output = getOutput();
      var history = getHistory();
      var history2 = getHistory2();
      history = output;
      history2 = this.id;
      printHistory(history);
      printOutput(history2);
    } else {
      var output = getOutput();
      var history = getHistory();
      var history2 = getHistory2();

      if (history != "" || output != "" || history !== "^") {
        num1 = history;
        num2 = output;
        history = history + output;
        if (this.id == "equal" && this.id != "%") {
          if (history2 == null) {
            // For Power Operator
            num3 = num2.replace("^", "");
            num4 = num2.substring(0, num2.length - 1);
            var result = Math.pow(num1, num3);
            printOutput(result);
            printHistory("");
          }
          if (num4 == "^") {
            // For Power Operator Results
            printOutput(result);
            printHistory("");
          } else {
            // For All Other Results
            var result = eval(history);
            printOutput(result);
            printHistory("");
          }
        } else if (this.id == "%") {
          result = output / 100;
          printOutput(result);
          printHistory("");
        } else {
          history = history + this.id;
          printHistory(history);
          printOutput("");
        }
      }
    }
  });
}
// Numbers
var number = document.getElementsByClassName("number");
for (var i = 0; i < number.length; i++) {
  number[i].addEventListener("click", function() {
    var output = getOutput();
    if (output != NaN) {
      output = output + this.id;
      printOutput(output);
    } else {
    }
  });
}
