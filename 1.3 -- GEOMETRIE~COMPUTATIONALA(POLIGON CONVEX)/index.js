const coordonatelePoligonului = [];
let coordonateM;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let points = []; // Array-ul de puncte

// Setează punctul de origine (centru) al axelor
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Desenează axele X și Y
function deseneazaAxe() {
  // Desenează axa X
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();

  // Desenează axa Y
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();
}

function adaugaVarfPoligon() {
  const x = parseFloat(document.getElementById("x").value); // Convert the input to a number
  const y = parseFloat(document.getElementById("y").value); // Convert the input to a number

  if (!isNaN(x) && !isNaN(y)) {
    coordonatelePoligonului.push([x, y]); // Add the point to the polygon
    document.getElementById("x").value = "";
    document.getElementById("y").value = "";

    const canvasX = centerX + x * 10; // X pe canvas
    const canvasY = centerY - y * 10; // Y pe canvas (inversăm Y-ul pentru a respecta coordonatele grafice)

    points.push({ x: canvasX, y: canvasY });

    // Desenează punctul pe canvas cu un cerc mic (radius=3)
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 1, 0, 2 * Math.PI); // Desenează cerc pentru punct cu raza de 3
    ctx.fillStyle = "blue"; // Culoarea punctului
    ctx.fill();

    // Desenează linii între punctele adăugate
    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y); // Punctul anterior
      ctx.lineTo(canvasX, canvasY); // Punctul curent
      ctx.stroke();
    }
    console.log(coordonatelePoligonului);
  } else {
    console.log("Please enter valid numbers for X and Y.");
  }
}

function adaugaM() {
  const x = parseFloat(document.getElementById("x").value);
  const y = parseFloat(document.getElementById("y").value);

  if (!isNaN(x) && !isNaN(y)) {
    coordonateM = [x, y];
    document.getElementById("x").value = "";
    document.getElementById("y").value = "";

    const canvasX = centerX + x * 10; // X pe canvas
    const canvasY = centerY - y * 10; // Y pe canvas (inversăm Y-ul pentru a respecta coordonatele grafice)

    // Desenează punctul pe canvas
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 1, 0, 2 * Math.PI); // Desenează cerc pentru punct
    ctx.fillStyle = "red";
    ctx.fill();

    console.log(coordonateM);
  } else {
    console.log("Please enter valid numbers for X and Y.");
  }
}

function centrulDeGreutate(coordonatelePoligonului) {
  let Cx = 0;
  let Cy = 0;
  let A = calculeazaAria(coordonatelePoligonului);
  const n = coordonatelePoligonului.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n; // pentru a închide poligonul, conectează ultimul punct la primul
    const factor =
      coordonatelePoligonului[i][0] * coordonatelePoligonului[j][1] -
      coordonatelePoligonului[j][0] * coordonatelePoligonului[i][1];
    Cx +=
      (coordonatelePoligonului[i][0] + coordonatelePoligonului[j][0]) * factor;
    Cy +=
      (coordonatelePoligonului[i][1] + coordonatelePoligonului[j][1]) * factor;
  }

  Cx = Cx / (6 * A);
  Cy = Cy / (6 * A);

  return [Cx, Cy];
}

function calculeazaAria(coordonatelePoligonului) {
  let area = 0;
  const n = coordonatelePoligonului.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n; // pentru a închide poligonul, conectează ultimul punct la primul
    area +=
      coordonatelePoligonului[i][0] * coordonatelePoligonului[j][1] -
      coordonatelePoligonului[j][0] * coordonatelePoligonului[i][1];
  }

  return Math.abs(area / 2); // aria trebuie să fie pozitivă
}

function punctInTriunghi(M, A, B, C) {
  function aria(P, Q, R) {
    return P[0] * (Q[1] - R[1]) + Q[0] * (R[1] - P[1]) + R[0] * (P[1] - Q[1]);
  }

  // Calculate the area of the main triangle (ABC)
  const areaABC = Math.abs(aria(A, B, C));

  // Calculate the areas of the sub-triangles (MAB, MBC, MCA)
  const areaMAB = Math.abs(aria(M, A, B));
  const areaMBC = Math.abs(aria(M, B, C));
  const areaMCA = Math.abs(aria(M, C, A));

  // The point M is inside the triangle if the sum of the sub-triangle areas equals the main triangle's area
  const totalArea = areaMAB + areaMBC + areaMCA;

  const epsilon = 1e-6; // Allow for floating point precision errors
  const isInside = Math.abs(totalArea - areaABC) < epsilon;

  return isInside;
}

function orderVerticesCounterClockwise(coordonatelePoligonului) {
  // Calculate centroid of the polygon
  const centroid = centrulDeGreutate(coordonatelePoligonului);
  let Cx = centroid[0];
  let Cy = centroid[1];

  // Calculate angle for each vertex relative to centroid
  const verticesWithAngles = coordonatelePoligonului.map(([x, y]) => {
    const angle = Math.atan2(y - Cy, x - Cx);
    return { x, y, angle };
  });

  // Sort vertices by angle in counterclockwise order
  verticesWithAngles.sort((a, b) => a.angle - b.angle);

  // Return the vertices in counterclockwise order
  return verticesWithAngles.map(({ x, y }) => [x, y]);
}

function metodaPenelor(coordonatelePoligonului, M) {
  //SORTEAZA VARFURILE IN SENS DIRECT TRIGONOMETRIC
  const sortedVertices = orderVerticesCounterClockwise(coordonatelePoligonului);

  const n = sortedVertices.length;
  let isInsideFan = false;

  // MERG PRIN FIECARE VARF SI VERIFIC PENELE
  for (let i = 0; i < n; i++) {
    const prevVertex = sortedVertices[(i - 1 + n) % n]; // VARFUL PRECEDENT
    const currentVertex = sortedVertices[i]; // VARFUL CURENT
    const nextVertex = sortedVertices[(i + 1) % n]; // VARFUL URMATOR

    // VERIFIC DACA PUNCTUL M SE AFLA IN TRIUNGHIUL FORMAT DE CEI 3
    if (punctInTriunghi(M, prevVertex, currentVertex, nextVertex)) {
      isInsideFan = true;
      break; // IES DIN FOR DACA GASESC PUNCTUL M
    }
  }

  return isInsideFan;
}
function closefigure() {
  if (points.length > 2) {
    // Ensure that there are at least 3 points
    // Start a new path to close the shape
    ctx.beginPath();

    // Move to the last point
    ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);

    // Draw a line to the first point to close the shape
    ctx.lineTo(points[0].x, points[0].y);

    // Draw the line
    ctx.stroke();
  } else {
    alert("Introdu cel puțin 3 puncte pentru a închide figura.");
  }
}
function isConvexPolygon(vertices) {
  const n = vertices.length;
  let previousSign = 0;

  for (let i = 0; i < n; i++) {
    const A = vertices[i];
    const B = vertices[(i + 1) % n]; // Next vertex, wraps around
    const C = vertices[(i + 2) % n]; // Next to next vertex, wraps around

    // Vectors AB and BC
    const ABx = B[0] - A[0];
    const ABy = B[1] - A[1];
    const BCx = C[0] - B[0];
    const BCy = C[1] - B[1];

    // Cross product of vectors AB and BC
    const crossProduct = ABx * BCy - ABy * BCx;

    // Determine the sign of the cross product (clockwise or counterclockwise)
    const currentSign = Math.sign(crossProduct);

    // If currentSign is 0, it's a collinear point and doesn't affect convexity
    if (currentSign !== 0) {
      // If previousSign exists and differs from currentSign, it's concave
      if (previousSign !== 0 && previousSign !== currentSign) {
        return false; // Concave
      }

      // Set the previousSign for the next iteration
      previousSign = currentSign;
    }
  }

  return true; // Convex
}
function solve() {
  if (isConvexPolygon(coordonatelePoligonului)) {
    const isInsideFan = metodaPenelor(coordonatelePoligonului, coordonateM);
    console.log("Punctul M se afla in una din pene ?" + "\n" + isInsideFan);
  } else {
    alert(" nu e bines");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
deseneazaAxe();

