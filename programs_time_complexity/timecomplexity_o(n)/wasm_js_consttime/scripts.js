// Function to determine which test to run based on the selected mode
function run() {
  const mode = document.getElementById('mode').value;
  if (mode === 'js') {
      testJS(); // Run JavaScript test
  } else {
      testWASM(); // Run WebAssembly test
  }
}

// JavaScript test function
function testJS() {
  const { time, result } = measurePerformance(calculateSumJS);
  displayResult(time, result, "JS", "Linear Time (O(n))");
}

// JavaScript function to calculate sum of numbers from 1 to 100000
function calculateSumJS() {
  const array = [];
  const size = 10000;
  for (let i = 0; i < size; i++) {
      array.push(i + 1);
  }
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
      sum += array[i];
  }
  return sum;
}

// WebAssembly test function
function testWASM() {
  const imports = {
      env: {
          memoryBase: 0,
          tableBase: 0,
          memory: new WebAssembly.Memory({ initial: 256 }),
          table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
          emscripten_resize_heap: size => {},
          emscripten_date_now: () => Date.now()
      }
  };

  WebAssembly.instantiateStreaming(fetch('constanttime.wasm'), imports)
      .then(obj => {
          const { time, result } = measurePerformance(() => {
              const wasmResult = obj.instance.exports.calculate_sum();
              return wasmResult;
          }); // Call WebAssembly function and measure its performance
          console.log("Result from WASM:", result);
          if (result !== undefined) {
              displayResult(time, result.toString(), "WASM", "Linear Time (O(n))"); // Display result
          } else {
              console.error("Error: Result is undefined.");
          }
      })
      .catch(err => console.error('Error loading WebAssembly module:', err));
}

// Function to measure performance of a callback function
function measurePerformance(callback) {
  const startTime = performance.now();
  const result = callback(); // Call the provided function
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;
  return { time: elapsedTime.toFixed(2), result };
}

// Function to display the test result
function displayResult(time, result, method, complexity) {
  document.getElementById('output').innerHTML = `
      <p>Method: ${method}</p>
      <p>Result: ${result}</p>
      <p>Time Complexity: ${complexity}</p>
      <p>Performance Time: ${time} ms</p>
  `;
}
