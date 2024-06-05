// Function to run the test
function runTest() {
  const method = document.getElementById("method").value;
  if (method === "js") {
    testRotatedSortedArrayBinarySearchJS(); // Call the JavaScript test function
  } else {
    testRotatedSortedArrayBinarySearchWASM(); // Call the WebAssembly test function
  }
}

// JavaScript implementation
function testRotatedSortedArrayBinarySearchJS() {
  const { time, result } = measurePerformance(() => {
    const size = 1000000;
    const rotatedSortedArray = generateRotatedSortedArray(size);
    const searchValue = 500000; // Choose a fixed search value
    const index = rotatedSortedArrayBinarySearch(
      rotatedSortedArray,
      searchValue
    ); // Perform rotated sorted array binary search (O(log n))
    return index;
  });

  displayResult(
    time,
    result,
    "rotatedSortedArrayBinarySearchResult",
    "Rotated Sorted Array Binary Search Time (O(log n))"
  );
}

// Function to measure performance
function measurePerformance(func) {
  const start = performance.now();
  const result = func();
  const end = performance.now();
  const time = end - start;
  return { time, result };
}

// Function to display the result and execution time
function displayResult(time, result, elementId, title) {
  const resultElement = document.getElementById(elementId);
  resultElement.innerHTML = `
        <h2>${title}</h2>
        <p id="timetaken"> ${time} ms</p>
        <p>Result: ${result}</p>
    `;
  resultElement.style.display = "block";
}

// Function to generate a rotated sorted array
function generateRotatedSortedArray(size) {
  const pivot = Math.floor(size / 2); // Set pivot as the middle of the array
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(((i + pivot) % size) + 1); // Generate fixed numbers
  }
  return arr;
}

// JavaScript rotated sorted array binary search algorithm
function rotatedSortedArrayBinarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    if (arr[left] <= arr[mid]) {
      if (arr[left] <= target && target < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (arr[mid] < target && target <= arr[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1; // If not found
}

// WebAssembly implementation
let Module = {
  onRuntimeInitialized: function (results) {
    console.log("WebAssembly module loaded");
    // Initialize any module-specific logic here
    Module.results = results; // Store `results` globally
  },
};

// WebAssembly rotated sorted array binary search test function
function testRotatedSortedArrayBinarySearchWASM() {
  const { time, result } = measurePerformance(() => {
    const searchValue = 500000; // Choose a fixed search value
    const size = 1000000;
    const index = Module._binarySearch(searchValue, size); // Perform rotated sorted array binary search (O(log n))
    return index;
  });

  displayResult(
    time,
    result,
    "rotatedSortedArrayBinarySearchResult",
    "Rotated Sorted Array Binary Search Time (O(log n))"
  );
}

// Load WebAssembly module
WebAssembly.instantiateStreaming(fetch("rotatedsortedbinary.wasm"), {
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
    Module._binarySearch = results.instance.exports.binarySearch;

    // Call onRuntimeInitialized with `results`
    Module.onRuntimeInitialized(results);
  })
  .catch((error) => console.error("Error loading WebAssembly module:", error));
