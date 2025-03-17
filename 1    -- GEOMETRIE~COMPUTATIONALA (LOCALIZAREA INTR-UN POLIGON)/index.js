const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const rasp = document.getElementById("Raspuns");
const nrIntersectii = document.getElementById("nrIntersectii");

let points = [];
let mode = "draw";
let M = null;
let nIntersectii = 0;

canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (mode === "draw") {
    points.push({ x, y });
    draw();
  } else if (mode === "placeM") {
    nIntersectii = 0;
    M = { x, y };
    const isInside = plaseazaM(M);
    draw();
    if (isInside == -1) {
      rasp.innerHTML = "Poligonul este pe margine!";
    } else {
      rasp.innerHTML = `Punctul este ${
        isInside ? "inauntrul" : "inafara"
      } poligonului.`;
    }
    nrIntersectii.innerHTML = `# intersectii ${nIntersectii}`;
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  points.forEach(function (point) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  if (points.length > 1) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "green ";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }
  if (M) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(M.x, M.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  if (points.length > 2) {
    checkIfTerminat();
  }
}

function checkIfTerminat() {
  const ultimPc = points[points.length - 1]; // Last point
  const primulPc = points[0]; // First point
  const admisibil = 10; // Tolerance to consider the shape closed

  const distanta = Math.sqrt(
    Math.pow(ultimPc.x - primulPc.x, 2) + Math.pow(ultimPc.y - primulPc.y, 2)
  );

  if (distanta <= admisibil) {
    // Shape is considered closed
    ctx.lineWidth = 3;
    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(ultimPc.x, ultimPc.y);
    ctx.lineTo(primulPc.x, primulPc.y);
    ctx.stroke();
  } else {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.stroke();
  }
}
function toggleMode() {
  mode = mode === "draw" ? "placeM" : "draw"; // Switch modes
  console.log(`Current mode: ${mode}`);
}
function plaseazaM() {
  for (let i = 0; i < points.length; i++) {
    let A = points[i];
    let B = points[(i + 1) % points.length];

    if (A.y === B.y && B.y === M.y) {
      if ((M.x - A.x) * (M.x - B.x) <= 0) {
        console.log("M este pe marginea externă a poligonului.");
        return -1;
      }
    }

    if (A.y > B.y) {
      let temp = A;
      A = B;
      B = temp;
    }

    if (A.y < M.y && M.y <= B.y) {
      let delta = (M.x - A.x) * (B.y - A.y) - (M.y - A.y) * (B.x - A.x);

      if (delta > 0) {
        nIntersectii++;
      } else if (delta === 0) {
        console.log("M este pe marginea externă a poligonului.");
        return -1;
      }
    }
  }

  if (nIntersectii % 2 === 1) {
    console.log("M este în interiorul poligonului.");
    return true;
  } else {
    console.log("M este în afara poligonului.");
    console.log(nIntersectii);
    return false;
  }
}
function clearCanvas() {
  points = [];
  M = null;
  draw();
}
