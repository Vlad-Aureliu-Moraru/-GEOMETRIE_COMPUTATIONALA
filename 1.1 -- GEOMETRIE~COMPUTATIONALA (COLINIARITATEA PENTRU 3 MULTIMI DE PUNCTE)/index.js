let coordA = [];
let coordB = [];
let coordC = [];

const h1A = document.getElementById("vectA");
const h1B = document.getElementById("vectB");
const h1C = document.getElementById("vectC");

const result = document.getElementById("result");

function addToCoordA() {
  const inputA = document.getElementById("A").value;
  coordA.push(inputA);
  h1A.innerHTML = coordA.join(", ");
}
function addToCoordB() {
  const inputB = document.getElementById("B").value;
  coordB.push(inputB);
  h1B.innerHTML = coordB.join(", ");
}
function addToCoordC() {
  const inputC = document.getElementById("C").value;
  coordC.push(inputC);
  h1C.innerHTML = coordC.join(", ");
}
function debug() {
  console.log(coordA);
  console.log(coordB);
  console.log(coordC);
  aplicaAlgoritmul2(coordA, coordB, coordC);
}
function Sort(left, right) {
  let i = 0;
  let j = 0;
  let sorted = [];

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
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
function MergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let mid = Math.floor(arr.length / 2);
  let left = arr.slice(0, mid);
  let right = arr.slice(mid);

  return Sort(MergeSort(left), MergeSort(right));
}
function random() {
  for (let i = 0; i < 5; i++) {
    coordA.push(Math.floor(Math.random() * 20));
    h1A.innerHTML = coordA.join(", ");
  }
  for (let i = 0; i < 5; i++) {
    coordB.push(Math.floor(Math.random() * 20));
    h1B.innerHTML = coordB.join(", ");
  }
  for (let i = 0; i < 5; i++) {
    coordC.push(Math.floor(Math.random() * 20));
    h1C.innerHTML = coordC.join(", ");
  }
}

function aplicaAlgoritmul2(coordA, coordB, coordC) {
  result.innerText = "";
  console.log("apllying mergesort on B ...");
  coordB = MergeSort(coordB);
  let multimeaD = [];
  for (let i of coordB) {
    multimeaD.push(Number(i) * 2);
  }
  console.log(multimeaD);
  for (let i = 0; i < coordA.length; i++) {
    for (let j = 0; j < coordC.length; j++) {
      let sumAC = Number(coordA[i]) + Number(coordC[j]);
      console.log("suma A C " + sumAC);

      if (multimeaD.includes(sumAC)) {
        console.log("exista..");
        result.append(
          `A(${coordA[i]}) + C(${coordC[j]}) = ${sumAC}` + "  ______  "
        );
      }
    }
  }
}
