let Module = {
  onRuntimeInitialized: function () {
    console.log("WebAssembly module loaded");
  },
};

// Function to run the test
function runTest() {
  const method = document.getElementById("method").value;
  if (method === "wasm") {
    testTimeComplexityWASM(); // Call the WebAssembly test function
  } else {
    testLinearithmicTime(); // Call the JavaScript test function
  }
}

// JavaScript test function for linearithmic time complexity (O(n log n))
function testLinearithmicTime() {
  const { time, result } = measurePerformance(() => {
    // Function to merge two sorted arrays
    function merge(left, right) {
      const result = [];
      let leftIndex = 0;
      let rightIndex = 0;
      while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
          result.push(left[leftIndex++]);
        } else {
          result.push(right[rightIndex++]);
        }
      }
      // Add remaining elements
      while (leftIndex < left.length) {
        result.push(left[leftIndex++]);
      }
      while (rightIndex < right.length) {
        result.push(right[rightIndex++]);
      }
      return result;
    }

    // Function for recursive merge sort
    function mergeSort(arr) {
      if (arr.length <= 1) {
        return arr;
      }
      const mid = Math.floor(arr.length / 2);
      const left = mergeSort(arr.slice(0, mid));
      const right = mergeSort(arr.slice(mid));
      return merge(left, right);
    }

    // Generate random array and perform merge sort (O(n log n))
    const arr = Array.from({ length: 10000 }, () =>
      Math.floor(Math.random() * 10000)
    );
    const result = mergeSort(arr);
    return result;
  });
  displayResult(
    time,
    result,
    "linearithmicResult",
    "Linearithmic Time (O(n log n))"
  ); // Display the result
}

// WebAssembly test function for linearithmic time complexity (O(n log n))
function testTimeComplexityWASM() {
  const startTime = performance.now(); // Start time

  WebAssembly.instantiateStreaming(fetch("lineararthmatic.wasm"), {
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
      emscripten_date_now: Date.now,
    },
  })
    .then((results) => {
      const { instance } = results;

      // Export WebAssembly functions
      Module._generateAndSort = instance.exports.generateAndSort;

      const length = 10000; // Adjust the length of the array
      const arr = new Int32Array(length);
      for (let i = 0; i < length; i++) {
        arr[i] = Math.floor(Math.random() * length);
      }

      // Allocate memory in WebAssembly linear memory
      const arrPointer = instance.exports.__heap_base;
      const mem = new Int32Array(
        instance.exports.memory.buffer,
        arrPointer,
        length
      );
      mem.set(arr);

      Module._generateAndSort(arrPointer, length); // Call the WebAssembly function

      // Copy sorted array back to JavaScript
      const result = Array.from(mem);

      const endTime = performance.now(); // End time
      const elapsedTime = endTime - startTime; // Execution time

      displayResult(
        elapsedTime,
        result,
        "linearithmicResult",
        "Linearithmic Time (O(n log n))"
      ); // Display the result
    })
    .catch((err) => console.error("Error loading WebAssembly module:", err));
}

// Function to measure performance
function measurePerformance(callback) {
  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;
  return { time: elapsedTime, result: result };
}

// Function to display the result and execution time
function displayResult(time, result, resultId, title) {
  const resultDiv = document.getElementById(resultId);
  resultDiv.innerHTML = `
        <h2>${title}</h2>
        <p>Time Complexity: O(n log n)</p>
        <p>Performance Time: ${time} ms</p>
        <div class="scrollable">
            <pre>${JSON.stringify(result, null, 2)}</pre>
        </div>
    `;
}
