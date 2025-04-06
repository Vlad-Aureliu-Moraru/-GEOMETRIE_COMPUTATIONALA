let stringN = "";
let stringT = "";
let stringP = "";

let N = [];
let T = [];
T.push("0");
let P = new Map();

let newN;
let newP;
let newT;

let nnN;
let nnP;

let alg1 = document.getElementById("alg1-container");
let alg2 = document.getElementById("alg2-container");
let alg3 = document.getElementById("alg3-container");

function addToP() {
  let min = document.createElement("div");
  let first = document.createElement("input");
  let separator = document.createElement("h3");
  let second = document.createElement("input");
  first.style.height = "20px";
  first.style.width = "50px";
  second.style.height = "20px";
  second.style.minWidth = "50px";
  second.style.flexGrow = "1"; // Allows it to expand
  second.style.width = "100%";
  min.appendChild(first);

  separator.textContent = "➡️   ";
  min.appendChild(separator);
  min.appendChild(second);

  min.style.display = "flex";
  min.height = "200px";
  min.style.justifyContent = "center";
  min.style.alignItems = "center";
  min.style.gap = "5px";
  containerOfP.appendChild(min);
}
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target.result;
      console.log(content.trim());

      decideWhereToPutEach(content);

      stringN = stringN.replaceAll(" ", "");
      stringT = stringT.replaceAll(" ", "");
      stringP = stringP.replaceAll(" ", "");
      stringN = stringN.trim();
      stringP = stringP.trim();
      stringT = stringT.trim();

      if (checkN(stringN) && checkT(stringT) && checkP(stringP)) {
        console.group("~Passed the 1st test~");
        getN(stringN);
        getT(stringT);
        getP(stringP);
        console.log(P);
        console.log(T);
        console.log(N);
        algoritm1(N, P);
        algoritm2(newN, newP, T);
        algoritm3(nnN, nnP, newT);
        console.groupEnd("~Passed the 1st test~");
      } else {
        alert("Ai Date Gresite");
      }
    };

    reader.readAsText(file);
  } else {
    alert("No file selected");
  }
}

function checkN(N) {
  let regExp = /^N:{([A-Z];)*[A-Z]}$/;
  if (regExp.test(N)) {
    return true;
  } else {
    return false;
  }
}
function checkT(T) {
  let regExp = /^T:{([a-z];)*[a-z]}$/;
  if (regExp.test(T)) {
    return true;
  } else {
    return false;
  }
}
function checkP(P) {
  let regExp = /^P:\{([A-Z]>([a-zA-Z]*|0);)*[A-Z]>([a-zA-Z]*|0)\}$/;
  if (regExp.test(P)) {
    return true;
  } else {
    return false;
  }
}
function decideWhereToPutEach(string) {
  let lines = string.split("\n");

  lines.forEach((line) => {
    if (line.startsWith("N:")) {
      stringN += line + "\n";
    } else if (line.startsWith("T:")) {
      stringT += line + "\n";
    } else if (line.startsWith("P:")) {
      stringP += line + "\n";
    }
  });
}
function getN(stringN) {
  let start = stringN.indexOf("N:");
  let end = stringN.indexOf("\n");
  let newN = stringN.slice(start + 3, end);
  for (let i = 0; i < newN.length; i++) {
    if (newN[i] != ";") {
      N.push(newN[i]);
    }
  }
}
function getT(stringT) {
  let start = stringT.indexOf("T:");
  let end = stringT.indexOf("\n");
  let newN = stringT.slice(start + 3, end);
  for (let i = 0; i < newN.length; i++) {
    if (newN[i] != ";") {
      T.push(newN[i]);
    }
  }
}
function getP(stringP) {
  console.log("*Entering getP");
  let start = stringP.indexOf("P:");
  let end = stringP.indexOf("\n");
  let newP = stringP.slice(start + 3, end);
  let splitP = newP.split(";");
  for (let i = 0; i < splitP.length; i++) {
    let vect = [];
    let splitLine = splitP[i].split(">");
    let key = splitLine[0];
    let value = splitLine[1];
    if (P.get(key)) {
      vect = P.get(key);
      vect.push(value);
    } else {
      vect.push(value);
    }
    P.set(key, vect);
  }
}
function algoritm1(N, P) {
  console.group("~Starting algoritm 1 ");
  newN = [];

  //step:1 creates N'
  try {
    newN.push("S");
    let output = P.get(newN[0].toString());
    check(output, newN, N);
    for (let i = 1; i < newN.length; i++) {
      output = P.get(newN[i].toString());
      if (output) {
        check(output, newN, N);
      } else {
        console.error("No output found for " + newN[i]);
        newN.splice(i, 1);
        i--;
        console.warn("Deleted");
      }
    }
  } catch (e) {
    console.error(`Error: ${e}`);
    return;
  }

  console.log(newN);

  //step:2 creates P'

  newP = new Map();
  for (let key of newN) {
    filterP(newP, key, P.get(key), newN, T);
  }

  console.log(newP);
  let newPstring = mapToString(newP);

  let newNfield = document.createElement("h4");
  newNfield.textContent = "N' = " + "{ " + newN.join("; ") + " }";
  alg1.appendChild(newNfield);

  let newTfield = document.createElement("h4");
  newTfield.textContent = "T' = " + "{ " + T.join("; ") + " }";
  alg1.appendChild(newTfield);
  let newPfield = document.createElement("h4");
  newPfield.textContent = "P' = " + "{" + newPstring + "}";
  alg1.appendChild(newPfield);

  console.groupEnd("~Starting algoritm 1 ");
}
function algoritm2(newN, newP, T) {
  console.group("~Starting algoritm 2 ");

  newT = [];
  nnN = [];
  nnP = new Map();

  nnN.push("S");
  let productions = newP.get(nnN[0]);
  console.log(productions);
  forAlg2(productions, nnN, newT, T, newN);
  for (let i = 1; i < newN.length; i++) {
    productions = newP.get(nnN[i]);
    if (productions) {
      forAlg2(productions, nnN, newT, T, newN);
    }
  }
  for (let key of nnN) {
    filterP(nnP, key, newP.get(key), nnN, newT);
  }
  console.log(nnP);
  console.log(nnN);
  console.log(newT);

  let newPstring = mapToString(nnP);

  let newNfield = document.createElement("h4");
  newNfield.textContent = 'N" = ' + "{ " + nnN.join("; ") + " }";
  alg2.appendChild(newNfield);

  let newTfield = document.createElement("h4");
  newTfield.textContent = 'T" = ' + "{ " + newT.join("; ") + " }";
  alg2.appendChild(newTfield);
  let newPfield = document.createElement("h4");
  newPfield.textContent = 'P" = ' + "{" + newPstring + "}";
  alg2.appendChild(newPfield);

  console.groupEnd("~Starting algoritm 2 ");
}
function algoritm3(nnN, nnP, newT) {
  console.group("~Starting algoritm 3 ");
  let nullable = [];
  console.log(nnP);
  console.log(newT);

  getNullables(nnN, nullable, nnP);

  let nnnP = new Map();
  for (let key of nnN) {
    console.log(key);
    productions = nnP.get(key);
    console.log(productions);
    let temp = [];
    for (let production of productions) {
      if (hasNullable(production, nullable)) {
        console.log(`${key}=>${production} contains nullable`);
        alternateBetweenNullables(nullable, production, temp);
      } else {
        console.log(`${key}=>${production} doesn't contain nullable`);
        temp.push(production);
      }
    }
    filterPfor3(nnnP, key, temp, nnN, newT);
  }

  console.log("temp");
  //console.log(temp);
  console.log(nnnP);
  console.log(nullable);
  let newPstring = mapToString(nnnP);

  let newNfield = document.createElement("h4");
  newNfield.textContent = "N\"'= " + "{ " + nnN.join(", ") + " }";
  alg3.appendChild(newNfield);

  let newTfield = document.createElement("h4");
  newTfield.textContent = "T\"' = " + "{ " + newT.join(", ") + " }";
  alg3.appendChild(newTfield);
  let newPfield = document.createElement("h4");
  newPfield.textContent = "P\"' = " + "{" + newPstring + "}";
  alg3.appendChild(newPfield);
  console.groupEnd("~Starting algoritm 3 ");
}
function check(output, newN, N) {
  for (let i of output) {
    for (let j of i) {
      if (N.includes(j) && !newN.includes(j)) {
        console.log(`added ${j} to newN`);
        newN.push(j);
      }
    }
  }
  console.log(newN);
}
function mapToString(map) {
  let string = "";
  map.forEach((value, key) => {
    if (Array.isArray(value)) {
      value = value.join(" | ");
    }
    string += `${key} => ${value} ; `;
  });
  return string.slice(0, -2);
}
function filterP(newP, key, productions, newN, T) {
  console.group("~Filtering P ");
  console.log(productions);
  console.log(newN);
  console.log(T);
  let temp = [];

  for (let production of productions) {
    let isValid = true;
    if (production == "") {
      production = "0";
    }
    for (let j = 0; j < production.length; j++) {
      if (!newN.includes(production[j]) && !T.includes(production[j])) {
        console.warn(
          `Invalid symbol in production: ${production[j]} in production ${production}`
        );
        isValid = false;
        break;
      }
    }

    if (isValid && !temp.includes(production)) {
      temp.push(production);
    }
  }

  newP.set(key, temp);
  console.log(newP);
  console.groupEnd("~Filtering P ");
}
function forAlg2(productions, nnN, newT, T, newN) {
  for (let production of productions) {
    for (let j = 0; j < production.length; j++) {
      if (!nnN.includes(production[j]) && newN.includes(production[j])) {
        nnN.push(production[j]);
      }
    }
  }
  //step:  if there are terminals in the prod add to T" if not added
  for (let production of productions) {
    for (let j = 0; j < production.length; j++) {
      if (!newT.includes(production[j]) && T.includes(production[j])) {
        newT.push(production[j]);
      }
    }
  }
}

function isStringComposedOfVectorElements(string, vector) {
  let stringElements = string.split("");
  return stringElements.every((char) => vector.includes(char));
}
function getNullables(nnN, nullable, nnP) {
  while (true) {
    let added = false;
    for (let key of nnN) {
      let productions = nnP.get(key);
      for (let production of productions) {
        for (let j = 0; j < production.length; j++) {
          if (
            production[j] == "0" ||
            isStringComposedOfVectorElements(production, nullable)
          ) {
            if (!nullable.includes(key)) {
              nullable.push(key);
              added = true;
            }
          }
        }
      }
    }
    if (!added) {
      break;
    }
  }
}
function hasNullable(production, nullable) {
  for (let char of production) {
    if (nullable.includes(char)) {
      return true;
    }
  }
  return false;
}
function alternateBetweenNullables(nullable, production, temp) {
  console.group("*Alternating Between Nullables");
  //step: get the indexes of the nullable elements
  let indexes = [];
  let newProd;
  for (let i = 0; i < production.length; i++) {
    if (nullable.includes(production[i])) {
      indexes.push(i);
    }
  }
  console.log("indexes: ", indexes);

  //step:create the truth table
  let truthTable = assignEachValueTF(indexes);
  for (let i = 0; i < truthTable.length; i++) {
    newProd = production;
    console.log("Reseting To :", newProd);
    let charToDelete = [];
    for (let j = 0; j < truthTable[0].length; j++) {
      if (truthTable[i][j] == 0) {
        charToDelete.push(indexes[j]);
      }
    }
    console.log("charToDelete: ", charToDelete);
    for (let index of charToDelete) {
      console.log(`deleting char at index ${index} (${newProd.charAt(index)})`);
      newProd = replaceChar(newProd, " ", index);
    }
    newProd = newProd.replaceAll(" ", "");

    if (!temp.includes(newProd) && newProd.length > 0) {
      temp.push(newProd);
      console.log(`pushing ${newProd}`);
    }
  }

  console.groupEnd("*Alternating Between Nullables");
}

function assignEachValueTF(nullable) {
  let numVars = nullable.length;
  let table = [];

  for (let i = 0; i < Math.pow(2, numVars); i++) {
    let row = [];
    for (let j = numVars - 1; j >= 0; j--) {
      row.push((i >> j) & 1);
    }
    table.push(row);
  }

  return table;
}
function replaceChar(origString, replaceChar, index) {
  let firstPart = origString.substr(0, index);
  let lastPart = origString.substr(index + 1);

  let newString = firstPart + replaceChar + lastPart;
  return newString;
}

function filterPfor3(newP, key, productions, newN, T) {
  console.group("~Filtering P for 3 ");
  console.log(productions);
  console.log(newN);
  console.log(T);
  let temp = [];

  for (let production of productions) {
    let isValid = true;
    for (let j = 0; j < production.length; j++) {
      if (
        (!newN.includes(production[j]) && !T.includes(production[j])) ||
        production === "0"
      ) {
        console.warn(
          `Invalid symbol in production: ${production[j]} in production ${production}`
        );
        isValid = false;
        break;
      }
    }

    if (isValid && !temp.includes(production)) {
      temp.push(production);
    }
  }

  newP.set(key, temp);
  console.log(newP);
  console.groupEnd("~Filtering P ");
}
