let mapOfVars = new Map();
const slider = document.getElementById("fcont");
let out = false;
let subF = 0;
let ordinea = 0;
let distinctVars = 0;
const letters = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const operators = ["!", "&", "|", "/", "~"];

const rasp1 = document.createElement("h1");
rasp1.style.textAlign = "center";
document.getElementById("1st").append(rasp1);

const table = document.createElement("table");
document.getElementById("5th").append(table);
table.style.justifyContent = "center";

const rasp2 = document.createElement("h1");
rasp2.style.textAlign = "center";
document.getElementById("2nd").append(rasp2);

const rasp3 = document.createElement("h1");
rasp3.style.textAlign = "center";
document.getElementById("3rd").append(rasp3);

const rasp4 = document.createElement("h1");
rasp4.style.textAlign = "center";
document.getElementById("4th").append(rasp4);

function slide() {
  if (out) {
    out = false;
    document.getElementById("fcont").style.transform = "translate(0px,0px)";
  } else {
    out = true;
    document.getElementById("fcont").style.transform = "translate(0px,120px)";
  }
}

function nVar() {
  const formula = document
    .getElementById("formulaInput")
    .value.replace(/\s+/g, "");
  subF = 0;
  let formulaE = formula;
  ordinea = 0;
  distinctVars = [];
  mapOfVars.clear();
  let answers = [];

  for (let char of formula) {
    asign(char);
  }
  rezolva1234(); //rezolvarea  1 2 3 4

  tableToInsert = assignEachValueTF(distinctVars); // tabelul de valori pt tabelul de adevar

  createTable(table, tableToInsert, distinctVars); // crearea tab de adevar
  for (let i = 0; i < tableToInsert.length; i++) {
    formulaE = changeVars(distinctVars, tableToInsert[i], formula); //INLOCUIREA VAL CU PRIMA COL
    console.log("* changed formula  " + formulaE);

    formulaE = replaceSolved(formulaE);

    console.log("solved answer ..." + formulaE);
    answers.push(formulaE);
  }
  console.log(answers);
  addToLastColumn(table, answers);

  console.log("original formula ..." + formula);
}

function solve(formula) {
  //TO DO : make for all variables

  let formulaArray = formula.split("");

  evaluateNot(formulaArray);
  console.log("solving ...");

  for (let i = 0; i < formulaArray.length; i++) {
    if (formulaArray[i] === "&") {
      const result = and(
        Number(formulaArray[i - 1]),
        Number(formulaArray[i + 1])
      );
      formulaArray[i - 1] = result;
      formulaArray.splice(i, 2);
      i--;
    } else if (formulaArray[i] === "|") {
      const result = or(
        Number(formulaArray[i - 1]),
        Number(formulaArray[i + 1])
      );
      formulaArray[i - 1] = result;
      formulaArray.splice(i, 2);
      i--;
    } else if (formulaArray[i] === "/") {
      const result = imp(
        Number(formulaArray[i - 1]),
        Number(formulaArray[i + 1])
      );
      formulaArray[i - 1] = result;
      formulaArray.splice(i, 2);
      i--;
    } else if (formulaArray[i] === "~") {
      const result = eqv(
        Number(formulaArray[i - 1]),
        Number(formulaArray[i + 1])
      );
      formulaArray[i - 1] = result;
      formulaArray.splice(i, 2);
      i--;
    }
  }
  return formulaArray[0];
}
function replaceSolved(formula) {
  console.log("+ Replacing solved mini-formulas...");

  if (formula.includes("(")) {
    let miniFormulas = subdiv(formula);
    console.log("Mini formulas found: " + miniFormulas);

    if (miniFormulas.length > 0) {
      let i = miniFormulas.length - 1;
      let mini = miniFormulas[i];
      console.log("+ Solving mini-formula: " + mini);

      let result = solve(mini);
      console.log("+ Replacing " + mini + " with result: " + result);

      formula = formula.replaceAll("(" + miniFormulas[i] + ")", result);

      console.log("+ Updated formula: " + formula);

      return replaceSolved(formula);
    }
  }

  console.log("+ Solving final formula: " + formula);
  return solve(formula);
}

function evaluateNot(formulaArray) {
  for (let i = 0; i < formulaArray.length; i++) {
    if (formulaArray[i] === "!") {
      const result = not(Number(formulaArray[i + 1]));
      formulaArray[i + 1] = result;
      formulaArray.splice(i, 1);
      i--;
    }
  }
}
function asign(char) {
  if (mapOfVars.has(char)) {
    mapOfVars.set(char, mapOfVars.get(char) + 1);
  } else {
    mapOfVars.set(char, 1);
  }
}

function rezolva1234() {
  rasp3.textContent = "";
  for (const key of mapOfVars.keys()) {
    if (key !== "(" && key !== ")" && key !== " ") {
      if (letters.includes(key)) {
        rasp3.innerHTML += `${key} : ${mapOfVars.get(key)} <br>`;
        distinctVars.push(key);
      }
      if (operators.includes(key)) {
        ordinea += mapOfVars.get(key);
      }
      if (letters.includes(key)) subF += mapOfVars.get(key);
      else {
        subF += mapOfVars.get(key);
      }
    }
  }
  rasp1.textContent = subF;
  rasp2.textContent = distinctVars.length;
  rasp4.textContent = ordinea;
}

function eqv(a, b) {
  return (a == b) == false ? 0 : 1;
}
function not(a) {
  return a == false ? 1 : 0;
}
function imp(a, b) {
  return a == 1 && b == 0 ? 0 : 1;
}

function or(a, b) {
  return a || b;
}
function and(a, b) {
  return a && b;
}
function subdiv(formula) {
  let subFormulas = [];
  let x = 0;
  let first = -1;

  for (let i = 0; i < formula.length; i++) {
    if (formula[i] === "(") {
      if (x === 0) {
        first = i;
      }
      x += 1;
    } else if (formula[i] === ")") {
      x -= 1;

      if (x === 0) {
        let newSub = formula.slice(first + 1, i);
        subFormulas.push(newSub);
        subFormulas = subFormulas.concat(subdiv(newSub));
      }
    }
  }

  return subFormulas;
}
function assignEachValueTF(distinctVars) {
  let numVars = distinctVars.length;
  let table = [];

  for (let i = 0; i < Math.pow(2, numVars); i++) {
    let row = [];
    for (let j = numVars - 1; j >= 0; j--) {
      row.push((i >> j) & 1);
    }
    table.push(row);
  }

  console.log(table);
  return table;
}
function createTable(tableToUpdate, tableToInsert, distinctVars) {
  tableToUpdate.innerHTML = "";

  let cols = tableToInsert[0].length + 1;

  let headerRow = document.createElement("tr");
  for (let j = 0; j < cols; j++) {
    let th = document.createElement("th");
    th.textContent = j === cols - 1 ? "F" : distinctVars[j];
    th.style.border = "1px solid black";
    th.style.padding = "5px";
    th.style.background =
      j === cols - 1 ? "rgba(160 61 56 / 0.46)" : "rgba(160 242 190 / 0.56)";
    headerRow.appendChild(th);
  }
  tableToUpdate.appendChild(headerRow);

  for (let i = 0; i < tableToInsert.length; i++) {
    let tr = document.createElement("tr");

    for (let j = 0; j < tableToInsert[i].length; j++) {
      let td = document.createElement("td");
      td.textContent = tableToInsert[i][j];
      td.style.border = "1px solid black";
      td.style.padding = "5px";
      tr.appendChild(td);
    }

    let tdF = document.createElement("td");
    tdF.textContent = "Result";
    tdF.style.border = "1px solid black";
    tdF.style.padding = "5px";
    tdF.style.backgroundColor = "rgba(160 61 56 / 0.69)";
    tr.appendChild(tdF);

    tableToUpdate.appendChild(tr);
  }
}

function changeVars(distinctVars, varsFromTable, formula) {
  let copy = formula;
  for (let i = 0; i < distinctVars.length; i++) {
    console.log("Replacing " + distinctVars[i] + " with " + varsFromTable[i]);

    copy = copy.replaceAll(distinctVars[i], varsFromTable[i]);
  }
  return copy;
}
function addToLastColumn(tableToUpdate, content) {
  const rows = tableToUpdate.rows;
  for (let i = 1; i < rows.length; i++) {
    let lastCell = rows[i].cells[rows[i].cells.length - 1];

    lastCell.textContent = content[i - 1];
  }
}
