// Function to run the test
function runTest() {
    const method = document.getElementById('method').value;
    if (method === 'js') {
        testBinarySearchJS(); // Call the JavaScript test function
    } else {
        testBinarySearchWASM(); // Call the WebAssembly test function
    }
}

// JavaScript implementation
function testBinarySearchJS() {
    const { time, result } = measurePerformance(() => {
        const arr = Array.from({ length: 1000000 }, (_, i) => i + 1); // Generate an array of fixed numbers
        const searchValue = 500000; // Choose a value in the middle of the array
        const index = binarySearch(arr, searchValue); // Perform binary search (O(log n))
        return index;
    });
    displayResult(time, result, "binarySearchResult", "Binary Search Time (O(log n))");
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
    if (resultElement) {
        resultElement.innerHTML = `<h2>${title}</h2><p id="timetaken">${time} ms</p><p>Result: ${result}</p>`;
        resultElement.style.display = "block";
    } else {
        console.error("Result element not found");
    }
}

// JavaScript binary search algorithm
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // If not found
}




let Module = {
    onRuntimeInitialized: function (results) {
        console.log("WebAssembly module loaded");
        Module.results = results; // Store `results` globally
    }
};

// Load WebAssembly module
WebAssembly.instantiateStreaming(fetch('binarysearch.wasm'), {
    env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
        table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
        emscripten_resize_heap: function (size) { },
    }
}).then(results => {
    // Extract functions from the WebAssembly instance and store them in `Module`
    Module._binarySearch = results.instance.exports.binarySearch;
    Module._allocateArray = results.instance.exports.allocateArray;
    Module._freeArray = results.instance.exports.freeArray;
    Module._initializeArray = results.instance.exports.initializeArray;

    // Call onRuntimeInitialized with `results`
    Module.onRuntimeInitialized(results);
}).catch(error => console.error("Error loading WebAssembly module:", error));

// WebAssembly binary search test function
function testBinarySearchWASM() {
    const startTime = performance.now(); // Start time

    const length = 1000000;
    const arrPointer = Module._allocateArray(length); // Allocate memory for array

    // Initialize the array in C code
    Module._initializeArray(arrPointer, length);

    const searchValue = 500000; // Fixed search value
    const index = Module._binarySearch(arrPointer, length, searchValue); // Perform binary search

    Module._freeArray(arrPointer); // Free allocated memory

    const endTime = performance.now(); // End time
    const elapsedTime = endTime - startTime; // Execution time

    displayResult(elapsedTime, index, "binarySearchResult", "Binary Search Time (O(log n))"); // Display the result
}



