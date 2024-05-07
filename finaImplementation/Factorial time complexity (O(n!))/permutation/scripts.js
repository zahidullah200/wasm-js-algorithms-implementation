// JavaScript Implementation
function swap(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function reverse(array, start, end) {
  while (start < end) {
    swap(array, start, end);
    start++;
    end--;
  }
}

function nextPermutation(array) {
  const n = array.length;
  let i = n - 1;
  while (i > 0 && array[i - 1] >= array[i]) i--;
  if (i <= 0) return false;

  let j = n - 1;
  while (array[j] <= array[i - 1]) j--;
  swap(array, i - 1, j);

  reverse(array, i, n - 1);
  return true;
}

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function calculatePermutations(n) {
  if (n > 10) return -1;

  let count = 0;
  const array = Array.from({ length: n }, (_, i) => i);
  do {
    // Introduce computation-intensive operation
    for (let j = 0; j < 10000000; j++) {
      count += 1; // Adjust this value
    }
  } while (nextPermutation(array));
  return count;
}

// WebAssembly Implementation
async function testPermutationWASM() {
  try {
    // Fetch and instantiate the WebAssembly module
    const response = await fetch("2.wasm");
    const { instance } = await WebAssembly.instantiateStreaming(response, {
      env: {
        emscripten_resize_heap: () => {},
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
        table: new WebAssembly.Table({
          initial: 0,
          maximum: 0,
          element: "anyfunc",
        }),
      },
    });

    // Expose WebAssembly function
    const calculatePermutationsWASM = instance.exports.calculatePermutations;

    const startTime = performance.now();
    // Call the WebAssembly function
    const result = calculatePermutationsWASM(2); // Adjust the value of n

    const endTime = performance.now();
    const time = endTime - startTime;

    document.getElementById("result").textContent = `Result: ${result}`;
    document.getElementById("timeTaken").textContent = `${time} ms`;
  } catch (error) {
    console.error("Error:", error);
  }
}

function runTest() {
  const implementationSelect = document.getElementById("implementationSelect");
  const selectedValue =
    implementationSelect.options[implementationSelect.selectedIndex].value;
  if (selectedValue === "wasm") {
    testPermutationWASM();
  } else if (selectedValue === "js") {
    testPermutation();
  }
}

function testPermutation() {
  const n = 2; // Adjust the value of n as needed
  const startTime = performance.now();
  const result = calculatePermutations(n);
  const endTime = performance.now();
  const time = endTime - startTime;
  document.getElementById("result").textContent = `Result: ${result}`;
  document.getElementById("timeTaken").textContent = `${time} ms`;
}
