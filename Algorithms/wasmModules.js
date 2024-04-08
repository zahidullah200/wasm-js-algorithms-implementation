// wasmload.js

let wasmModules = {}; // Object to store all WebAssembly modules

// Load WebAssembly module and store it in the wasmModules object
function loadWasmModule(moduleName, instanceName, importObject) {
    return WebAssembly.instantiateStreaming(fetch(moduleName), importObject)
        .then((results) => {
            wasmModules[instanceName] = results.instance.exports;
            console.log(`${moduleName} WebAssembly module loaded`);
        })
        .catch(error => console.error(`Error loading ${moduleName} WebAssembly module:`, error));
}

// Load bubble sort WebAssembly module
loadWasmModule("bubble.wasm", "bubbleSort", {
    env: {
        emscripten_resize_heap: function (size) {
            // Implementation if needed
            return 0; // Return success (0) by default
        },
    },
});

// Load convolutionImg WebAssembly module
loadWasmModule("convolution.wasm", "convolutionImg", {
    env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
        table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
        __memory_base: 0,
        __table_base: 0,
        stackSave: function() {},
        stackRestore: function() {},
        stackAlloc: function(size) { return 0; }
    }
});

// Load fibonacci WebAssembly module
loadWasmModule("fibo.wasm", "fibonacci", {
    env: {
        emscripten_resize_heap: function (size) {
            return 0; // Return success (0) by default
        }
    }
});

// Now wasmModules object contains all the WebAssembly modules, accessible by their respective instance names
