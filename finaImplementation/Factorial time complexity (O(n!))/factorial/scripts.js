  // WebAssembly Implementation
  async function calculateCombinationsWASM(n) {
    try {
        // Fetch and instantiate the WebAssembly module
        const response = await fetch("combination.wasm");
        if (!response.ok) {
            throw new Error(`Failed to fetch WebAssembly file: ${response.status}`);
        }
        const { instance } = await WebAssembly.instantiateStreaming(response, {
            env: {
                emscripten_resize_heap: () => { },
                memoryBase: 0,
                tableBase: 0,
                memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
                table: new WebAssembly.Table({
                    initial: 0,
                    maximum: 0,
                    element: "anyfunc",
                }),
            },
        });

        // Expose WebAssembly function
        const calculateCombinationsWASM = instance.exports.runCalculation;

        const startTime = performance.now();
        // Call the WebAssembly function
        const result = calculateCombinationsWASM(n); // Adjust the value of n

        const endTime = performance.now();
        const time = endTime - startTime;

        return { combinations: result, time: time };
    } catch (error) {
        console.error("Error fetching WebAssembly file:", error.message);
        return { combinations: undefined, time: undefined };
    }
}

// JavaScript Implementation
function calculateFactorial(n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

function calculateCombinationsJS(n) {
    let count = 0;
    for (let i = 0; i < calculateFactorial(n); i++) {
        for (let j = 0; j < 10000000; j++) {
            count += 1; // Adjust this value
        }
    }
    return count;
}

async function runTest() {
    const n = parseInt(document.getElementById("inputNumber").value);
    const implementation = document.getElementById("implementationSelect").value;

    let combinations, time;
    if (implementation === "wasm") {
        const wasmResult = await calculateCombinationsWASM(n);
        combinations = wasmResult.combinations;
        time = wasmResult.time;
    } else {
        const startTimeJS = performance.now();
        combinations = calculateCombinationsJS(n);
        const endTimeJS = performance.now();
        time = endTimeJS - startTimeJS;
    }

    // Display results
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // Clear previous content
    const resultText = `
        <p>Time taken: ${time === undefined ? "Not available" : time} ms</p>
        <p>Time Complexity: O(n!)</p>
        <p>Number of possible combinations for n=${n}: ${combinations}</p>
    `;
    resultDiv.innerHTML = resultText;
}