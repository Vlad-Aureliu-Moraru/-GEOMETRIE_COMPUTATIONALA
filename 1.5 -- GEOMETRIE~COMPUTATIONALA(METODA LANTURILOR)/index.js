const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let lanturi;
let vertexMap = new Map();
let multimeaA = new Map();
let multimeaB = new Map();
let colectedVertecies = null;

const container = document.getElementById("lanturi-container");
const answerContainer = document.getElementById("raspuns-container");

//note: adds dcel row
function addRow() {
  console.log("~ Adding Row...");
  const tableBody = document.getElementById("DCEL");
  const newRow = document.createElement("tr");
  for (let i = 0; i < 4; i++) {
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
    console.log("/ DCEL : ");
    console.log(DCEL);

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
  ctx.fillStyle = selectedVertex === "M" ? "purple" : "white";
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
        ctx.fillText(`${1}`, midX, midY);
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
    const vertex1 = DCEL[i][0];
    const vertex2 = DCEL[i][1];

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
      (DCEL[i][0] === a && DCEL[i][1] === b) ||
      (DCEL[i][0] === b && DCEL[i][1] === a)
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
    let value = DCEL[i][0];
    for (let j = 0; j < DCEL.length; j++) {
      if (DCEL[j][0] === value) {
        edges.push(1);
      }
      multimeaB.set(value, edges.length);
    }
  }
  return multimeaB;
}

function creazaMultimeaA(DCEL) {
  let multimeaA = new Map();

  for (let i = 0; i < DCEL.length; i++) {
    let edges = [];
    let value = DCEL[i][1];
    for (let j = 0; j < DCEL.length; j++) {
      if (DCEL[j][1] === value) {
        edges.push(1);
      }
      multimeaA.set(value, edges.length);
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
}
function MetodaLanturilor() {
  //step:0 seteaza ponderile initiale cu 0
  let ponderea = setPonderea1(DCEL);
  if (vertexMap.size < colectedVertecies.length + 1) {
    alert("Introdu Toate Coordonatele");
    return;
  } else {
    //step:1 Balanseaza PSLG-ul
    seteazaPonderea(DCEL, colectedVertecies, multimeaA, multimeaB, ponderea);
    //step:2 Balanseaza PSLG-ul invers
    seteazaPondereaInvers(
      DCEL,
      colectedVertecies,
      multimeaB,
      multimeaA,
      ponderea
    );
    //step:3 Update la ponderea fiecarui varf (grafic)
    for (let i of ponderea) {
      redrawEdge(i.varfuri[0], i.varfuri[1], i.ponderea);
    }
    //step:4 Creaza fiecare Lant
    creazaLanturi(colectedVertecies, DCEL, ponderea);
    //step:5 Localizeaza M pe lant
    localizeazaMpeLant(colectedVertecies, vertexMap, lanturi, DCEL);
    console.log(lanturi);
  }
}

function setPonderea1(DCEL) {
  let ponderea = [];
  for (let i = 0; i < DCEL.length; i++) {
    ponderea.push({
      varfuri: [DCEL[i][0], DCEL[i][1]],
      ponderea: 1,
    });
  }
  return ponderea;
}
function addPonderea(v1, v2, value, ponderea) {
  console.log("entering addPonderea");
  console.log(`${v1}  ; ${v2} : ${value}`);
  for (let i of ponderea) {
    if (i.varfuri[0] == v1 && i.varfuri[1] == v2) {
      i.ponderea += value;
    }
  }
  console.log("exiting addPonderea");
}
function setPonderea(v1, v2, value, ponderea) {
  console.log("entering setPonderea");
  console.log(`${v1}  ; ${v2} : ${value}`);
  for (let i of ponderea) {
    if (i.varfuri[0] == v1 && i.varfuri[1] == v2) {
      i.ponderea = value;
    }
  }
  console.log("exiting setPonderea");
}
function getCeaMaiDinStangaLatura(vertexMap, filtru, reperX, right) {
  let farLeft = null; // Variabilă pentru coordonata \( x \) cea mai mare sau mică
  let farLeftKey = null; // Cheia punctului corespunzător

  console.log("*entering getCeaMaiDinStangaLatura");
  for (let [key, value] of vertexMap) {
    if (filtru.includes(key)) {
      if (right) {
        // Căutăm cel mai mare \( x \)
        if (farLeft == null || value.x > farLeft) {
          farLeft = value.x;
          farLeftKey = key;
        }
      } else {
        // Căutăm cel mai mic \( x \)
        if (farLeft == null || value.x < farLeft) {
          farLeft = value.x;
          farLeftKey = key;
        }
      }
    }
  }

  return farLeftKey !== null
    ? { key: farLeftKey, coordinates: vertexMap.get(farLeftKey) }
    : null;
}
function creazaLanturi(colectedVertecies, DCEL, ponderea) {
  let varfulStart = colectedVertecies[0];
  let numarulDeLanturi = getPondereMaxima(ponderea);

  lanturi = creazaFiecareLant(
    varfulStart,
    colectedVertecies,
    DCEL,
    ponderea,
    numarulDeLanturi
  );
  container.innerHTML = "";
  for (let j of lanturi) {
    string = `${j} `;

    let temp = document.createElement("h2");
    temp.textContent = string;
    container.appendChild(temp);
    console.log(string);
  }
}
function addPondereaToMap(key, value, pondereaMap) {
  console.log(`~ Entering addPonderea`);
  console.log(`Key: ${key}, Value to add: ${value}`);

  if (pondereaMap.has(key)) {
    // Adaugă valoarea la cea existentă
    const currentValue = pondereaMap.get(key);
    pondereaMap.set(key, currentValue + value);
    console.log(`Updated key ${key} to value ${currentValue + value}`);
  } else {
    // Dacă cheia nu există, adaugă direct
    pondereaMap.set(key, value);
    console.log(`Added new key ${key} with value ${value}`);
  }
  console.log("~Exiting addPonderea");
}
function seteazaPonderea(
  DCEL,
  colectedVertecies,
  multimeaA,
  multimeaB,
  ponderea
) {
  const interiorVertices = colectedVertecies.slice(
    1,
    colectedVertecies.length - 1
  );
  console.log(interiorVertices);

  //step: incep de la v[2] pana la v[n-1]
  for (let curent of interiorVertices) {
    let mA = multimeaA.get(curent.toString());
    let mB = multimeaB.get(curent.toString());

    if (mA > mB) {
      let conections = getConnections(curent, DCEL, false);
      let celMaiDinStangaVarf = getCeaMaiDinStangaLatura(
        vertexMap,
        conections,
        curent,
        false
      );
      newMB = mA - mB;
      //step:adaug ponderea pentru v[curent] si v[celMaiDinSt] si fac uppdate multimii A al v[celMaiDinSt]
      addPonderea(curent, celMaiDinStangaVarf.key.toString(), newMB, ponderea);
      addPondereaToMap(celMaiDinStangaVarf.key.toString(), newMB, multimeaA);
    }
  }
}

function seteazaPondereaInvers(
  DCEL,
  colectedVertecies,
  multimeaA,
  multimeaB,
  ponderea
) {
  const interiorVertices = colectedVertecies.slice(
    1,
    colectedVertecies.length - 1
  );
  interiorVertices.reverse();
  console.log(interiorVertices);

  for (let curent of interiorVertices) {
    let mA = multimeaA.get(curent.toString());
    let mB = multimeaB.get(curent.toString());
    console.log(`~${curent}`);
    console.log(mA);
    console.log(mB);
    console.log("~");
    console.log(curent);

    if (mA > mB) {
      console.log("~~ Entering If (mA>mB)");
      let conections = getConnections(curent, DCEL, true);
      console.log(conections);
      let farLeft = getCeaMaiDinStangaLatura(
        vertexMap,
        conections,
        curent,
        false
      );
      console.log(farLeft);
      newMB = mA - mB;
      console.log(newMB);
      addPonderea(farLeft.key.toString(), curent, newMB, ponderea);
      addPondereaToMap(farLeft.key.toString(), newMB, multimeaA);
      console.log("multimeaA");
      console.log(multimeaA.get(farLeft.key.toString()));
    }
  }

  console.log("Ponderi după modificare:");
  for (const edge of ponderea) {
    console.log(`Muchia ${edge.varfuri} are ponderea ${edge.ponderea}`);
  }
}
function getConnections(vertex, DCEL, reverse) {
  const connections = [];
  for (const edge of DCEL) {
    if (!reverse) {
      if (edge[0] === vertex) connections.push(edge[1]);
    } else {
      if (edge[1] === vertex) connections.push(edge[0]);
    }
  }
  return connections;
}
function redrawEdge(vertex1, vertex2, value) {
  const startX = centerX + vertexMap.get(vertex1).x * 10;
  const startY = centerY - vertexMap.get(vertex1).y * 10;
  const endX = centerX + vertexMap.get(vertex2).x * 10;
  const endY = centerY - vertexMap.get(vertex2).y * 10;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Calculate the midpoint of the edge to label it
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  ctx.font = "27px Arial";
  ctx.fillStyle = "blue";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(value, midX, midY); // Display the updated weight or label
}
function getPonderea(v1, v2, ponderea) {
  for (let edge of ponderea) {
    if (edge.varfuri[0] === v1 && edge.varfuri[1] === v2) {
      return edge.ponderea;
    }
  }
  return null;
}
function getPondereMaxima(ponderea) {
  let sum = 0;
  for (let edge of ponderea) {
    if (edge.varfuri[0] == "1") {
      sum += edge.ponderea;
    }
  }
  return sum;
}

function removeElement(array, value) {
  const index = array.indexOf(value); // Find the index of the element

  if (index !== -1) {
    // Check if the element exists in the array
    array.splice(index, 1); // Remove the element at that index
  }
}

function creazaFiecareLant(i, colectedVertecies, DCEL, ponderea, max) {
  let lanturi = [];
  for (let j = 0; j < max; j++) {
    let temp = [];
    let varfulDeInceput = i;
    while (varfulDeInceput != colectedVertecies[colectedVertecies.length - 1]) {
      let conections = getConnections(varfulDeInceput, DCEL, false);
      let celMaiDinStangaVarf = getCeaMaiDinStangaLatura(
        vertexMap,
        conections,
        varfulDeInceput,
        false
      );
      if (
        getPonderea(varfulDeInceput, celMaiDinStangaVarf.key, ponderea) == 0
      ) {
        while (true) {
          //elimina elementul al carui muchie e cu ponderea 0  din conectiuni
          removeElement(conections, celMaiDinStangaVarf.key.toString());
          //gaseste urmatorul cel mai din st varf
          celMaiDinStangaVarf = getCeaMaiDinStangaLatura(
            vertexMap,
            conections,
            varfulDeInceput,
            false
          );
          //daca nu au fost gasite muchii valide
          if (!celMaiDinStangaVarf) {
            break;
          }
          //verifica ponderea pentru urmatoarea muchie
          if (
            getPonderea(varfulDeInceput, celMaiDinStangaVarf.key, ponderea) != 0
          ) {
            break;
          }
        }
      }
      addPonderea(varfulDeInceput, celMaiDinStangaVarf.key, -1, ponderea);
      if (!temp.includes(varfulDeInceput)) {
        temp.push(varfulDeInceput);
      }
      varfulDeInceput = celMaiDinStangaVarf.key.toString();
      if (!temp.includes(celMaiDinStangaVarf.key.toString())) {
        temp.push(celMaiDinStangaVarf.key);
      }
    }
    lanturi.push(temp);
  }
  return lanturi;
}
function localizeazaMpeLant(colectedVertecies, vertexMap, lanturi, DCEL) {
  let M = vertexMap.get("M");
  let primulVarf = vertexMap.get(colectedVertecies[0].toString());
  let ultimulVarf = vertexMap.get(
    colectedVertecies[colectedVertecies.length - 1].toString()
  );
  let inFigura = false;
  //step: verific daca M este intre Y-cii capetelor PSLG-ului
  if (M.y > primulVarf.y && M.y < ultimulVarf.y) {
    inFigura = true;
    console.log("Se Afla In Figura");
  }
  let pozitiileLuiMfataDeDr = [];
  //step:verifc pentru fiecare lant daca M e la st/dr muchiei
  for (let i = 0; i < lanturi.length; i++) {
    let vIntreCareSeAflaM = closestPair(M, lanturi[i], vertexMap);
    edges = [vIntreCareSeAflaM.firstVertex, vIntreCareSeAflaM.lastVertex];
    let rezultate = localizeazaMfataDeMuchie(M, edges, vertexMap);
    pozitiileLuiMfataDeDr.push(rezultate);
  }

  let lantulLaDreaptaCaruiaSeAflaM = specificaLantul(pozitiileLuiMfataDeDr);

  console.log(lantulLaDreaptaCaruiaSeAflaM.muchie);
  let FataLocalizata = getFaceR(
    lantulLaDreaptaCaruiaSeAflaM.muchie[0],
    lantulLaDreaptaCaruiaSeAflaM.muchie[1],
    DCEL
  );
  answerContainer.innerHTML = "";
  let answer = document.createElement("h3");
  if (lantulLaDreaptaCaruiaSeAflaM.lant && FataLocalizata) {
    answer.textContent = `Punctul M se afla imediat dupa lantul ${lantulLaDreaptaCaruiaSeAflaM.lant} pe fata ${FataLocalizata} `;
  } else {
    answer.textContent = `Punctul M nu este in figura`;
  }
  answerContainer.appendChild(answer);
}
function localizeazaMfataDeMuchie(M, edges, vertexMap) {
  let rezultate = [];

  const start = vertexMap.get(edges[0].toString());
  const end = vertexMap.get(edges[1].toString());
  edge = [edges[0].toString(), edges[1].toString()];
  const delta =
    (end.x - start.x) * (M.y - start.y) - (end.y - start.y) * (M.x - start.x);

  if (delta > 0) {
    rezultate = { edge, position: "stanga" };
  } else if (delta < 0) {
    rezultate = { edge, position: "dreapta" };
  } else {
    rezultate = { edge, position: "pe linie" };
  }

  return rezultate;
}
function isBetween(M, A, B) {
  // Compute vectors
  const AM = { x: M.x - A.x, y: M.y - A.y };
  const AB = { x: B.x - A.x, y: B.y - A.y };

  // Compute dot products
  const dotProductAMAB = AM.x * AB.x + AM.y * AB.y;
  const dotProductABAB = AB.x * AB.x + AB.y * AB.y;

  // Check if projection is between A and B
  return dotProductAMAB >= 0 && dotProductAMAB <= dotProductABAB;
}

function distance(P1, P2) {
  return Math.sqrt((P2.x - P1.x) ** 2 + (P2.y - P1.y) ** 2);
}

function closestPair(M, points, vertexMap) {
  let closest = null;
  let minDistance = Infinity;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const A = vertexMap.get(points[i].toString());
      const B = vertexMap.get(points[j].toString());

      if (isBetween(M, A, B)) {
        const d = distance(M, A) + distance(M, B);
        if (d < minDistance) {
          minDistance = d;
          let firstVertex = getKeyByValue(vertexMap, A);
          let lastVertex = getKeyByValue(vertexMap, B);
          closest = { firstVertex, lastVertex };
        }
      }
    }
  }

  return closest;
}
function getKeyByValue(map, value) {
  for (let [key, val] of map.entries()) {
    if (val == value) {
      return key;
    }
  }
}
function specificaLantul(directii) {
  let found = false;
  let lant;
  let muchie;

  for (let i = 0; i < directii.length; i++) {
    if (
      directii[i].position == "dreapta" &&
      directii[i + 1].position == "stanga"
    ) {
      found = true;
      lant = i + 1;
      muchie = directii[i].edge;
      break;
    }
  }
  return found ? { lant: lant, muchie: muchie } : null;
}
function getFaceR(a, b, DCEL) {
  for (let row of DCEL) {
    if (row[0] == a && row[1] == b) {
      return row[2];
    }
  }
  return null;
}
