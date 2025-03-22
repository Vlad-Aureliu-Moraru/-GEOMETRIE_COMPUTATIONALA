function calculeazaDeterminant(a, b, c) {
  let sum1 = a[0] * b[1] + b[0] * c[1] + c[0] * a[1];
  let sum2 = c[0] * b[1] + b[0] * a[1] + a[0] * c[1];
  console.log(sum1 - sum2);
  return sum1 - sum2;
}

function solve(coord, punct) {
  // Check if the triangle vertices are collinear
  if (calculeazaDeterminant(coord[0], coord[1], coord[2]) === 0) {
    console.log("Punctele sunt coliniare");
    return false;
  }

  // Calculate determinants with the point `punct`
  let det1 = calculeazaDeterminant(punct, coord[0], coord[1]);
  let det2 = calculeazaDeterminant(punct, coord[1], coord[2]);
  let det3 = calculeazaDeterminant(punct, coord[2], coord[0]);

  console.log("determinantii sunt : " + det1, det2, det3);
  // Check if all determinants have the same sign
  let isInTriangle = checkSign(det1, det2, det3);
  return isInTriangle;
}

function checkSign(a, b, c) {
  return (a > 0 && b > 0 && c > 0) || (a < 0 && b < 0 && c < 0);
}

// Example usage
const ex = [
  [1, 1],
  [4, 4],
  [6, 1],
];
const M = [4, 2];

const result = solve(ex, M);
console.log(
  result ? "Point is inside the triangle" : "Point is outside the triangle"
);
