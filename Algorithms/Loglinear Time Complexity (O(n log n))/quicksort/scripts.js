
        // Function which select one algorithm at a time WASM or pure JS
        function sortArray() {
            const inputArray = document.getElementById("inputArray").value.split(",").map(Number);
            const method = document.getElementById("method").value;

            const startTime = performance.now();
            let sortedArray;
            if (method === "js") {
                sortedArray = quickSortJs(inputArray);
            } else if (method === "wasm") {
                sortedArray = quickSortWasm(inputArray);
            }
            const endTime = performance.now();
            const elapsedTime = endTime - startTime;

            document.getElementById("timetaken").textContent = `${elapsedTime.toFixed(2)} ms`;
            document.getElementById("sortedArray").textContent = sortedArray.join(", ");
        }



        //Puure quick sort algorithm implementation in pure JS
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

        // quick sort algorithm implementation in the wasm
        function quickSortWasm(arr) {
            const length = arr.length;
            const arrPointer = Module._mallocArray(length);
            const heap = new Int32Array(Module.results.instance.exports.memory.buffer);
            heap.set(arr, arrPointer / Int32Array.BYTES_PER_ELEMENT);
            Module._sortArray(arrPointer, length);
            const sortedArray = Array.from(heap.subarray(arrPointer / Int32Array.BYTES_PER_ELEMENT, arrPointer / Int32Array.BYTES_PER_ELEMENT + length));
            Module._freeArray(arrPointer);
            return sortedArray;
        }


        let Module = {
            onRuntimeInitialized: function (results) {
                console.log("WebAssembly module loaded");
                // Initialize any module-specific logic here
                Module.results = results; // Store `results` globally
            }
        };
        WebAssembly.instantiateStreaming(fetch('quick.wasm'), {
            env: {
                memoryBase: 0,
                tableBase: 0,
                memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
                table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
                emscripten_resize_heap: function (size) { },
            }
        }).then(results => {
            // Extract functions from the WebAssembly instance and store them in `Module`
            Module._mallocArray = results.instance.exports.mallocArray;
            Module._sortArray = results.instance.exports.sortArray;
            Module._freeArray = results.instance.exports.freeArray;

            // Call onRuntimeInitialized with `results`
            Module.onRuntimeInitialized(results);
        }).catch(error => console.error("Error loading WebAssembly module:", error));