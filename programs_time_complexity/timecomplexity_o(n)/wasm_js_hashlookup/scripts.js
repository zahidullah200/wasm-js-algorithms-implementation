// Function to determine which test to run based on the selected mode
function runTest() {
  const mode = document.getElementById("mode").value;
  if (mode === "js") {
    testHashLookupJS(); // Run JavaScript test
  } else {
    testHashLookupWASM(); // Run WebAssembly test
  }
}

// JavaScript test function for hash table lookup
function testHashLookupJS() {
  const hashTable = new Map();

  // Populate the hash table with 1000 key-value pairs (increased complexity)
  for (let i = 0; i < 1000; i++) {
    hashTable.set(`key_${i}`, `value_${i}`);
  }

  // Record start time
  const startTime = performance.now();

  let sum = 0;
  // Perform a more complex operation (access all values)
  for (let key of hashTable.keys()) {
    sum += parseInt(hashTable.get(key).substring(6));
  }

  // Record end time
  const endTime = performance.now();

  // Calculate time taken
  const time = endTime - startTime;

  // Display result
  displayResult(time, sum);
}

// WebAssembly test function for hash table lookup
async function testHashLookupWASM() {
  try {
    // Fetch and instantiate the WebAssembly module
    const response = await fetch("hashlookup.wasm");
    const { instance } = await WebAssembly.instantiateStreaming(response, {
      env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
        table: new WebAssembly.Table({ initial: 0, maximum: 0, element: "anyfunc" }),
        emscripten_resize_heap: () => {},
        emscripten_memcpy_js: (dest, source, num) => {
          var destView = new Uint8Array(instance.exports.memory.buffer, dest, num);
          var sourceView = new Uint8Array(instance.exports.memory.buffer, source, num);
          destView.set(sourceView);
        },
      },
    });

    const testHashLookup = instance.exports.testHashLookup;

    // Record start time
    const startTime = performance.now();

    // Call the WebAssembly function
    const result = testHashLookup();

    // Record end time
    const endTime = performance.now();

    // Calculate time taken
    const time = endTime - startTime;

    // Display result
    displayResult(time, result);
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
  }
}

// Function to display the test result
function displayResult(time, result) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
        <p>Time taken: ${time.toFixed(2)} milliseconds</p>
        <p>Result: ${result}</p>
        <p>Time Complexity: O(n) (Linear Time)</p>
    `;
}
