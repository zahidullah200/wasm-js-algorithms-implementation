function calculateFibonacci() {
    const method = document.getElementById('method').value;
    const inputNumber = parseInt(document.getElementById('inputNumber').value);
    const outputDiv = document.getElementById('output');
    if (method === 'wasm') {
        wasFibo(inputNumber, outputDiv);
    } else if (method === 'js') {
        FibonicNumberJs(inputNumber, outputDiv);
    }
}

// Function to calculate Fibonacci using WebAssembly
function wasFibo(n, outputDiv) {
    if (!fiboInstance) {
        console.error("WebAssembly module not loaded yet");
        return;
    }

    const startTime = performance.now();
    const fib = fiboInstance.exports.fibonacci(n);
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;

    displayResult(fib, elapsedTime, outputDiv, "WebAssembly");
}


function FibonicNumberJs(n, outputDiv) {
    const startTime = performance.now();
    const fib = sfabonicJS(n);
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;

    displayResult(fib, elapsedTime, outputDiv, "JavaScript");
}

function sfabonicJS(n) {
    if (n <= 1) {
        return n;
    }
    return sfabonicJS(n - 1) + sfabonicJS(n - 2);
}

// Function to display the result
function displayResult(fibonacciResult, elapsedTime, outputDiv, method) {
    outputDiv.innerHTML = `<p>${method} Result:  ${fibonacciResult}</p>`;
    document.getElementById('time_taken').innerText = `${elapsedTime.toFixed(2)} ms`;
}



let fiboInstance; // Global variable to store the WebAssembly instance

// Load the WebAssembly module globally
WebAssembly.instantiateStreaming(fetch("o.wasm"), {
    env: {
        emscripten_resize_heap: function (size) {
            return 0; // Return success (0) by default
        }
    }
})
    .then((results) => {
        fiboInstance = results.instance;
        console.log("WebAssembly module loaded");
    })
    .catch(error => console.error("Error loading WebAssembly module:", error));

