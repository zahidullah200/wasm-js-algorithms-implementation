document.addEventListener("DOMContentLoaded", () => {
  const runTestButton = document.getElementById("runTestButton");
  runTestButton.addEventListener("click", runTest);
});

async function runTest() {
  const methodSelect = document.getElementById("methodSelect");
  const selectedMethod = methodSelect.value;

  if (selectedMethod === "wasm") {
    await summationWithDelay();
  } else if (selectedMethod === "js") {
    const startTime = performance.now();
    const result = calculateSumWithDelayJs(976, 1074); // Get result
    const endTime = performance.now();
    const time = endTime - startTime;
    displayResult("JavaScript", result, time, "O(1)");
  }
}

async function summationWithDelay() {
  try {
    const response = await fetch("summation.wasm");
    if (!response.ok) {
      throw new Error(
        "Failed to fetch WebAssembly module: " + response.statusText
      );
    }

    const bytes = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes, {
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
        emscripten_sleep: (ms) => {
          return new Promise((resolve) => setTimeout(resolve, ms));
        },
      },
    });

    const startTime = performance.now();
    const summation = instance.exports.calculateSum; // Correct function name
    const result = summation(976, 1074); // Pass parameters correctly
    const endTime = performance.now();
    const time = endTime - startTime;

    displayResult("WebAssembly", result, time, "O(1)");
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
  }
}

function calculateSumWithDelayJs(a, b) {
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    // Introduce a non-trivial computation
    result += a + b;
  }
  return result;
}

function displayResult(method, result, time, complexity) {
  const methodElement = document.getElementById("method");
  const resultElement = document.getElementById("resultValue");
  const timeTakenElement = document.getElementById("timeTaken");
  const complexityElement = document.getElementById("timeComplexity");

  methodElement.textContent = method;
  resultElement.textContent = result;
  timeTakenElement.textContent = time + " ms";
  complexityElement.textContent = complexity;
}
