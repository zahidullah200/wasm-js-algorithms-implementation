   // JavaScript selection sort function
   function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; // Swap elements
        }
    }
    return arr;
}
// WebAssembly setup and function to sort array using WebAssembly
let wasmModule;
let wasmMemory;

async function loadWasmModule() {
    const response = await fetch('selectionsort.wasm');
    const module = await WebAssembly.instantiateStreaming(response, {
        env: {
            emscripten_resize_heap: function (size) {
                return 0;
            },
            memory: new WebAssembly.Memory({ initial: 256 }),
        },
    });
    wasmModule = module.instance.exports;
    wasmMemory = module.instance.exports.memory;
    console.log("WebAssembly module loaded");
}

async function sortArrayWithWasm(arr) {
    const arrLength = arr.length;
    const ptr = wasmModule.malloc(arrLength * 4);
    const wasmArray = new Int32Array(wasmMemory.buffer, ptr, arrLength);
    wasmArray.set(arr);

    const startTime = performance.now();
    wasmModule.selectionSort(ptr, arrLength);
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    const sortedArray = new Int32Array(wasmMemory.buffer, ptr, arrLength);
    const sortedArrayCopy = Array.from(sortedArray);

    wasmModule.free(ptr);

    return {
        sortedArray: sortedArrayCopy,
        executionTime: executionTime
    };
}


async function sortNumbers() {
    const inputArray = document.getElementById("inputArray").value;
    const arr = inputArray.split(",").map(Number);
    const sortingMethod = document.getElementById("sortingMethod").value;

    let result;
    if (sortingMethod === "wasm") {
        await loadWasmModule();
        result = await sortArrayWithWasm(arr);
    } else {
        const startTime = performance.now(); // Record start time
        const sortedArr = selectionSort(arr);
        const endTime = performance.now(); // Record end time
        const executionTime = endTime - startTime; // Calculate execution time
        result = {
            sortedArray: sortedArr,
            executionTime: executionTime
        };
    }

    document.getElementById("result").textContent = "Sorted Array: " + result.sortedArray.join(", ");
    document.getElementById("time_taken").innerHTML =" ";
    document.getElementById("time_taken").innerHTML +=  + result.executionTime + " ms";
}

document.getElementById("sortButton").addEventListener("click", sortNumbers);