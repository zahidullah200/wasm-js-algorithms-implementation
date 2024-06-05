let Module = {
  onRuntimeInitialized: function () {
    console.log("WebAssembly module loaded");
  },
};

// Function to run test based on selection (JS or WASM)
async function runTest() {
  const selection = document.getElementById("selection").value;
  if (selection === "javascript") {
    testCubicPolynomial(); // Run the JS test
  } else if (selection === "wasm") {
    await testCubicPolynomialWASM(); // Run the WASM test
  }
}

// Test the cubic polynomial function using WebAssembly (WASM)
async function testCubicPolynomialWASM() {
  try {
    // Fetch and instantiate the WebAssembly module
    const response = await fetch("cubicpolynomial.wasm");
    const { instance } = await WebAssembly.instantiateStreaming(response, {
      env: {
        emscripten_memcpy_js: function (dest, src, num) {
          // Copy memory from WASM to JS
          let memory = new Uint8Array(Module.memory.buffer);
          memory.set(memory.subarray(src, src + num), dest);
          return dest;
        },
        exit: function (code) {
          console.error("WebAssembly exited with code " + code);
        },
        // Provide emscripten_resize_heap function
        emscripten_resize_heap: function (size) {
          // Not implementing resizing for simplicity
          console.warn("Resizing the heap to size:", size);
          return 0; // Returning 0 indicates success
        },
      },
    });

    // Export the function to call in WASM
    Module._testCubicPolynomial = instance.exports.testCubicPolynomial;

    const { time, result } = measurePerformance(() => {
      const result = Module._testCubicPolynomial(); // Execute the WASM function
      return result;
    });

    displayResult(time, result, "Cubic Polynomial (O(n^3))"); // Display the result
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
  }
}

// Test the cubic polynomial function using JavaScript (JS)
function testCubicPolynomial() {
  const { time, result } = measurePerformance(() => {
    const coefficients = [2, 3, 5, 6, 7, 8]; // Coefficients of the cubic polynomial
    const x = 5; // Value of x
    const result = evaluateCubicPolynomial(coefficients, x); // O(n^3) time operation
    return result;
  });

  displayResult(time, result, "Cubic Polynomial (O(n^3))"); // Display the result
}

// Measure the performance of a function
function measurePerformance(func) {
  const start = performance.now(); // Start time
  const result = func(); // Execute the function
  const end = performance.now(); // End time
  const time = end - start; // Calculate the execution time
  return { time, result };
}

// Evaluate the cubic polynomial using JS
function evaluateCubicPolynomial(coefficients, x) {
  let result = 0;
  const n = coefficients.length;

  // Triple nested loop to evaluate the cubic polynomial (JS implementation)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        result +=coefficients[i] * coefficients[j] * coefficients[k] * Math.pow(x, 6);
      }
    }
  }

        // Random loop for added execution time
        for ( i = 0; i < 10000000; i++)
        {
          let res=0;
             res+= i; // Just to use some CPU cycles
        }
    

  return result;
}

// Display the result
function displayResult(time, result, complexity) {
  const resultElement = document.getElementById("result");
  resultElement.innerHTML = `
        <h2>Result</h2>
        <p id="timetaken">${time} ms</p>
        <p>Time Complexity: ${complexity}</p>
        <p>Result: ${result}</p>
    `;
  resultElement.style.display = "block";
}
