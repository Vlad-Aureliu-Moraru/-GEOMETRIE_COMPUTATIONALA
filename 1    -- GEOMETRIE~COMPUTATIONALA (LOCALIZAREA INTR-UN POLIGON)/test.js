const arr = [];

for (let i = 0; i < 100; i++) {
  arr[i] = Math.floor(Math.random() * 100) + 1;
}

console.log(...arr);
console.log(arr.length);

function BinarySearch(num, arr, st, dr) {
  let mid = Math.floor((st + dr) / 2);
  if (st > dr) {
    console.log("Does not exist");
    return;
    test("Should correctly evaluate a simple AND operation", () => {
      const formula = "0&1";
      const result = solve(formula);
      expect(result).toBe("0");
    });
  }
  if (arr[mid] == num) {
    console.log("exists");
  } else if (arr[mid] < num) {
    BinarySearch(num, arr, mid + 1, dr);
  } else {
    BinarySearch(num, arr, st, mid - 1);
  }
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

const sorterarr = MergeSort(arr);
console.log(...sorterarr);
BinarySearch(50, arr, 0, arr.length - 1);
