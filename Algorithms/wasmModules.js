// wasmModules.js

let Module = {}; // Object to store loaded WebAssembly modules

function loadWasmModule(moduleName, wasmFile, importObject) {
    return fetch(wasmFile)
        .then(response => response.arrayBuffer())
        .then(bytes => WebAssembly.instantiate(bytes, importObject))
        .then(results => {
            Module[moduleName] = results.instance.exports;
            console.log(`${moduleName} WebAssembly module loaded`);
        })
        .catch(error => console.error(error));
}

// Common import object for all WebAssembly modules
const commonImportObject = {
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
};

// Load convolution WebAssembly module
loadWasmModule('convolution', 'convolution.wasm', commonImportObject);

// Load Bubble Sort WebAssembly module
loadWasmModule('bubbleSort', 'bubbleSort.wasm', commonImportObject);

// Add more functions to load additional modules if needed
