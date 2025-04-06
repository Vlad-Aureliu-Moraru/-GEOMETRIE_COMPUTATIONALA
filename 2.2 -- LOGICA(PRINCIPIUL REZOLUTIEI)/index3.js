const input = document.getElementById("input");
let inputArray = [];
let arrayOfSimplified = [];
const addFormulaButton = document.getElementById("addFormula");

const table = document.createElement("table");
document.getElementById("container-tabel").append(table);
table.style.justifyContent = "center";

const formaConjunctiva = document.createElement("p");
document.getElementById("container-formula").append(formaConjunctiva);

const containerSimplified = document.getElementById("simplified-formula");

function isSystemConsistent(clauses) {
  function resolve(clause1, clause2) {
    for (let literal of clause1) {
      if (clause2.includes(-literal)) {
        let newClause = [
          ...clause1.filter((x) => x !== literal),
          ...clause2.filter((x) => x !== -literal),
        ];
        return [...new Set(newClause)];
      }
    }
    return null;
  }

  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  }

  let newClauses = [];
  while (true) {
    let generatedNewClause = false;

    for (let i = 0; i < clauses.length; i++) {
      for (let j = i + 1; j < clauses.length; j++) {
        let resolved = resolve(clauses[i], clauses[j]);
        if (resolved !== null && resolved.length === 0) {
          console.log("Found empty clause, system is inconsistent.");
          return false; // Sistemul este inconsistent
        }
        if (
          resolved !== null &&
          !clauses.some((c) => arraysAreEqual(c, resolved))
        ) {
          newClauses.push(resolved);
          generatedNewClause = true;
        }
      }
    }

    if (!generatedNewClause) {
      console.log("No new clauses generated, system is consistent.");
      return true; // Sistemul este consistent
    }

    clauses = [...clauses, ...newClauses];
    newClauses = [];
  }
}
function readFomulainArray() {
  inputArray = [];
  const valueInput = document.getElementById("input").value;
  for (let i = 0; i < valueInput.length; i++) {
    if (valueInput[i] != "0" && valueInput[i] != 1) {
      alert("input invalid");
      document.getElementById("input").value = "";
      break;
    } else {
      inputArray.push(Number(valueInput[i]));
    }
  }
  console.log(inputArray);
}
function assignEachValueTF() {
  let numVars = Math.log2(inputArray.length);
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
    tdF.textContent = distinctVars[i];
    tdF.style.border = "1px solid black";
    tdF.style.padding = "5px";
    tdF.style.backgroundColor = "rgba(160 61 56 / 0.69)";
    tr.appendChild(tdF);

    tableToUpdate.appendChild(tr);
  }
}
function creazaFormulaNormalaConjunctiva(tabel) {
  let formula = [];

  let variableNames = ["p", "q", "r", "s", "t"];
  for (let i = 0; i < tabel.length; i++) {
    if (tabel[i][tabel[i].length - 1] == 0) {
      let temp = [];
      for (let j = 0; j < tabel[i].length - 1; j++) {
        if (tabel[i][j] == 0) {
          temp.push(variableNames[j]);
        } else {
          temp.push("!" + variableNames[j]);
        }
      }
      formula.push("(" + temp.join(" | ") + ")");
    }
  }

  return formula.join(" & ");
}
function tableToMatrix(table) {
  let matrix = [];

  for (let i = 0; i < table.rows.length; i++) {
    let row = table.rows[i];
    let rowData = [];

    for (let j = 0; j < row.cells.length; j++) {
      rowData.push(row.cells[j].innerText);
    }
    matrix.push(rowData);
  }

  return;
}

function creazaFormula() {
  readFomulainArray();
  let tableToInsert = assignEachValueTF();
  createTable(table, tableToInsert, inputArray);
  let myMatrix = tableToMatrix(table);
  console.log(myMatrix);

  let formaConj = creazaFormulaNormalaConjunctiva(myMatrix);
  Simplified = principiulRezolutieiV2(formaConj);

  formaConjunctiva.textContent = "FORMA NORMALA CONJUNCTIVA ESTE :" + formaConj;
  console.log(formaConj);
  addFormulaButton.style.display = "flex";
  let systemClauses = [
    [1, 2], // P ∨ Q
    [-1, 3], // ¬P ∨ R
    [-2, -3], // ¬Q ∨ ¬R
  ];

  console.log(isSystemConsistent(systemClauses)); // Verifică consistența
}
