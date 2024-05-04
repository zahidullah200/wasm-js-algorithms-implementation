// Function to determine whether to run JavaScript or WebAssembly tests
function runTest() {
  const implementation = document.getElementById("implementation").value;
  if (implementation === "js") {
    testQuadraticTime(); // Run JavaScript test
  } else if (implementation === "wasm") {
    testQuadraticTimeWASM(); // Run WebAssembly test
  }
}

// JavaScript test for quadratic time complexity
function testQuadraticTime() {
  const { time, result } = measurePerformance(() => {
    let result = 0;
    for (let i = 0; i < 70; i++) {
      for (let j = 0; j < 70; j++) {
        for (let k = 0; k < 30; k++) {
          for (let l = 0; l < 30; l++) {
            result += i + j + k + l; // Quadratic time operation
          }
        }
      }
    }
    return result;
  });
  displayResult(time, result, "Quadratic Time (O(n^4))", "JavaScript");
}

// WebAssembly test for quadratic time complexity
function testQuadraticTimeWASM() {
  fetch("quadratictimee.wasm")
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
      const testQuadraticTime = instance.exports.testQuadraticTime;

      // Measure the performance of WebAssembly function
      const start = performance.now();
      const result = testQuadraticTime();
      const end = performance.now();
      const time = end - start;

      displayResult(time, result, "Quadratic Time (O(n^4))", "WebAssembly");
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
function displayResult(time, result, title, implementation) {
  const resultElement = document.getElementById("result");
  resultElement.innerHTML = `
        <div class="result">
            <h2>${title} (${implementation})</h2>
            <p>Execution Time: ${time} ms</p>
            <p>Result: ${result}</p>
        </div>
    `;
}
