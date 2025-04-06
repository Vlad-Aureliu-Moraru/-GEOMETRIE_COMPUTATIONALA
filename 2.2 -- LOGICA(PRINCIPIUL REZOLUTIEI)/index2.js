const input = document.getElementById("input");
let inputArray = [];
let arrayOfSimplified = [];
let matrixMap = [];
const addFormulaButton = document.getElementById("addFormula");

const table = document.createElement("table");
document.getElementById("container-tabel").append(table);
table.style.justifyContent = "center";

const formaConjunctiva = document.createElement("p");
document.getElementById("container-formula").append(formaConjunctiva);

const containerSimplified = document.getElementById("simplified-formula");

function creazaFormula() {
  readFomulainArray();
  let tableToInsert = assignEachValueTF();
  createTable(table, tableToInsert, inputArray);
  let myMatrix = tableToMatrix(table);

  let formaConj = creazaFormulaNormalaConjunctiva(myMatrix);

  formaConjunctiva.textContent = "FORMA NORMALA CONJUNCTIVA ESTE :" + formaConj;
  console.log(formaConj);
  addFormulaButton.style.display = "flex";
  mainFunction(matrixMap);
}
function adaugaSimplified() {}
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
    matrixMap.push({ i, rowData });
    matrix.push(rowData);
  }
  return matrix;
}
function getImplicantsO1(matrix) {
  let copy = matrix;
  console.group("~FirstStep");
  let implicants = [];
  for (let row of copy) {
    for (let i = 0; i < row.rowData.length; i++) {
      if (i == row.rowData.length - 1 && row.rowData[i] == 0) {
        row.rowData.splice(i, 1);

        implicants.push(row);
      }
    }
  }

  console.groupEnd();
  return implicants;
}
function countForDiferences(row1, row2) {
  console.groupCollapsed("~Searchind for diff");
  let diferences = 0;
  console.log("rows", row1, row2);
  for (let i = 0, j = 0; i < row1.length, j < row2.length; i++, j++) {
    if (row2[j] != row1[i]) {
      diferences++;
      console.warn(`found ${row1[i]}!= ${row2[j]} differences:${diferences}`);
    }
  }
  console.groupEnd();
  return diferences == 1 ? true : false;
}
function removeDifferences(row1, row2) {
  let newRow = [];
  let newI = [];
  if (!Array.isArray(row1.i)) {
    newI.push(row2.i);
    newI.push(row1.i);
  } else {
    newI.push(...row2.i);
    newI.push(...row1.i);
  }
  for (
    let i = 0, j = 0;
    i < row1.rowData.length, j < row2.rowData.length;
    i++, j++
  ) {
    if (row2.rowData[j] == row1.rowData[i]) {
      newRow.push(row1.rowData[i]);
    } else {
      console.warn("Removing!");
      newRow.push("-");
    }
  }
  newI.sort((a, b) => a - b);
  return { i: newI, rowData: newRow };
}

//!MAIN
function mainFunction(myMatrix) {
  console.group("~Main");
  let implicants = getImplicantsO1(myMatrix);
  console.log(implicants);
  let newImplicants = [];
  let nnImplicants = [];
  let ocurenceOfI = [];
  let nnn = [];
  console.groupCollapsed("First");
  for (let i = 0; i < implicants.length; i++) {
    for (let j = i + 1; j < implicants.length; j++) {
      if (countForDiferences(implicants[i].rowData, implicants[j].rowData)) {
        console.log(`${i} ; ${j}`);
        newImplicants.push(removeDifferences(implicants[i], implicants[j]));
      }
    }
  }
  console.groupEnd();
  console.groupCollapsed("nd");
  for (let i = 0; i < newImplicants.length; i++) {
    for (let j = i + 1; j < newImplicants.length; j++) {
      if (
        countForDiferences(newImplicants[i].rowData, newImplicants[j].rowData)
      ) {
        console.log(`${i} ; ${j}`);
        let thingToPush = removeDifferences(newImplicants[i], newImplicants[j]);
        if (!checkIfPresentInArray(ocurenceOfI, thingToPush.i)) {
          nnImplicants.push(thingToPush);
          ocurenceOfI.push(thingToPush.i);
        }
      }
    }
  }

  console.groupEnd();

  console.log(newImplicants);
  console.table(nnImplicants);
  console.log(ocurenceOfI);
  console.log(checkIfPresentInArray(ocurenceOfI, ocurenceOfI[2]));
  console.groupEnd();
}

//now i have to search for implicants O2 by checking the combinations
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
}
function checkIfPresentInArray(array, elem) {
  for (let i of array) {
    if (arraysAreEqual(i, elem)) {
      console.log("there is");
      return true;
    }
  }
  return false;
}
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

// Exemplu de utilizare
let systemClauses = [
  [1, 2], // P ∨ Q
  [-1, 3], // ¬P ∨ R
  [-2, -3], // ¬Q ∨ ¬R
];

console.log(isSystemConsistent(systemClauses)); // Verifică consistența
