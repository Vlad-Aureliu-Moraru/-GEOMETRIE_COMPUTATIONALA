const input = document.getElementById("input");
let inputArray = [];

const table = document.createElement("table");
document.getElementById("container-tabel").append(table);
table.style.justifyContent = "center";

const formaConjunctiva = document.createElement("p");
document.getElementById("container-formula").append(formaConjunctiva);

const formaDisjunctiva = document.createElement("p");
document.getElementById("container-formula").append(formaDisjunctiva);

function creazaFormula() {
  readFomulainArray();
  let tableToInsert = assignEachValueTF();
  createTable(table, tableToInsert, inputArray);
  let myMatrix = tableToMatrix(table);
  console.log(myMatrix);

  let formaConj = creazaFormulaNormalaConjunctiva(myMatrix);
  let formaDisj = creazaFormulaNormalaDisjunctiva(myMatrix);

  formaConjunctiva.textContent = "FORMA NORMALA CONJUNCTIVA ESTE :" + formaConj;
  formaDisjunctiva.textContent = "FORMA NORMALA DISJUNCTIVA ESTE :" + formaDisj;
  console.log(formaDisj);
  console.log(formaConj);
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
  let variableNames = ["a", "b", "c", "d", "e", "f", "g", "h"];
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
function creazaFormulaNormalaDisjunctiva(tabel) {
  let formula = [];
  let variableNames = ["a", "b", "c", "d", "e", "f", "g", "h"];
  for (let i = 0; i < tabel.length; i++) {
    if (tabel[i][tabel[i].length - 1] == 1) {
      let temp = [];
      for (let j = 0; j < tabel[i].length - 1; j++) {
        if (tabel[i][j] == 1) {
          temp.push(variableNames[j]);
        } else {
          temp.push("!" + variableNames[j]);
        }
      }
      formula.push("(" + temp.join(" & ") + ")");
    }
  }

  return formula.join(" | ");
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

  return matrix;
}
