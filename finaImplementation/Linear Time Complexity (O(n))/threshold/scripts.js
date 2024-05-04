async function thresholdImage(imageData, thresholdValue) {
    await instantiateThresholdWasm();
    const width = imageData.width;
    const height = imageData.height;
    const data = new Uint8Array(imageData.data.buffer);

    const imagePointer = thresholdInstance.exports.allocateMemory(
        data.length
    );
    new Uint8Array(
        thresholdInstance.exports.memory.buffer,
        imagePointer,
        data.length
    ).set(data);

    const startMemory = thresholdInstance.exports.memory.buffer.byteLength;

    const startTime = performance.now();

    //function calling and passing parameters for wasm function which is avaiable in the c code.
    thresholdInstance.exports.applyThreshold(
        width,
        height,
        imagePointer,
        thresholdValue
    );

    const endTime = performance.now();

    const endMemory = thresholdInstance.exports.memory.buffer.byteLength;

    const timeTaken = endTime - startTime;

    console.log(`${timeTaken} ms`);
    console.log(`Wasm Memory used: ${endMemory - startMemory} bytes`);

    const canvas = document.getElementById("thresholdOutputCanvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const modifiedImageData = ctx.createImageData(width, height);
    modifiedImageData.data.set(
        new Uint8ClampedArray(
            thresholdInstance.exports.memory.buffer,
            imagePointer,
            width * height * 4
        )
    );
    ctx.putImageData(modifiedImageData, 0, 0);

    thresholdInstance.exports.freeMemory(imagePointer);

    document.getElementById("timeLabel").textContent = `${timeTaken.toFixed(2)} ms`;
}




   // Function to handle image processing using pure JavaScript
   function processImageJS(image, threshold) {
    const canvas = document.getElementById("thresholdOutputCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0, image.width, image.height);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);

    // Measure the starting time
    const startTime = performance.now();

    // Convert the image to grayscale
    grayscaleImage(imageData);

    // Apply threshold effect
    applyThreshold(imageData, threshold);

    // Put the modified image data back on the canvas
    ctx.putImageData(imageData, 0, 0);

    // Measure the ending time
    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    // Display the time taken
    console.log(`JS Time taken: ${timeTaken.toFixed(2)} ms`);
    document.getElementById("timeLabel").textContent = `${timeTaken.toFixed(2)} ms`;
  }

function grayscaleImage(imageData) {
  for (let i = 0; i < imageData.data.length; i += 4) {
      const average =
          (imageData.data[i] +
              imageData.data[i + 1] +
              imageData.data[i + 2]) /
          3;
      imageData.data[i] =
          imageData.data[i + 1] =
          imageData.data[i + 2] =
              average;
  }
}


function applyThreshold(imageData, threshold) {
  for (let i = 0; i < imageData.data.length; i += 4) {
      const intensity = imageData.data[i];
      const color = intensity > threshold ? 255 : 0;
      imageData.data[i] =
          imageData.data[i + 1] =
          imageData.data[i + 2] =
              color;
  }
}

document.getElementById("processButton").addEventListener("click", function () {
    const imageInput = document.getElementById("thresholdImageInput");
    const selectedImplementation = document.getElementById("implementationSelect").value;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = URL.createObjectURL(imageInput.files[0]);
    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const thresholdValue = 128;

        if (selectedImplementation === "wasm") {
            thresholdImage(imageData, thresholdValue);
        } else {
            processImageJS(image, thresholdValue);
        }
    };
});








let thresholdInstance;

async function instantiateThresholdWasm() {
    if (!thresholdInstance) {
        const result = await WebAssembly.instantiateStreaming(
            fetch("thre.wasm"),
            {
                env: {
                    memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
                    emscripten_resize_heap: () => {},
                },
            }
        );
        thresholdInstance = result.instance;
    }
}

WebAssembly.instantiateStreaming(fetch('thre.wasm'), {
    env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
        table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
        emscripten_resize_heap: function (size) {},
    }
}).then(results => {
    thresholdInstance = results.instance;
    console.log("WebAssembly module loaded");
    // Initialize any module-specific logic here
}).catch(error => console.error(error));

