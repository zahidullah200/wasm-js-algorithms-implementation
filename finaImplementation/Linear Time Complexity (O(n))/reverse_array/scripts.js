//function to select only one algorithm at a time
function reverseArray() {
  const inputArray = document
    .getElementById("inputArray")
    .value.split(",")
    .map(Number);
  const method = document.getElementById("method").value;
  const outputDiv = document.getElementById("reversedArray");
  const performanceDiv = document.getElementById("time_taken");

  if (method === "wasm") {
    reverseArr(inputArray, outputDiv, performanceDiv); // Call reverseArr
  } else if (method === "js") {
    const startTime = performance.now();
    const reversedArray = reverseJsArray(inputArray, inputArray.length);
    const endTime = performance.now();
    outputDiv.innerHTML = `<p>Reversed Array (JavaScript): ${reversedArray}</p>`;
    performanceDiv.innerHTML = `<p> ${endTime - startTime} ms</p>`;
  }
}

//Pure JavaScript function
function reverseJsArray(arr) {
  let start = 0;
  let end = arr.length - 1;

  while (start < end) {
    // Swap elements at start and end indices
    const temp = arr[start];
    arr[start] = arr[end];
    arr[end] = temp;

    // Move indices towards the center
    start++;
    end--;
  }

  return arr;
}

function reverseArr(inputArray, outputDiv, performanceDiv) {
  return new Promise((resolve, reject) => {
    if (!Module) {
      reject("WebAssembly module not loaded");
      return;
    }

    const reverseArray = Module.reverseArray;
    const arrayLength = inputArray.length;

    // Create a new Int32Array from the input array
    const intArray = new Int32Array(inputArray);

    // Allocate memory for the array in the Wasm module
    const arrayPointer = Module.array_malloc(
      arrayLength * Int32Array.BYTES_PER_ELEMENT
    );
    if (arrayPointer === 0) {
      reject("Failed to allocate memory");
      return;
    }

    // Access memory buffer from the module's memory object
    const wasmMemory = new Int32Array(Module.memory.buffer);

    // Check if memory needs to be resized
    if (
      Module.memory.buffer.byteLength <
      arrayPointer + arrayLength * Int32Array.BYTES_PER_ELEMENT
    ) {
      const newMemorySize =
        Math.ceil(
          (arrayPointer + arrayLength * Int32Array.BYTES_PER_ELEMENT) / 131072
        ) * 131072; // Adjust memory size in 128KB increments
      try {
        Module.memory.grow(
          (newMemorySize - Module.memory.buffer.byteLength) / 65536
        ); // Grow memory to fit new size
      } catch (error) {
        reject("Failed to grow memory");
        Module.array_free(arrayPointer); // Free the allocated memory before rejecting
        return;
      }
    }

    // Copy inputArray to the allocated memory in the Wasm module
    wasmMemory.set(intArray, arrayPointer / Int32Array.BYTES_PER_ELEMENT);

    const startTime = performance.now();
    reverseArray(arrayPointer, arrayLength);
    const endTime = performance.now();

    // Read reversed array from Wasm memory
    const reversedArray = new Int32Array(
      wasmMemory.buffer,
      arrayPointer,
      arrayLength
    );

    outputDiv.innerHTML = `<p>Reversed Array (WebAssembly): ${reversedArray}</p>`;
    performanceDiv.innerHTML = `<p>${endTime - startTime} ms</p>`;

    // Free the allocated memory in the Wasm module
    Module.array_free(arrayPointer);

    resolve(); // Resolve the promise once the operation is completed
  });
}

//loading wasm module

let Module;

// Load the WebAssembly module
WebAssembly.instantiateStreaming(fetch("2.wasm"), {
  env: {
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({ initial: 256, maximum: 1024 }), // Increase maximum memory size
    table: new WebAssembly.Table({
      initial: 0,
      maximum: 0,
      element: "anyfunc",
    }),
    emscripten_resize_heap: function (size) {
      // Implementation if needed
      return 0; // Return success (0) by default
    },
  },
})
  .then((results) => {
    Module = results.instance.exports;
    console.log("WebAssembly module loaded");
  })
  .catch((error) => console.error("Error loading WebAssembly module:", error));
