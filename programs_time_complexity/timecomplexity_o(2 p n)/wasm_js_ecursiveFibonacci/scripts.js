// WebAssembly (WASM) module loading code
let Module = {
    onRuntimeInitialized: function () {
      console.log("WebAssembly module loaded");
    },
  };
  
  const selectElement = document.getElementById("implementationSelect");
  
  WebAssembly.instantiateStreaming(fetch("recursiveFibonacci.wasm"), {
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
      Module._testRecursiveFibonacci =
        results.instance.exports.testRecursiveFibonacci;
      Module._freeMemory = results.instance.exports.freeMemory;
      Module.memory = results.instance.exports.memory;
  
      // Call the function when the module is loaded
      Module.onRuntimeInitialized();
    })
    .catch((error) => console.error("Error loading WebAssembly module:", error));
  
  // JavaScript function to run the test
  function runTest() {
    const implementation = selectElement.value;
    if (implementation === "js") {
      // JavaScript implementation
      testRecursiveFibonacciJS();
    } else if (implementation === "wasm") {
      // WebAssembly implementation
      testRecursiveFibonacciWASM();
    }
  }
  
  // JavaScript function for the Fibonacci algorithm
  function testRecursiveFibonacciJS() {
    const { time, result } = measurePerformance(() => {
      const n = 30; // Adjust the value of n (up to 20 for reasonable runtime)
      const fib = recursiveFibonacciJS(n); // O(2^n) time operation
      return fib;
    });
  
    // Display JavaScript results
    displayResult(
      time,
      result,
      "recursiveFibonacciResult",
      "Recursive Fibonacci (O(2^n)) - JavaScript"
    );
  }
  
  // JavaScript function for the Fibonacci algorithm
  function recursiveFibonacciJS(n) {
    if (n <= 1) {
      return n;
    }
    return recursiveFibonacciJS(n - 1) + recursiveFibonacciJS(n - 2);
  }
  
  // WebAssembly function to run the test
  function testRecursiveFibonacciWASM() {
    const startTime = performance.now();
    const n = 30; // Adjust the value of n
    const resultPtr = Module._testRecursiveFibonacci(n); // Call the WebAssembly function
    const result = new Uint32Array(Module.memory.buffer, resultPtr, 1)[0];
    Module._freeMemory(resultPtr); // Free the memory used by WebAssembly
    const endTime = performance.now();
    const executionTime = endTime - startTime;
  
    // Display WebAssembly results
    displayResult(
      executionTime,
      result,
      "recursiveFibonacciResult",
      "Recursive Fibonacci (O(2^n)) - WebAssembly"
    );
  }
  
  // Common function to measure performance
  function measurePerformance(func) {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    const time = end - start;
    return { time, result };
  }
  
  // Common function to display results
  function displayResult(time, result, elementId, title) {
    const resultElement = document.getElementById(elementId);
    resultElement.innerHTML = `
              <h2>${title}</h2>
              <p>Execution Time: ${time} ms</p>
              <p>Fibonacci Number: ${result}</p>
          `;
  }
  