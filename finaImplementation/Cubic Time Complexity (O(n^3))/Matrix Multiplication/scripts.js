let Module = {
  onRuntimeInitialized: function () {
    console.log("WebAssembly module loaded");
  },
};

// Function to run either WebAssembly or JavaScript matrix multiplication
async function runOperation() {
  const methodSelect = document.getElementById("methodSelect");
  const selectedMethod = methodSelect.value;

  if (selectedMethod === "webassembly") {
    await testTimeComplexityWASM(); // Run the WebAssembly function
  } else {
    testMatrixMultiplication(); // Run the JavaScript function
  }
}

// JavaScript matrix multiplication function
function testMatrixMultiplication() {
  const { time, result } = measurePerformance(() => {
    const matrixSize = 100; // Adjust the size of the matrix
    const matrixA = generateRandomMatrix(matrixSize);
    const matrixB = generateRandomMatrix(matrixSize);
    const resultMatrix = matrixMultiply(matrixA, matrixB); // O(n^3) time operation
    return resultMatrix;
  });

  displayResult(time, result, "result", "Matrix Multiplication (JavaScript)");
}

// WebAssembly matrix multiplication function
async function testTimeComplexityWASM() {
  const startTime = performance.now();

  try {
    // Fetch and instantiate the WebAssembly module
    const response = await fetch("matrixmultiplication.wasm");
    const { instance } = await WebAssembly.instantiateStreaming(response, {
      env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
        table: new WebAssembly.Table({
          initial: 0,
          maximum: 0,
          element: "anyfunc",
        }),
        emscripten_resize_heap: () => {},
        emscripten_memcpy_js: (dest, src, num) => {
          let memory = new Uint8Array(Module.memory.buffer);
          memory.set(memory.subarray(src, src + num), dest);
        },
        emscripten_date_now: Date.now, // Add this line
      },
    });

    // Expose WebAssembly functions
    Module.generateAndMultiply = instance.exports.generateAndMultiply;
    Module.freeMemory = instance.exports.freeMemory;
    Module.memory = instance.exports.memory;

    const matrixSize = 100; // Adjust the size of the matrix

    // Call the WebAssembly function
    const resultPointer = Module.generateAndMultiply(matrixSize);
    const resultArray = new Int32Array(
      Module.memory.buffer,
      resultPointer,
      matrixSize * matrixSize
    );
    const result = [];
    for (let i = 0; i < matrixSize; i++) {
      const row = [];
      for (let j = 0; j < matrixSize; j++) {
        row.push(resultArray[i * matrixSize + j]);
      }
      result.push(row);
    }

    const endTime = performance.now();
    const executionTime = (endTime - startTime).toFixed(2);
    const timeInfo = `<div class="time-info"><strong>${executionTime} ms</strong></div>`;

    const complexity = "O(n^3)"; // Time complexity of matrix multiplication
    const complexityInfo = `<div class="complexity-info">Time Complexity: <strong>${complexity}</strong></div>`;

    const resultElement = document.getElementById("result");
    const resultString = `
                <div class="result-header">
                    <h2>Matrix Multiplication (WebAssembly)</h2>
                </div>
                ${timeInfo}
                ${complexityInfo}
                <p>Result Matrix:</p>
                <pre class="result-matrix">${JSON.stringify(
                  result,
                  null,
                  2
                )}</pre>
            `;
    resultElement.innerHTML = resultString;

    Module.freeMemory(resultPointer); // Free memory in C
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
  }
}

// Utility function to measure performance
function measurePerformance(func) {
  const start = performance.now();
  const result = func();
  const end = performance.now();
  const time = end - start;
  return { time, result };
}

// Utility function to generate a random matrix
function generateRandomMatrix(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 10))
  );
}

// Utility function to perform matrix multiplication
function matrixMultiply(matrixA, matrixB) {
  const resultMatrix = [];
  const n = matrixA.length;
  const m = matrixB[0].length;
  const p = matrixB.length;

  for (let i = 0; i < n; i++) {
    resultMatrix[i] = [];
    for (let j = 0; j < m; j++) {
      resultMatrix[i][j] = 0;
      for (let k = 0; k < p; k++) {
        resultMatrix[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }

  return resultMatrix;
}

// Utility function to display the result
function displayResult(time, result, elementId, title) {
  const resultElement = document.getElementById(elementId);
  resultElement.innerHTML = `
        <div class="result-header">
            <h2>${title}</h2>
        </div>
        <div class="time-info">Execution Time: <strong>${time} ms</strong></div>
        <p>Result Matrix:</p>
        <pre class="result-matrix">${JSON.stringify(result, null, 2)}</pre>
    `;
}
