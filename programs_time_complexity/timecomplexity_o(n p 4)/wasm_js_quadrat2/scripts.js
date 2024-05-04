// Function to run either JavaScript or WebAssembly tests based on selection
function runTest() {
  const selection = document.getElementById("selection").value;
  if (selection === "javascript") {
    testTimeComplexity(); // Run JavaScript test
  } else if (selection === "wasm") {
    testTimeComplexityWASM(); // Run WebAssembly test
  }
}

// JavaScript test for time complexity O(n^4)
function testTimeComplexity() {
  const { time, result } = measurePerformance(() => {
    let result = 0;
    const arr = [
      1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5,
      9, 8, 6, 7, 8, 9, 7, 8, 4, 5, 6,
    ]; // Example array
    const n = arr.length;

    // Four nested loops for O(n^4) time operation
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          for (let l = 0; l < n; l++) {
            result += arr[i] * arr[j] * arr[k] * arr[l];
          }
        }
      }
    }
    return result;
  });

  displayResult(time, result);
}

// WebAssembly test for time complexity O(n^4)
function testTimeComplexityWASM() {
  fetch("quadrat2.wasm")
    .then((response) =>
      WebAssembly.instantiateStreaming(response, {
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
            let memory = new Uint8Array(instance.exports.memory.buffer);
            memory.set(memory.subarray(src, src + num), dest);
          },
        },
      })
    )
    .then((obj) => {
      const { instance } = obj;
      const testTimeComplexity = instance.exports.testTimeComplexity;

      // Measure the performance of WebAssembly function
      const start = performance.now();
      const result = testTimeComplexity();
      const end = performance.now();
      const time = end - start;

      displayResult(time, result);
    })
    .catch((err) => console.error("Error loading WebAssembly module:", err));
}

// Utility function to measure performance
function measurePerformance(func) {
  const start = performance.now();
  const result = func();
  const end = performance.now();
  const time = end - start;
  return { time, result };
}

// Function to display the result
function displayResult(time, result) {
  const resultElement = document.getElementById("result");
  resultElement.innerHTML = `
        <h2>Time Complexity O(n^4)</h2>
        <p>Execution Time: ${time} ms</p>
        <p>Result: ${result}</p>
    `;
  resultElement.style.display = "block";
}
