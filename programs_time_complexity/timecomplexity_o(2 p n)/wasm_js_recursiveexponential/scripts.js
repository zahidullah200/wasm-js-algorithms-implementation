// Default to WebAssembly
let isWebAssembly = true;

// Function to run the test
function runTest() {
  // Determine which implementation to use based on the value of isWebAssembly
  if (isWebAssembly) {
    runWebAssemblyTest(); // Call the WebAssembly test function
  } else {
    runJavaScriptTest(); // Call the JavaScript test function
  }
}

// Function to run the WebAssembly test
function runWebAssemblyTest() {
  const startTime = performance.now(); // Start measuring performance
  const n = 10; // Adjust the value of n
  const resultPtr = Module._testRecursiveExponential(n); // Call the WebAssembly function
  const result = new Uint32Array(Module.memory.buffer, resultPtr, 1)[0]; // Extract the result from memory
  Module._freeMemory(resultPtr); // Free the memory used by WebAssembly
  const endTime = performance.now(); // End measuring performance
  const executionTime = endTime - startTime; // Calculate execution time
  displayResult(result, executionTime); // Display the result and execution time
}

// Function to run the JavaScript test
function runJavaScriptTest() {
  const { time, result } = measurePerformance(() => {
    const n =10; // Adjust the value of n
    const exp = recursiveExponential(n); // Call the JavaScript function
    return exp;
  });
  displayResult(result, time); // Display the result and execution time
}

// Function to display the result and execution time
function displayResult(result, executionTime) {
  const resultElement = document.getElementById("recursiveExponentialResult");
  resultElement.innerHTML = `
            <h2>Recursive Exponential (O(2^n))</h2>
            <p>Result: ${result}</p>
            <p>Execution Time: ${executionTime} ms</p>
        `;
}

// WebAssembly module loading code
let Module = {
  onRuntimeInitialized: function () {
    console.log("WebAssembly module loaded");
  },
};

WebAssembly.instantiateStreaming(fetch("recursiveexponential.wasm"), {
  env: {
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
    table: new WebAssembly.Table({
      initial: 0,
      maximum: 0,
      element: "anyfunc",
    }),
    emscripten_resize_heap: function (size) {},
  },
})
  .then((results) => {
    // Expose WebAssembly functions
    Module._testRecursiveExponential = results.instance.exports.testRecursiveExponential;
    Module._freeMemory = results.instance.exports.freeMemory;
    Module.memory = results.instance.exports.memory;

    // Call the onRuntimeInitialized function when the module is loaded
    Module.onRuntimeInitialized();
  })
  .catch((error) => console.error("Error loading WebAssembly module:", error));

// Function to measure performance
function measurePerformance(func) {
  const start = performance.now();
  const result = func();
  const end = performance.now();
  const time = end - start;
  return { time, result };
}

// JavaScript function for the exponential algorithm
function recursiveExponential(n) {
  if (n === 0) {
    return 1;
  }
  meaninglessLoop(); // Call a function that consumes CPU cycles
  return 2 * recursiveExponential(n - 1); // Recursive call
}

// Function that consumes CPU cycles (for testing purposes)
function meaninglessLoop() {
  for (let i = 0; i < 1000000; i++) {
    // This loop doesn't do anything meaningful but consumes CPU cycles
  }
}

// Event listener to switch between WebAssembly and JavaScript implementations
document
  .getElementById("languageSelector")
  .addEventListener("change", function () {
    isWebAssembly = this.value === "wasm";
  });
