let instance; // Declare instance globally
let originalImageDataPointer; // Declare original image data pointer globally

document.getElementById("sortButton").addEventListener("click", function () {
  const implementation = document.getElementById("implementationSelect").value;

  if (implementation === "javascript") {
    sortWithJavaScript();
  } else if (implementation === "webassembly") {
    sortWithWasm();
  }
});

// JavaScript sorting
function sortWithJavaScript() {
  const width = 300;
  const height = 300;
  const originalImageData = generateImageData(width, height);
  const sortedImageData = originalImageData.slice(); // Copy original image data

  const startTime = performance.now(); // Start measuring performance time
  quickSort(sortedImageData, 0, sortedImageData.length - 1);
  const endTime = performance.now(); // End measuring performance time
  const elapsedTime = endTime - startTime;

  displayImageData("originalCanvas", originalImageData, width, height);
  displayImageData("sortedCanvas", sortedImageData, width, height);

  document.getElementById("time_taken").textContent = `${elapsedTime} ms`;

  // Time complexity
  const n = width * height;
  const timeComplexity = `Time Complexity: O(n log n)`;
  document.getElementById("time_complexity").textContent = timeComplexity;
}

// WebAssembly sorting
function sortWithWasm() {
  // Check if the instance is already loaded
  if (!instance) {
    WebAssembly.instantiateStreaming(fetch("imagegensort.wasm"), {
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
      .catch((error) => console.error("Error loading WebAssembly module:", error));
  } else {
    // If instance is already loaded, call the main function directly
    main();
  }
}

// Main function to handle image generation and sorting
function main() {
  const width = 300;
  const height = 300;

  // Free memory allocated for previous original image data
  if (instance && instance.exports && instance.exports.freeImageData) {
    instance.exports.freeImageData(originalImageDataPointer);
  }

  // Measure performance time for sorting
  const startTime = performance.now();
  // Generate image data
  originalImageDataPointer = instance.exports.generateImageDataa(
    width,
    height
  );

  // Create a new Uint8ClampedArray for original image data
  const originalImageData = new Uint8ClampedArray(
    instance.exports.memory.buffer,
    originalImageDataPointer,
    width * height * 4
  );
  const originalImage = new ImageData(originalImageData, width, height);
  drawImage(originalImage, "originalCanvas");

  // Sort image data
  instance.exports.sortImageData(originalImageDataPointer, width, height);
  console.log("Image data sorted");

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  // Display performance time
  const performanceLabel = document.getElementById("time_taken");
  if (performanceLabel) {
    performanceLabel.textContent = `${elapsedTime} ms`;
  } else {
    console.error("Performance label not found");
  }

  // Create a new Uint8ClampedArray for sorted image data
  const sortedImageData = new Uint8ClampedArray(
    instance.exports.memory.buffer,
    originalImageDataPointer,
    width * height * 4
  );
  const sortedImage = new ImageData(sortedImageData, width, height);
  drawImage(sortedImage, "sortedCanvas");
}

// Function to draw image data onto canvas
function drawImage(imageData, canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  ctx.putImageData(imageData, 0, 0);
}

// Struct to represent a pixel (RGBA)
class Pixel {
  constructor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

// Function to calculate grayscale value of a pixel
function calculateGrayscale(pixel) {
  return Math.round(0.3 * pixel.r + 0.59 * pixel.g + 0.11 * pixel.b);
}

// Function declarations
function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (calculateGrayscale(arr[j]) <= calculateGrayscale(pivot)) {
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

function quickSort(arr, left, right) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
}

// Function to generate random pixel value
function randomPixel() {
  return new Pixel(
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    255
  );
}

// Function to generate random image data
function generateImageData(width, height) {
  const size = width * height;
  const imageData = new Array(size);
  for (let i = 0; i < size; i++) {
    imageData[i] = randomPixel();
  }
  return imageData;
}

// Function to display image data on canvas
function displayImageData(canvasId, imageData, width, height) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const imageDataArray = ctx.createImageData(width, height);
  for (let i = 0; i < imageData.length; i++) {
    const index = i * 4;
    imageDataArray.data[index] = imageData[i].r;
    imageDataArray.data[index + 1] = imageData[i].g;
    imageDataArray.data[index + 2] = imageData[i].b;
    imageDataArray.data[index + 3] = imageData[i].a;
  }
  ctx.putImageData(imageDataArray, 0, 0);
}
