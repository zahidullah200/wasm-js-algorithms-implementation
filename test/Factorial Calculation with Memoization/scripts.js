// Event listener for the button click
document.getElementById("calculateBtn").addEventListener("click", function () {
  const method = document.getElementById("method").value;
  if (method === "js") {
    testRecursiveFactorial(); // If JavaScript method is selected, run the JavaScript test
  } else if (method === "wasm") {
    testFactorialWASM(); // If WebAssembly method is selected, run the WebAssembly test
  }
});

// JavaScript test for recursive factorial calculation
function testRecursiveFactorial() {
  const n = 170; // Adjust the value of n (up to 170 for reasonable runtime)
  const { time, result } = measurePerformance(() => {
    const startTime = performance.now();
    const { factorial } = recursiveFactorial(n); // O(n!) time operation
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    return { factorial, executionTime };
  });

  displayResult(time, result.factorial, "O(n!)", "Factorial Result");
}

// Utility function to measure performance
function measurePerformance(func) {
  const start = performance.now();
  const result = func();
  const end = performance.now();
  const time = end - start;
  return { time, result };
}
// Recursive factorial function
function recursiveFactorial(n) {
  if (n < 0) {
    return { factorial: -1 }; // Error handling for negative input
  }
  if (n === 0) {
    return { factorial: 1 };
  }

  // Add a loop that doesn't affect time complexity
  for (let i = 0; i < 10000; i++) {
    // Do nothing, just take some execution time
    const x = i * i;
  }

  // Recursive call
  return calculateFactorial(n);
}

// Helper function to calculate factorial
function calculateFactorial(n) {
  let factorial = 1;
  for (let i = 2; i <= n; i++) {
    factorial *= i;
  }
  return { factorial };
}

// WebAssembly test for factorial calculation
async function testFactorialWASM() {
  try {
    // Fetch and instantiate the WebAssembly module
    const response = await fetch("recursionfactorial.wasm");
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
      },
    });

    const startTime = performance.now();
    // Expose WebAssembly function
    const testFactorial = instance.exports.testFactorial;

    // Call the WebAssembly function
    const n = 170; // Set the value of n
    const factorial = testFactorial(n); // Result directly returned as a number

    const endTime = performance.now();
    const time = endTime - startTime;
    const timeComplexity = "O(n!)"; // Time complexity of the factorial function

    displayResult(time, factorial, timeComplexity);
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
  }
}

// Function to display the result
function displayResult(time, result, timeComplexity, title) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
        <h2>${title || "Factorial Result"}</h2>
        <p>Execution Time: ${time} ms</p>
        <p>Factorial: ${result}</p>
        <p>Time Complexity: ${timeComplexity}</p>
    `;
}
