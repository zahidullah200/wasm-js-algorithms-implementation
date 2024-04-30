// Function to select one algorithm at a time: WASM or pure JS
function sortArray() {
  // Get the input array and selected method (WASM or JS)
  const inputArray = document
    .getElementById("inputArray")
    .value.split(",")
    .map(Number);
  const method = document.getElementById("method").value;

  // Start measuring time
  const startTime = performance.now();
  let sortedArray;

  // Choose the method (WASM or JS) based on the selected option
  if (method === "js") {
    sortedArray = quickSortJs(inputArray); // Run quick sort in JavaScript
  } else if (method === "wasm") {
    sortedArray = quickSortWasm(inputArray); // Run quick sort in WebAssembly
  }

  // End measuring time
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  // Display the execution time and sorted array
  document.getElementById("timeLabel").textContent = `${elapsedTime.toFixed(
    2
  )} ms`;
  document.getElementById("sortedArray").textContent = sortedArray.join(", ");
}

// Quick sort algorithm implementation in pure JavaScript
function quickSortJs(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[0];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return quickSortJs(left).concat(pivot, quickSortJs(right));
}

// Quick sort algorithm implementation in WebAssembly (WASM)
function quickSortWasm(arr) {
  const length = arr.length;
  const arrPointer = Module._mallocArray(length); // Allocate memory for the array in WebAssembly
  const heap = new Int32Array(Module.results.instance.exports.memory.buffer);
  heap.set(arr, arrPointer / Int32Array.BYTES_PER_ELEMENT); // Copy the array data to WebAssembly memory
  Module._sortArray(arrPointer, length); // Call the sorting function in WebAssembly
  const sortedArray = Array.from(
    heap.subarray(
      arrPointer / Int32Array.BYTES_PER_ELEMENT,
      arrPointer / Int32Array.BYTES_PER_ELEMENT + length
    )
  ); // Get sorted array from WebAssembly memory
  Module._freeArray(arrPointer); // Free allocated memory in WebAssembly
  return sortedArray;
}

// Module object to store WebAssembly functions and results
let Module = {
  onRuntimeInitialized: function (results) {
    console.log("WebAssembly module loaded");
    // Store results globally
    Module.results = results;
  },
};

// Load and instantiate the WebAssembly module
WebAssembly.instantiateStreaming(fetch("quick.wasm"), {
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
    // Extract functions from the WebAssembly instance and store them in `Module`
    Module._mallocArray = results.instance.exports.mallocArray;
    Module._sortArray = results.instance.exports.sortArray;
    Module._freeArray = results.instance.exports.freeArray;

    // Call onRuntimeInitialized with `results`
    Module.onRuntimeInitialized(results);
  })
  .catch((error) => console.error("Error loading WebAssembly module:", error));
