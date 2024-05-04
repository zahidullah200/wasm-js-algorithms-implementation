// Function to determine which program to run based on the selected mode
function run() {
  const mode = document.getElementById("mode").value;
  if (mode === "wasm") {
    runWasm(); // Run WebAssembly program
  } else {
    runProgram1(); // Run JavaScript program
  }
}

// JavaScript program to generate numbers and measure performance
function runProgram1() {
  const startTime = performance.now();
  let result;
  const numbers = [];
  for (let i = 0; i < 10000; i++) {
    result = i + 1;
    numbers.push(result);
    console.log(result + " Best of luck");
  }
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;
  const resultDiv = document.getElementById("output");
  resultDiv.innerHTML = `
        <p>Result: Last number generated: ${result}</p>
        <p>Time Complexity: O(1)</p>
        <p>Performance Time: ${elapsedTime.toFixed(2)} ms</p>
        <p>Generated Numbers: ${numbers.join(", ")}</p>
    `;
}

// WebAssembly program to generate numbers and measure performance
function runWasm() {
  WebAssembly.instantiateStreaming(fetch("constanttimeloopwasm.wasm"), {
    env: {
      emscripten_resize_heap: () => {}, // Define the required function
    },
  }) // Provide the necessary functions in the env object
    .then((obj) => {
      const { instance } = obj;
      const numbersPtr = instance.exports.generateNumbers(); // Call WebAssembly function
      const numbersArray = new Int32Array(
        instance.exports.memory.buffer,
        numbersPtr,
        10000
      );
      const numbersDiv = document.getElementById("output");
      numbersDiv.innerHTML = `${numbersArray.join(", ")}`;

      const startTime = performance.now();
      // Free the memory allocated for the array
      instance.exports.freeNumbers(numbersPtr);

      const endTime = performance.now();
      const elapsedTime = endTime - startTime;

      const resultDiv = document.getElementById("output");
      resultDiv.innerHTML = `
                <p>Result: Last number generated: ${
                  numbersArray[numbersArray.length - 1]
                }</p>
                <p>Time Complexity: O(1)</p>
                <p>Performance Time: ${elapsedTime.toFixed(2)} ms</p>
                <p>Generated Numbers: ${numbersArray.join(", ")}</p>
            `;
    })
    .catch((err) => console.error("Error loading WebAssembly module:", err));
}
