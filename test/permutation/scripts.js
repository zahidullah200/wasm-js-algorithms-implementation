let Module = {
  onRuntimeInitialized: function () {
    console.log("WebAssembly module loaded");
  },
};

// Function to determine whether to run JavaScript or WebAssembly tests
async function runCalculation() {
  const calculationType = document.getElementById("calculationType").value;
  if (calculationType === "js") {
    testPermutation(); // Run JavaScript test
  } else {
    await testPermutationWASM(); // Run WebAssembly test
  }
}

// JavaScript test for permutation calculation
function testPermutation() {
  const n = 12; // Adjust the value of n (up to 8 for reasonable runtime)
  const { time, result } = measurePerformance(() => {
    const permutations = calculatePermutations(n); // O(n!) time operation
    return permutations;
  });

  displayResult(time, result);
}

// Utility function to measure performance
function measurePerformance(func) {
  const start = performance.now();
  const result = func();
  const end = performance.now();
  const time = end - start;
  return { time, result };
}

// JavaScript function to calculate permutations
function calculatePermutations(n) {
  let permutations = 1;
  for (let i = 1; i <= n; i++) {
    permutations *= i;
  }
  // Introduce computation-intensive operation
  for (let j = 0; j < 100000000; j++) {
    permutations *= 1; // Adjust this value
  }
  return permutations;
}

// WebAssembly test for permutation calculation
async function testPermutationWASM() {
  try {
    // Fetch and instantiate the WebAssembly module
    const response = await fetch("permu.wasm");
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

    // Expose WebAssembly functions
    Module.testPermutation = instance.exports.calculatePermutations;
    const startTime = performance.now();
    // Call the WebAssembly function
    const result = Module.testPermutation(12); // Adjust the value of n

    const endTime = performance.now();
    const time = endTime - startTime;

    displayResult(time, result);
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
  }
}

// Function to display the result
function displayResult(time, result) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
        <p>Execution Time: ${time.toFixed(2)} ms</p>
        <p>Permutations: ${result}</p>
        <p>Time Complexity: O(n!)</p>
    `;
}
