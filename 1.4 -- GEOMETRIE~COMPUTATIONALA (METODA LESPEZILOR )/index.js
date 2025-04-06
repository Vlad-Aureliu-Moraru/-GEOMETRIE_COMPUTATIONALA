let colectedVertecies = null;
let DCEL = null;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let vertexMap = new Map();
let multimeaA = new Map();
let multimeaB = new Map();
let lespezi = [];

const container = document.getElementById("lespezi-container");
const answerContainer = document.getElementById("raspuns-container");

//note: adds dcel row
function addRow() {
  console.log("~ Adding Row...");
  const tableBody = document.getElementById("DCEL");
  const newRow = document.createElement("tr");
  for (let i = 0; i < 7; i++) {
    const newCell = document.createElement("td");
    newCell.contentEditable = "true";
    newRow.appendChild(newCell);
  }
  tableBody.appendChild(newRow);
}

// note: adds axes
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

// note: reads DCEL
function readDCEL() {
  DCEL = [];
  const tableBody = document.getElementById("DCEL");
  console.log("/ Starting ReadDCEL...");
  try {
    for (let i = 1; i < tableBody.rows.length; i++) {
      const row = tableBody.rows[i];
      const rowData = [];

      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        const cellContent = cell.innerText.trim() || cell.textContent.trim();
        if (cellContent) rowData.push(cellContent);
      }

      if (rowData.length > 0) {
        DCEL.push(rowData);
      } else {
        alert("Please enter all values");
        break;
      }
    }
    console.log("/ DCEL : " + DCEL);
    main();
  } catch (e) {
    alert("Error: " + e.message);
  }
}

function assignCoordinates() {
  const selectedVertex = document.getElementById("pointSelector").value;

  const X = document.getElementById("x").value.trim();
  const Y = document.getElementById("y").value.trim();

  if (X === "" || Y === "" || isNaN(X) || isNaN(Y)) {
    alert("Please enter valid X and Y coordinates.");
    return;
  }

  const canvasX = centerX + parseFloat(X) * 10;
  const canvasY = centerY - parseFloat(Y) * 10;

  // Check if the same coordinates are already assigned to a different vertex
  for (let [key, value] of vertexMap) {
    if (
      value.x === parseFloat(X) &&
      value.y === parseFloat(Y) &&
      key !== selectedVertex
    ) {
      alert("These coordinates are already assigned to another vertex.");
      return;
    }
  }

  // Clear the canvas for the specific vertex and its edges
  if (vertexMap.has(selectedVertex)) {
    clearCanvasForVertex(selectedVertex);
  }

  // Update the vertex in the map
  vertexMap.set(selectedVertex, { x: parseFloat(X), y: parseFloat(Y) });

  // Draw the vertex
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, 10, 0, 2 * Math.PI);
  ctx.fillStyle = selectedVertex === "M" ? "red" : "white";
  ctx.fill();

  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(selectedVertex, canvasX, canvasY);

  console.log(`Vertex ${selectedVertex} coordinates: (${X}, ${Y})`);

  // Redraw edges if the vertex map has more than one vertex
  if (vertexMap.size > 1) {
    vertexMap.forEach(function (vertex, key) {
      const edge = isConnected(key, selectedVertex);
      if (edge) {
        const startX = centerX + vertex.x * 10;
        const startY = centerY - vertex.y * 10;
        const endX = canvasX;
        const endY = canvasY;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        ctx.font = "20px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${edge}`, midX, midY);
      }
    });
  }
}

function clearCanvasForVertex(vertex) {
  const coordinates = vertexMap.get(vertex);
  if (coordinates) {
    const canvasX = centerX + coordinates.x * 10;
    const canvasY = centerY - coordinates.y * 10;

    // Clear the vertex area
    ctx.clearRect(canvasX - 20, canvasY - 20, 40, 40);

    // Redraw edges that do not involve this vertex
    vertexMap.forEach(function (otherVertex, key) {
      if (key !== vertex) {
        const edge = isConnected(key, vertex);
        if (edge) {
          const startX = centerX + otherVertex.x * 10;
          const startY = centerY - otherVertex.y * 10;
          const endX = canvasX;
          const endY = canvasY;

          ctx.clearRect(
            Math.min(startX, endX) - 10,
            Math.min(startY, endY) - 10,
            Math.abs(startX - endX) + 20,
            Math.abs(startY - endY) + 20
          );
        }
      }
    });
  }
  deseneazaAxe();
}

function collectVertecies(DCEL) {
  const vertices = [];
  for (let i = 0; i < DCEL.length; i++) {
    const vertex1 = DCEL[i][1];
    const vertex2 = DCEL[i][2];

    if (!vertices.includes(vertex1)) {
      vertices.push(vertex1);
    }
    if (!vertices.includes(vertex2)) {
      vertices.push(vertex2);
    }
  }
  return vertices;
}

function addVertexAsOption(vertices) {
  const ComboBox = document.getElementById("pointSelector");
  ComboBox.innerHTML = "";
  const M = document.createElement("option");
  M.value = "M";
  M.text = "M";
  ComboBox.add(M);

  for (let i = 0; i < vertices.length; i++) {
    const option = document.createElement("option");
    option.value = vertices[i];
    option.text = vertices[i];
    ComboBox.add(option);
  }
}
function isConnected(a, b) {
  for (let i = 0; i < DCEL.length; i++) {
    if (
      (DCEL[i][1] === a && DCEL[i][2] === b) ||
      (DCEL[i][1] === b && DCEL[i][2] === a)
    ) {
      return DCEL[i][0];
    }
  }
  return false;
}

function creazaMultimeaB(DCEL) {
  let multimeaB = new Map();
  for (let i = 0; i < DCEL.length; i++) {
    let edges = [];
    let value = DCEL[i][1];
    for (let j = 0; j < DCEL.length; j++) {
      if (DCEL[j][1] === value) {
        edges.push(DCEL[j][0]);
      }
      multimeaB.set(value, edges);
    }
  }
  return multimeaB;
}
function creazaMultimeaA(DCEL) {
  let multimeaA = new Map();

  for (let i = 0; i < DCEL.length; i++) {
    let edges = [];
    let value = DCEL[i][2];
    for (let j = 0; j < DCEL.length; j++) {
      if (DCEL[j][2] === value) {
        edges.push(DCEL[j][0]);
      }
      multimeaA.set(value, edges);
    }
  }
  return multimeaA;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  deseneazaAxe();
  vertexMap.clear(); // Clear the vertex map
}
deseneazaAxe();

function main() {
  multimeaB = creazaMultimeaB(DCEL);
  multimeaA = creazaMultimeaA(DCEL);

  console.log("* Printing MA");
  console.log(multimeaA);
  console.log("* Printing MB");
  console.log(multimeaB);

  colectedVertecies = collectVertecies(DCEL);
  console.log("* Printing COLECTED VERT");
  colectedVertecies.sort(function (a, b) {
    return a - b;
  });
  console.log(colectedVertecies);
  addVertexAsOption(colectedVertecies);

  console.log("* Printing lespezi");
  lespezi = creazaLespezi(colectedVertecies, multimeaA, multimeaB);
  console.log(lespezi);
  container.innerHTML = "";
  for (let i = 0; i < lespezi.length; i++) {
    let text = document.createElement("h2");
    text.textContent = `L${[i + 1]}: ${lespezi[i]}`;
    container.append(text);
  }
}
//note:
function creazaLespezi(colectedVertecies, multimeaA, multimeaB) {
  let lespezi = [];

  let l1 = [];

  replace(
    l1,
    multimeaA.get(colectedVertecies[0]),
    multimeaB.get(colectedVertecies[0])
  );
  lespezi.push([...l1]);
  for (let i = 1; i < colectedVertecies.length - 1; i++) {
    replace(
      l1,
      multimeaA.get(colectedVertecies[i]),
      multimeaB.get(colectedVertecies[i])
    );
    lespezi.push([...l1]);
  }

  return lespezi;
}

function replace(vector0, vector1, vector2) {
  // Check if vector1 and vector2 are provided and valid
  if (vector1 && vector1.length > 0) {
    // Remove elements in vector0 that are present in vector1
    for (let i = 0; i < vector0.length; i++) {
      for (let j = 0; j < vector1.length; j++) {
        if (vector0[i] == vector1[j]) {
          vector0.splice(i, 1);
          i--; // Adjust the index after removing an element
          break;
        }
      }
    }
  }

  // If vector2 is not null or empty, append its elements to vector0
  if (vector2 && vector2.length > 0) {
    vector0.push(...vector2);
  } else {
    console.log("Nothing to replace or append.");
  }
}

//note:
function MetodaLespezilor() {
  let CoordonateleIntreCareSeAflaM;
  let LespedeaPeCareSeAflaM;
  if (vertexMap.size < colectedVertecies.length + 1) {
    alert("Introdu Toate Coordonatele");
    return;
  } else {
    CoordonateleIntreCareSeAflaM = gasesteLespedea(
      colectedVertecies,
      vertexMap.get("M")
    );
    LespedeaPeCareSeAflaM = getKeyByValue(
      vertexMap,
      CoordonateleIntreCareSeAflaM[0]
    );
  }
  console.log("LESPEDE GASITA  : " + LespedeaPeCareSeAflaM);
  console.log(lespezi[LespedeaPeCareSeAflaM - 1]);
  try {
    let Laturi = getEdgesFromDCEL(
      DCEL,
      vertexMap,
      lespezi[LespedeaPeCareSeAflaM - 1]
    );
    let PozitiaLaturilorRelM = locateEdges(vertexMap.get("M"), Laturi);
    let FeteleAtribuiteLaturilor = assignFace(PozitiaLaturilorRelM, DCEL);
    let FataGasita = findFace(FeteleAtribuiteLaturilor);
    console.log(FataGasita);

    let text = document.createElement("h2");
    answerContainer.innerHTML = "";
    if (FataGasita != -1) {
      text.textContent = `Fata localizata este : ${FataGasita}`;
    } else {
      text.textContent = `Fata nu a putut fi localizata`;
    }
    answerContainer.append(text);
  } catch (e) {
    alert("Error: " + e.message);
  }
}
function isYBetween(M, A, B) {
  const y1 = A.y;
  const y2 = B.y;
  const ym = M.y;

  const withinY = Math.min(y1, y2) <= ym && ym <= Math.max(y1, y2);
  console.log(`Is M.y within the Y range of A and B? ${withinY}`);
  return withinY;
}

function gasesteLespedea(colectedVertecies, M) {
  let CeleMaiApropiate2Varfuri = null;
  let distantaMinima = Infinity;

  for (let i = 0; i < colectedVertecies.length; i++) {
    for (let j = i + 1; j < colectedVertecies.length; j++) {
      const A = vertexMap.get(colectedVertecies[i].toString());
      const B = vertexMap.get(colectedVertecies[j].toString());

      if (isYBetween(M, A, B)) {
        const distance = getDistance(M, A) + getDistance(M, B);

        if (distance < distantaMinima) {
          distantaMinima = distance;
          CeleMaiApropiate2Varfuri = [A, B];
        }
      }
    }
  }
  return CeleMaiApropiate2Varfuri;
}

function getDistance(P1, P2) {
  return Math.sqrt(Math.pow(P1.x - P2.x, 2) + Math.pow(P1.y - P2.y, 2));
}
function getKeyByValue(map, value) {
  for (let [key, val] of map.entries()) {
    if (val == value) {
      return key;
    }
  }
}
function getEdgesFromDCEL(DCEL, vertexMap, vectorFilter) {
  console.log("~entering getEdgesFromDCEL");
  let edges = [];
  for (let row of DCEL) {
    for (let i = 0; i < row.length - 1; i++) {
      if (i == 0 && !edges.includes(row[i])) {
        if (vectorFilter.includes(row[i].toString())) {
          edges.push({
            edgeIndex: { index: row[i] },
            start: {
              x: vertexMap.get(row[i + 1].toString()).x,
              y: vertexMap.get(row[i + 1].toString()).y,
            },
            end: {
              x: vertexMap.get(row[i + 2].toString()).x,
              y: vertexMap.get(row[i + 2].toString()).y,
            },
          });
        }
      }
    }
  }
  return edges;
}
function locateEdges(M, edges) {
  const rezultate = [];

  for (const edge of edges) {
    const start = edge.start;
    const end = edge.end;

    const delta =
      (end.x - start.x) * (M.y - start.y) - (end.y - start.y) * (M.x - start.x);

    if (delta > 0) {
      rezultate.push({ edge, position: "stanga" });
    } else if (delta < 0) {
      rezultate.push({ edge, position: "dreapta" });
    } else {
      rezultate.push({ edge, position: "pe linie" });
    }
  }

  return rezultate;
}
function assignFace(edges, DCEL) {
  console.log("~entering findFace");
  let closestFace = [];
  for (const edge of edges) {
    let vertex = edge.edge.edgeIndex.index;
    let position = edge.position;
    console.log("vertex: ");
    console.log(vertex);
    console.log("position: " + position);
    for (let row of DCEL) {
      for (let i = 0; i < row.length - 1; i++) {
        if (i == 0 && row[i] == vertex) {
          console.log("found vertex: " + row[i]);
          if (position == "stanga") {
            console.log("face: " + row[4] + "for vertex " + vertex);
            closestFace.push({
              edge: vertex,
              face: row[4],
            });
          } else if (position == "dreapta") {
            console.log("face: " + row[3] + "for vertex " + vertex);
            closestFace.push({
              edge: vertex,
              face: row[3],
            });
          }
        }
      }
    }
  }
  return closestFace;
}
function findFace(closestFace) {
  let foundFace = -1;

  for (let i = 0; i < closestFace.length; i++) {
    for (let j = i + 1; j < closestFace.length; j++) {
      if (closestFace[i].face === closestFace[j].face) {
        foundFace = closestFace[i].face;
        return foundFace;
      }
    }
  }

  return foundFace;
}
