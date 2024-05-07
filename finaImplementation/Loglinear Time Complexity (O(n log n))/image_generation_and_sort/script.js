document.addEventListener("DOMContentLoaded", function () {
  const sortBtn = document.getElementById("sort_btn");
  const wasmJsSelect = document.getElementById("wasm-js");

  sortBtn.addEventListener("click", function () {
    const selectedCompiler = wasmJsSelect.value;

    if (selectedCompiler === "wasm") {
      sortWithWasm();
    } else if (selectedCompiler === "js") {
      sortWithJs();
    } else {
      alert("Please select a compiler.");
    }
  });
});

function sortWithWasm() {
  let instance; // Declare instance globally

  // Load the WebAssembly module globally
  WebAssembly.instantiateStreaming(fetch("2.wasm"), {
    wasi_snapshot_preview1: {
      fd_close: () => {},
      fd_write: () => {},
      fd_seek: () => {},
    },
    env: {
      exit: () => {}, // Provide an empty function for the exit function
      emscripten_memcpy_js: (dest, source, num) => {
        // Simple implementation of memory copy function
        for (let i = 0; i < num; i++) {
          Module.HEAP8[dest + i] = Module.HEAP8[source + i];
        }
      },
      emscripten_resize_heap: () => {}, // Provide an empty function for resizing the heap
    },
  })
    .then((results) => {
      console.log("WebAssembly module loaded successfully");
      instance = results.instance; // Store the instance globally

      // Call the main function after the module is loaded
      main();
    })
    .catch((error) =>
      console.error("Error loading WebAssembly module:", error)
    );

  // Main function to handle image generation and sorting
  function main() {
    const width = 400;
    const height = 400;

    // Generate image data
    const originalImageDataPointer = instance.exports.generateImageDataa(
      width,
      height
    );
    const originalImageData = new Uint8ClampedArray(
      instance.exports.memory.buffer,
      originalImageDataPointer,
      width * height * 4
    );
    const originalImage = new ImageData(originalImageData, width, height);
    drawImage(originalImage, "img-canvas");

    // Measure performance time for sorting
    const startTime = performance.now();

    // Sort image data
    instance.exports.sortImageData(originalImageDataPointer, width, height);
    console.log("Image data sorted");

    const endTime = performance.now();
    const elapsedTime = endTime - startTime;

    // Display performance time
    const performanceLabel = document.getElementById("time_taken");
    performanceLabel.textContent = `${elapsedTime.toFixed(2)} ms`;

    const sortedImageData = new Uint8ClampedArray(
      instance.exports.memory.buffer,
      originalImageDataPointer,
      width * height * 4
    );
    const sortedImage = new ImageData(sortedImageData, width, height);
    drawImage(sortedImage, "sort-canvas");
  }

  // Function to draw image data onto canvas
  function drawImage(imageData, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);
  }
}

function sortWithJs() {
  const width = 400;
  const height = 400;

  // Function to generate random pixel value
  function randomPixel() {
    return [
      Math.floor(Math.random() * 256), // Red
      Math.floor(Math.random() * 256), // Green
      Math.floor(Math.random() * 256), // Blue
      255, // Alpha
    ];
  }

  // Function to generate random image data
  function generateImageData(width, height) {
    const imageData = new Uint8ClampedArray(width * height * 4); // RGBA format

    for (let i = 0; i < width * height; i++) {
      const pixelIndex = i * 4;
      const pixel = randomPixel();
      imageData[pixelIndex] = pixel[0]; // Red
      imageData[pixelIndex + 1] = pixel[1]; // Green
      imageData[pixelIndex + 2] = pixel[2]; // Blue
      imageData[pixelIndex + 3] = pixel[3]; // Alpha
    }

    return imageData;
  }

  // Function to calculate grayscale value of a pixel
  function calculateGrayscale(pixel) {
    return 0.3 * pixel[0] + 0.59 * pixel[1] + 0.11 * pixel[2];
  }

  // Function to sort pixels based on grayscale values using Quick Sort
  function sortPixelsByGrayscale(imageData) {
    const startTime = performance.now();
  
    const pixels = new Uint32Array(imageData.data.buffer); // Convert to Uint32 for faster access
  
    // Helper function to get pixel value at given coordinates
    function getPixel(x, y) {
      const offset = y * imageData.width + x;
      const pixelValue = pixels[offset];
      const r = (pixelValue >> 24) & 0xff;
      const g = (pixelValue >> 16) & 0xff;
      const b = (pixelValue >> 8) & 0xff;
      const a = pixelValue & 0xff;
      return [r, g, b, a];
    }
  
    // Helper function to set pixel value at given coordinates
    function setPixel(x, y, pixel) {
      const offset = y * imageData.width + x;
      const pixelValue =
        (pixel[3] << 24) | (pixel[0] << 16) | (pixel[1] << 8) | pixel[2]; // Reorder RGBA
      pixels[offset] = pixelValue;
    }
  
    // Quick Sort algorithm
    function quickSort(arr, left, right) {
      if (left >= right) return;
  
      const pivotIndex = partition(arr, left, right);
      quickSort(arr, left, pivotIndex - 1);
      quickSort(arr, pivotIndex + 1, right);
    }
  
    function partition(arr, left, right) {
      const pivot = calculateGrayscale(arr[right]);
      let i = left - 1;
  
      for (let j = left; j <= right - 1; j++) {
        if (calculateGrayscale(arr[j]) <= pivot) {
          i++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
  
      const temp = arr[i + 1];
      arr[i + 1] = arr[right];
      arr[right] = temp;
  
      return i + 1;
    }
  
    // Sort pixels based on grayscale values using Quick Sort
    const pixelArray = Array.from({ length: imageData.width * imageData.height }, (_, i) =>
      getPixel(i % imageData.width, Math.floor(i / imageData.width))
    );
    quickSort(pixelArray, 0, pixelArray.length - 1);
  
    // Update image data with sorted pixels
    for (let i = 0; i < pixelArray.length; i++) {
      setPixel(i % imageData.width, Math.floor(i / imageData.width), pixelArray[i]);
    }
  
    // Create a new Uint8ClampedArray and populate it with sorted pixels
    const sortedImageData = new Uint8ClampedArray(pixels.length * 4);
    for (let i = 0; i < pixelArray.length; i++) {
      const offset = i * 4;
      sortedImageData[offset] = pixelArray[i][0];
      sortedImageData[offset + 1] = pixelArray[i][1];
      sortedImageData[offset + 2] = pixelArray[i][2];
      sortedImageData[offset + 3] = pixelArray[i][3];
    }
  
    // Create a new ImageData object from the clamped array
    const sortedImageDataObject = new ImageData(sortedImageData, imageData.width, imageData.height);
  
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
  
    return { imageData: sortedImageDataObject, elapsedTime };
  }
  
  // Generate random image data
  const originalImageData = generateImageData(width, height);

  // Draw the original image
  drawImage(originalImageData, "img-canvas");

  // Sort pixels based on grayscale values
  const { imageData: sortedImageData, elapsedTime } =
    sortPixelsByGrayscale(originalImageData);

  // Draw the sorted image
  drawImage(sortedImageData, "sort-canvas");

  // Display performance time
  const performanceLabel = document.getElementById("time_taken");
  performanceLabel.textContent = `${elapsedTime.toFixed(2)} ms`;
}

// Function to draw image data onto canvas
function drawImage(imageData, canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
}
