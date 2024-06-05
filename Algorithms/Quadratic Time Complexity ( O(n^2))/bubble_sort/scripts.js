function bubbleSortWasm(arr) {
  return new Promise((resolve, reject) => {
    if (!wasmModule) {
      reject("WebAssembly module not loaded");
      return;
    }

    const startSortTime = performance.now();
    const inputArray = new Int32Array(arr);
    const arrayPointer = wasmModule.array_malloc(inputArray.length);
    const wasmMemory = new Int32Array(wasmModule.memory.buffer);
    wasmMemory.set(inputArray, arrayPointer / Int32Array.BYTES_PER_ELEMENT);
    wasmModule.bubbleSort(arrayPointer, inputArray.length);
    const endSortTime = performance.now();
    const wasmSortTime = (endSortTime - startSortTime).toFixed(2);

    const sortedArray = new Int32Array(
      wasmMemory.buffer,
      arrayPointer,
      inputArray.length
    );

    wasmModule.array_free(arrayPointer);

    resolve({ sortedArray: Array.from(sortedArray), sortTime: wasmSortTime });
  });
}

//JS function to sort the elements
function bubbleSort(arr) {
  const n = arr.length;
  let swapped;

  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap them if they are in the wrong order
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    // If no two elements were swapped by inner loop, then break
    if (!swapped) break;
  }

  return arr;
}

function sortNumbers() {
  const inputNumbers = document.getElementById("inputNumbers").value;
  const numbersArray = inputNumbers
    .split(",")
    .map((num) => parseInt(num.trim()));
  const sortingMethod = document.getElementById("sortingMethod").value;

  if (sortingMethod === "wasm") {
    // Sort using Wasm
    bubbleSortWasm(numbersArray.slice())
      .then((wasmResult) => {
        const sortedArray = wasmResult.sortedArray;
        const wasmSortTime = wasmResult.sortTime;
        document.getElementById("sortedNumbers").innerText =
          "Wasm Sorted Array: " + sortedArray.join(", ");
        document.getElementById("time_taken").innerText = wasmSortTime + " ms";
      })
      .catch((error) => console.error("Error sorting with Wasm:", error));
  } else if (sortingMethod === "js") {
    // Sort using JS
    const startSortTime = performance.now();
    const jsSortedArray = bubbleSort(numbersArray.slice());
    const endSortTime = performance.now();
    const jsSortTime = (endSortTime - startSortTime).toFixed(2);

    document.getElementById("sortedNumbers").innerText =
      "JS Sorted Array: " + jsSortedArray.join(", ");
    document.getElementById("time_taken").innerText = jsSortTime + " ms";
  } else {
    console.error("Invalid sorting method selected.");
  }
}

let wasmModule;
WebAssembly.instantiateStreaming(fetch("bubble.wasm"), {
  env: {
    emscripten_resize_heap: function (size) {
      // Implementation if needed
      return 0; // Return success (0) by default
    },
  },
})
  .then((results) => {
    wasmModule = results.instance.exports;
    console.log("WebAssembly module loaded");
  })
  .catch((error) => console.error("Error loading WebAssembly module:", error));