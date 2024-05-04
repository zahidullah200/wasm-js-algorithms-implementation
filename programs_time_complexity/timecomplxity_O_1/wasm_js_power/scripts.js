// Function to run the test based on the selected test type
function runTest() {
  const testType = document.getElementById("testType").value;
  if (testType === "javascript") {
    testConstantTimeJS(); // Run JavaScript test
  } else if (testType === "webassembly") {
    testConstantTimeWASM(); // Run WebAssembly test
  }
}

// WebAssembly test for constant time operation
async function testConstantTimeWASM() {

  try {
    const response = await fetch("powerofnum.wasm"); // Fetch the WebAssembly binary
    const obj = await WebAssembly.instantiateStreaming(response, {
      env: {
        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }), // Create memory for the module
        emscripten_resize_heap: () => {}, // Define an empty function for emscripten_resize_heap
      },
    });
    const wasmModule = obj.instance;

    const base = 30;
    const exponent = 100;
    const startTime = performance.now();
    const result = wasmModule.exports.calculatePower(base, exponent); // Call the WebAssembly function

    const endTime = performance.now();
    const elapsedTime = endTime - startTime;

    displayResult(elapsedTime.toFixed(2), result, "Power (O(1))"); // Display the result
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
  }
}

// JavaScript test for constant time operation
function testConstantTimeJS() {
  const { time, result } = measurePerformance(() => {
    const startTime = performance.now();
    let exponent = 100;
    const result = Math.pow(30, exponent); // Constant time operation
    for (let i = 0; i <= 1000000; i++) {
      exponent = i + 2;
    }
    return result; // Return the result
  });

  displayResult(time, result, "Constant Time (O(1))"); // Display the result
}

// Utility function to measure performance
function measurePerformance(callback) {
  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;
  return { time: elapsedTime.toFixed(2), result };
}

// Function to display the result
function displayResult(time, result, complexity) {
  document.getElementById("titleLabel").textContent = `Title: ${complexity}`;
  document.getElementById("resultLabel").textContent = `Result: ${result}`;
  document.getElementById(
    "timeLabel"
  ).textContent = `Performance Time: ${time} ms`;
  document.getElementById(
    "complexityLabel"
  ).textContent = `Time Complexity: ${complexity}`;
}
