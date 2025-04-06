const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const pointsContainer = document.getElementById("points");
const L1L2 = document.getElementById("L1&L2");
const matrice = document.createElement("table");
const matriceContainer = document.getElementById("outputMatrix-container");
const rasp = document.getElementById("answer");

matriceContainer.appendChild(matrice);

const squareCornersList = [];
let points = [];
let L1 = [];
let L2 = [];
let pointNumber = 1;

function deseneazaAxe() {
  // Draw X-axis
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();

  // Draw Y-axis
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();
}

deseneazaAxe();

function addtopoints() {
  const x = parseFloat(document.getElementById("pX").value);
  const y = parseFloat(document.getElementById("pY").value);

  if (isNaN(x) || isNaN(y)) {
    alert("Please enter valid numeric values for X and Y.");
    return;
  }

  points.push({ number: pointNumber, x: x, y: y });

  const canvasX = centerX + x * 5;
  const canvasY = centerY - y * 5;

  ctx.beginPath();
  ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();

  ctx.font = "10px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`(${pointNumber})`, canvasX, canvasY - 10);

  pointsContainer.innerHTML += `${pointNumber}: (${x}, ${y})<br>`;
  pointNumber++;
  console.log(points);
}

function sortBy(coordinate) {
  if (coordinate !== "x" && coordinate !== "y") {
    throw new Error("Invalid coordinate. Use 'x' or 'y'.");
  }
  // Sort using MergeSort
  return MergeSort(points, coordinate);
}

function Sort(left, right, coordinate) {
  let i = 0;
  let j = 0;
  let sorted = [];

  while (i < left.length && j < right.length) {
    if (left[i][coordinate] < right[j][coordinate]) {
      sorted.push(left[i]);
      i++;
    } else {
      sorted.push(right[j]);
      j++;
    }
  }
  while (i < left.length) {
    sorted.push(left[i]);
    i++;
  }
  while (j < right.length) {
    sorted.push(right[j]);
    j++;
  }
  return sorted;
}

function MergeSort(arr, coordinate) {
  if (arr.length <= 1) {
    return arr;
  }
  let mid = Math.floor(arr.length / 2);
  let left = arr.slice(0, mid);
  let right = arr.slice(mid);

  return Sort(
    MergeSort(left, coordinate),
    MergeSort(right, coordinate),
    coordinate
  );
}

function CreazaL1L2() {
  L1 = sortBy("x");
  L2 = sortBy("y");

  console.log("Sorted by X:");
  console.log(L1);
  let list1 = document.createElement("h2");
  let LL1 = "L1 = ";
  for (let i = 0; i < L1.length; i++) {
    LL1 += L1[i].number + " ";
  }

  list1.textContent = LL1;
  L1L2.appendChild(list1);
  console.log("Sorted by Y:");
  console.log(L2);
  let list2 = document.createElement("h2");
  let LL2 = "L2 = ";
  for (let i = 0; i < L2.length; i++) {
    LL2 += L2[i].number + " ";
  }
  list2.textContent = LL2;

  L1L2.appendChild(list2);
}
function getVectorCoords() {
  let pointsVector = [];
  for (let i = 0; i < points.length; i++) {
    pointsVector.push([points[i].x, points[i].y]);
  }
  console.log(pointsVector);
  return pointsVector;
}
function createMatrix() {
  const points = getVectorCoords();
  const n = findBiggestXY();

  let M = Array.from({ length: n[0] }, () => Array(n[1]).fill(0));
  points.forEach(([x, y]) => {
    M[x - 1][y - 1] = 1;
  });

  for (let i = 0; i < n[0]; i++) {
    for (let j = 0; j < n[1]; j++) {
      const above = i > 0 ? M[i - 1][j] : 0;
      const left = j > 0 ? M[i][j - 1] : 0;
      const diagonal = i > 0 && j > 0 ? M[i - 1][j - 1] : 0;
      M[i][j] += above + left - diagonal;
    }
  }

  return M;
}
function findBiggestXY() {
  let maxX = points[0].x;
  let maxY = points[0].y;
  for (let i = 1; i < points.length; i++) {
    if (points[i].x > maxX) maxX = points[i].x;
    if (points[i].y > maxY) maxY = points[i].y;
  }
  let result = [maxX, maxY];
  return result;
}

function setSquare() {
  let corner1X = document.getElementById("corner1X").value;
  let corner1Y = document.getElementById("corner1Y").value;
  let corner2X = document.getElementById("corner2X").value;
  let corner2Y = document.getElementById("corner2Y").value;

  if (corner1X == "" || corner1Y == "" || corner2X == "" || corner2Y == "") {
    alert("Please enter valid numeric values for the corners.");
    return;
  }

  const canvasX = centerX + corner1X * 5;
  const canvasY = centerY - corner1Y * 5;
  const canvas2X = centerX + corner2X * 5;
  const canvas2Y = centerY - corner2Y * 5;
  const canvas3X = centerX + corner1X * 5;
  const canvas3Y = centerY - corner2Y * 5;
  const canvas4X = centerX + corner2X * 5;
  const canvas4Y = centerY - corner1Y * 5;
  squareCornersList.push(
    [Number(corner1X), Number(corner1Y)],
    [Number(corner2X), Number(corner2Y)],
    [Number(corner1X), Number(corner2Y)],
    [Number(corner2X), Number(corner1Y)]
  );
  console.log(squareCornersList);
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(canvas2X, canvas2Y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(canvas3X, canvas3Y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(canvas4X, canvas4Y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(canvasX, canvasY); // Start at corner1
  ctx.lineTo(canvas3X, canvas3Y); // Draw line to corner3
  ctx.lineTo(canvas2X, canvas2Y); // Draw line to corner2
  ctx.lineTo(canvas4X, canvas4Y); // Draw line to corner4
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 0, 0, 0.203)"; // Optional, to add some fill color
  ctx.fill();

  // Draw the outline of the square
  ctx.strokeStyle = "red"; // Outline color
  ctx.stroke();
}
function solve() {
  let M = createMatrix();
  let transpusM = transposeMatrix(M);
  let newM = createProperMatrix(transpusM);
  let actualM = createProperMatrix2(M);
  copyToTable(newM, matrice);
  normalizeMatrix(actualM, squareCornersList);
  findPointsCount(actualM, squareCornersList);
}
function copyToTable(matrix, table) {
  let tableBody = document.createElement("tbody");
  for (let i = 0; i < matrix.length; i++) {
    let row = document.createElement("tr"); // Create a new row

    for (let j = 0; j < matrix[i].length; j++) {
      let cell = document.createElement("td"); // Create a new cell
      cell.textContent = matrix[i][j];
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  }

  table.appendChild(tableBody);
}

function transposeMatrix(matrix) {
  let transposed = [];

  // Step 1: Transpose the matrix
  for (let i = 0; i < matrix[0].length; i++) {
    let row = [];
    for (let j = 0; j < matrix.length; j++) {
      row.push(matrix[j][i]);
    }
    transposed.push(row);
  }

  // Step 2: Reverse the rows of the transposed matrix
  return transposed.reverse();
}
function normalizeMatrix(matrix, squareCornersList) {
  console.log(squareCornersList);
  if (squareCornersList[0][0] < 0 && squareCornersList[0][1] < 0) {
    squareCornersList[0][0] = 0;
    squareCornersList[0][1] = 0;
  }
  if (
    squareCornersList[1][0] > matrix[0].length - 1 &&
    squareCornersList[1][1] > matrix.length - 1
  ) {
    squareCornersList[1][0] = matrix[0].length - 1;
    squareCornersList[1][1] = matrix.length - 1;
  }
  squareCornersList[2][1] = squareCornersList[1][1];
  squareCornersList[2][0] = squareCornersList[0][0];
  squareCornersList[3][0] = squareCornersList[1][0];
  squareCornersList[3][1] = squareCornersList[0][1];
}

function findPointsCount(matrix, squareCornersList) {
  let Qa = matrix[squareCornersList[0][1]][squareCornersList[0][0]];
  let Qb = matrix[squareCornersList[1][1]][squareCornersList[1][0]];
  let Qc = matrix[squareCornersList[3][1]][squareCornersList[3][0]];
  let Qd = matrix[squareCornersList[2][1]][squareCornersList[2][0]];

  let answer = Qb - Qc - Qd + Qa;

  let raspuns = `Numarul de puncte din patrat: ${answer}`;
  let answ = document.createElement("h1");
  answ.textContent = raspuns;
  rasp.appendChild(answ);
  console.log(`${Qb} -${Qc} - ${Qd} + ${Qa};`);
}
function createProperMatrix(matrix) {
  let properMatrix = [];
  console.log(matrix.length);
  let row = 0;
  for (let i = 0; i < matrix.length + 1; i++) {
    properMatrix[i] = [];
    let col = 0;
    for (let j = 0; j < matrix[0].length + 1; j++) {
      if (i == matrix.length || (i != 0 && j == 0) || (i == 0 && j == 0)) {
        properMatrix[i][j] = 0;
      } else {
        properMatrix[i][j] = matrix[row][col];
        col++;
      }
    }
    row++;
  }
  return properMatrix;
}
function createProperMatrix2(matrix) {
  let properMatrix = [];
  console.log(matrix.length);
  let row = 0;
  for (let i = 0; i < matrix.length + 1; i++) {
    properMatrix[i] = [];
    let col = 0;
    for (let j = 0; j < matrix[0].length + 1; j++) {
      if (i == 0 || (i != 0 && j == 0) || (i == 0 && j == 0)) {
        properMatrix[i][j] = 0;
      } else {
        properMatrix[i][j] = matrix[i - 1][col];
        col++;
      }
    }
    row++;
  }
  return properMatrix;
}
