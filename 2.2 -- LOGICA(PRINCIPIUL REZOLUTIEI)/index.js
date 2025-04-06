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

function creazaFormula() {
  readFomulainArray();
  let tableToInsert = assignEachValueTF();
  createTable(table, tableToInsert, inputArray);
  let myMatrix = tableToMatrix(table);
  console.log(myMatrix);

  let formaConj = creazaFormulaNormalaConjunctiva(myMatrix);
  let FormulaArray = getFormulaArray(formaConj);
  console.log(FormulaArray);

  let systemClauses = [];
  for (let i of FormulaArray) {
    systemClauses.push(transformToNums(i));
  }
  console.log(systemClauses);
  console.log(isSystemConsistent(systemClauses)); // Verifică consistența
  formaConjunctiva.textContent = "FORMA NORMALA CONJUNCTIVA ESTE :" + formaConj;
  console.log(formaConj);
  addFormulaButton.style.display = "flex";
}
function adaugaSimplified() {
  const div = document.createElement("div");
  div.className = "output-container";
  const h1 = document.createElement("h1");
  h1.innerHTML = Simplified;
  div.appendChild(h1);
  arrayOfSimplified.push(Simplified);
  containerSimplified.appendChild(div);
  console.log(arrayOfSimplified);
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

  return matrix;
}
//todo: i have to modify this so it functions properly
function isSystemConsistent(clauses) {
  // Resolves two clauses and returns the resolved clause, or null if no resolution is possible
  function resolve(clause1, clause2) {
    // Try to resolve two clauses by eliminating complementary literals
    for (let literal of clause1) {
      if (clause2.includes(-literal)) {
        // Combine the remaining literals after eliminating complementary literals
        let newClause = [
          ...clause1.filter((x) => x !== literal),
          ...clause2.filter((x) => x !== -literal),
        ];
        return [...new Set(newClause)]; // Remove duplicates
      }
    }
    return null; // No resolution possible
  }

  // Helper function to check if two arrays (clauses) are equal
  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  }

  // Initialize the set of all clauses
  let allClauses = [...clauses];
  let newClauses = [];
  let maxIterations = 1000; // Limit to avoid infinite loops in complex cases

  // Main loop: try to resolve pairs of clauses until no new clauses are generated
  while (maxIterations-- > 0) {
    let generatedNewClause = false;

    // Try resolving every pair of clauses
    for (let i = 0; i < allClauses.length; i++) {
      for (let j = i + 1; j < allClauses.length; j++) {
        let resolved = resolve(allClauses[i], allClauses[j]);
        if (resolved !== null) {
          if (resolved.length === 0) {
            // Found an empty clause, which means the system is inconsistent
            console.log("Found empty clause, system is inconsistent.");
            return false;
          }
          // If the new clause is not already in the list, add it
          if (!allClauses.some((c) => arraysAreEqual(c, resolved))) {
            newClauses.push(resolved);
            generatedNewClause = true;
          }
        }
      }
    }

    // If no new clauses were generated, the system is consistent
    if (!generatedNewClause) {
      console.log("No new clauses generated, system is consistent.");
      return true;
    }

    // Add the new clauses to the list and continue resolving
    allClauses = [...allClauses, ...newClauses];
    newClauses = []; // Reset for the next iteration
  }

  // If max iterations are reached without finding an empty clause, assume inconsistency
  console.log(
    "Max iterations reached, system might be inconsistent or too complex."
  );
  return false;
}
function transformToNums(clause) {
  let vars = clause.split("|");
  let numVars = [];
  for (let char of vars) {
    if (char == "p") {
      numVars.push(1);
    } else if (char == "!p") {
      numVars.push(-1);
    } else if (char == "q") {
      numVars.push(2);
    } else if (char == "!q") {
      numVars.push(-2);
    } else if (char == "r") {
      numVars.push(3);
    } else if (char == "!r") {
      numVars.push(-3);
    } else if (char == "s") {
      numVars.push(4);
    } else if (char == "!s") {
      numVars.push(-4);
    } else if (char == "t") {
      numVars.push(5);
    } else if (char == "!t") {
      numVars.push(-5);
    }
  }
  console.log(numVars);
  console.log(vars);
  return numVars;
}
function getFormulaArray(formula) {
  formula = formula.replaceAll(" ", "");
  formula = formula.replaceAll(" ", "");
  formula = formula.replaceAll("(", "");
  formula = formula.replaceAll(")", "");
  return formula.split("&");
}
