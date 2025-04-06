let points = [];
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

function addPoint() {
  const x = parseFloat(document.getElementById("x").value);
  const y = parseFloat(document.getElementById("y").value);

  if (isNaN(x) || isNaN(y)) {
    alert("Please enter valid numeric values for X and Y.");
    return;
  }

  points.push([x, y]);

  const canvasX = centerX + x * 5;
  const canvasY = centerY - y * 5;

  ctx.beginPath();
  ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();

  console.log(points);
}
function random() {
  points = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 15; i++) {
    const x = Math.floor(Math.random() * 21) - 10;
    const y = Math.floor(Math.random() * 21) - 10;

    points.push([x, y]);

    const canvasX = centerX + x * 5;
    const canvasY = centerY - y * 5;

    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
  }
}
function clearPoints() {
  points = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function jarvisMarch(points) {
  // Funcție pentru calcularea orientării
  function orientation(p, q, r) {
    return (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
  }

  // Funcție pentru calcularea distanței
  function distance(p, q) {
    return Math.sqrt((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2);
  }

  // Pasul 1: Găsește punctul cu abscisa minimă (cel mai din stânga)
  let start = points.reduce(
    (leftmost, p) =>
      p[0] < leftmost[0] || (p[0] === leftmost[0] && p[1] < leftmost[1])
        ? p
        : leftmost,
    points[0]
  );

  let hull = [];
  let current = start;

  do {
    hull.push(current); // Adaugă punctul curent în convex

    // Pasul 2: Găsește următorul punct din convex
    let next = points[0];
    for (let p of points) {
      if (p === current) continue;

      let o = orientation(current, next, p);
      if (
        o > 0 ||
        (o === 0 && distance(current, p) > distance(current, next))
      ) {
        next = p;
      }
    }

    current = next; // Treci la următorul punct
  } while (current !== start); // Repetă până te întorci la punctul de start

  return hull;
}

function convexHull() {
  const convexHull = jarvisMarch(points);
  console.log("Punctele din convex hull:", convexHull);
  for (let i = 0; i < convexHull.length; i++) {
    const p1 = convexHull[i];
    const p2 = convexHull[(i + 1) % convexHull.length];

    const canvasP1 = [centerX + p1[0] * 5, centerY - p1[1] * 5];
    const canvasP2 = [centerX + p2[0] * 5, centerY - p2[1] * 5];

    ctx.beginPath();
    ctx.moveTo(canvasP1[0], canvasP1[1]);
    ctx.lineTo(canvasP2[0], canvasP2[1]);
    ctx.strokeStyle = "red";
    ctx.stroke();
  }
}
