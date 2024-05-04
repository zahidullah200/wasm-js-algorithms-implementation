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

// WebAssembly test for time complexity O(n^4)
function testHashLookupWASM() {
  fetch("hashlookup.wasm")
    .then((response) => WebAssembly.instantiateStreaming(response, {}))
    .then((obj) => {
      const { instance } = obj;
      const testHashLookup = instance.exports.testHashLookup;

      // Measure the performance of WebAssembly function
      const start = performance.now();
      const result = testHashLookup();
      const end = performance.now();
      const time = end - start;

      displayResult(time, result);
    })
    .catch((err) => console.error("Error loading WebAssembly module:", err));
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
