let listAutomata = [[]];
let listFinal = [];
let listInitial = [];
let Q = [];
let E = [];
let test1 = true;
let test2 = true;
let test3 = true;
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target.result;

      determineWhichToPut(content, listAutomata, listInitial, listFinal);
      verifyAutomata(listAutomata);

      if (test1 == true && test2 == true && test3 == true) {
        console.log("Este Determinist :" + isDeterminist(listAutomata));
        countStates(listAutomata);
        countAlphabet(listAutomata);
        console.log("alphabet : " + E);
        console.log("count states :" + Q);
        console.log(listAutomata);
        console.log(listInitial);
        console.log(listFinal);
        document.getElementById("alphabet").textContent +=
          " = " + "{" + E + "}";
        document.getElementById("states").textContent += " = " + "{" + Q + "}";
        document.getElementById("final").textContent +=
          " = " + "{" + listFinal + "}";
        document.getElementById("initial").textContent +=
          " = " + "{" + listInitial + "}";
      } else {
        alert("Automatul Nu Este Corect Scris");
      }
    };

    reader.readAsText(file);
  } else {
    alert("No file selected");
  }
}
function putAutomataInVector(text, vector, start) {
  let i = 0;
  let tempString = "";

  for (let j = start; j < text.length; j++) {
    if (text[j] === "{") {
      if (!vector[i]) {
        vector[i] = [];
      }
    } else if (text[j] === ";") {
      if (tempString) {
        vector[i].push(tempString);
        tempString = "";
      }
    } else if (text[j] === "}") {
      if (tempString) {
        vector[i].push(tempString);
        tempString = "";
      }
      i++;
    } else if (text[j] !== " " && text[j] !== "\r" && text[j] !== "\n") {
      tempString += text[j];
    }
  }

  if (vector[vector.length - 1].length === 0) {
    vector.pop();
  }
}
function determineWhichToPut(text, listAutomata, listInitial, listFinal) {
  for (let i = 0; i < text.length; i++) {
    if (text.substring(i, i + 8) === "#Initial") {
      i += 8;
      Initial(text, listInitial, i);
    } else if (text.substring(i, i + 6) === "#Final") {
      i += 6;
      Final(text, listFinal, i);
    } else if (text.substring(i, i + 9) === "#Automata") {
      i += 9;
      putAutomataInVector(text, listAutomata, i);
    }
  }
}
function Initial(text, listInitial, start) {
  let tempString = "";
  let regEx = /^q0$/;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "#") {
      break;
    }
    if (text[i] === "\n") {
      if (tempString.trim()) {
        if (regEx.test(tempString.trim())) {
          listInitial.push(tempString.trim());
          tempString = "";
        } else {
          alert("Starea Initiala Nu Este q0");
          test1 = false;
        }
      }
    } else {
      tempString += text[i];
    }
  }
  if (tempString.trim()) {
    listInitial.push(tempString.trim());
  }
}
function Final(text, listFinal, start) {
  let tempString = "";
  let regEx = /^q[1-9]*$/;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "#") {
      break;
    }
    if (text[i] === "\n") {
      if (tempString.trim()) {
        if (regEx.test(tempString.trim())) {
          listFinal.push(tempString.trim());
          tempString = "";
        } else {
          alert("Starea Finala Nu Este q1,q2,q3...");
          test2 = false;
          break;
        }
      }
    } else {
      tempString += text[i];
    }
  }
  if (tempString.trim()) {
    listFinal.push(tempString.trim());
  }
}
function check() {
  if (listFinal.length) {
    let stringToCheck = document.getElementById("inputToCheck").value;
    let steps = [];
    for (let char of stringToCheck) {
      if (E.includes(char)) {
        steps.push(char);
      } else {
        alert(
          "Cuvantul contine simboluri care nu sunt din alfabetul automatului"
        );
        document.getElementById("inputToCheck").value = "";
        return;
      }
    }

    main(listAutomata, steps);

    console.log(steps);
  } else {
    alert("Alege Un File Mai Intai");
  }
}
function countStates(listAutomata) {
  for (let i = 0; i < listAutomata.length; i++) {
    if (!Q.includes(listAutomata[i][0])) {
      Q.push(listAutomata[i][0]);
    }
    if (!Q.includes(listAutomata[i][listAutomata[i].length - 1])) {
      Q.push(listAutomata[i][listAutomata[0].length - 1]);
    }
  }
}
function countAlphabet(listAutomata) {
  for (let i = 0; i < listAutomata.length; i++) {
    if (!E.includes(listAutomata[i][1])) {
      E.push(listAutomata[i][1]);
    }
  }
}
function main(listAutomata, stringToCheck) {
  if (!listInitial.length || !listFinal.length || !listAutomata.length) {
    console.error("Lipsesc Starile Initiale Si Finale");
    return;
  }

  let curentState = listInitial[0];
  console.log(curentState);

  for (let char of stringToCheck) {
    let transitionFound = false;

    for (let j = 0; j < listAutomata.length; j++) {
      if (listAutomata[j][0] == curentState && listAutomata[j][1] === char) {
        curentState = listAutomata[j][listAutomata[j].length - 1];
        console.log(`Transitie la '${char}':Acum In ${curentState}`);
        transitionFound = true;
        break;
      }
    }
    if (!transitionFound) {
      console.log(`Nu Exista Transitie '${char}' in ${curentState}.`);
      document.getElementById("answer").style.background = "#d14b4b";
      document.getElementById("answer").textContent = "Invalid";
      return;
    }
  }

  console.log("final state " + curentState);
  if (listFinal.includes(curentState)) {
    console.log("Valid");
    document.getElementById("answer").style.background = "#78d14b";
    document.getElementById("answer").textContent = "Valid";
  } else {
    console.log("Rejected");
    document.getElementById("answer").style.background = "#d14b4b";
    document.getElementById("answer").textContent = "Invalid";
  }
}

function isDeterminist(listAutomata) {
  let isDeterminist = true;
  let cutie = [];
  for (let i = 0; i < listAutomata.length; i++) {
    s = listAutomata[i].slice(0, 2).toString();
    if (!cutie.includes(s)) {
      cutie.push(s);
    } else {
      isDeterminist = false;
      break;
    }
  }
  return isDeterminist;
}
function verifyAutomata(listAutomata) {
  let regEx = /^q[0-9],.,q[0-9]*$/;
  for (let i = 0; i < listAutomata.length; i++) {
    if (!regEx.test(listAutomata[i].toString())) {
      test3 = false;
    }
  }
}
