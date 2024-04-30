// index.js

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
    WebAssembly.instantiateStreaming(fetch("imagegensort.wasm"), {
        wasi_snapshot_preview1: {
            fd_close: () => {},
            fd_write: () => {},
            fd_seek: () => {}
        },
        env: {
            exit: () => {}, // Provide an empty function for the exit function
            emscripten_memcpy_js: (dest, source, num) => {
                // Simple implementation of memory copy function
                for (let i = 0; i < num; i++) {
                    Module.HEAP8[dest + i] = Module.HEAP8[source + i];
                }
            },
            emscripten_resize_heap: () => {} // Provide an empty function for resizing the heap
        }
    })
    .then(results => {
        console.log("WebAssembly module loaded successfully");
        instance = results.instance; // Store the instance globally

        // Call the main function after the module is loaded
        main();
    })
    .catch(error => console.error("Error loading WebAssembly module:", error));

    // Main function to handle image generation and sorting
    function main() {
        const width = 400;
        const height = 400;

        // Generate image data
        const originalImageDataPointer = instance.exports.generateImageData(width, height);
        console.log("Original image data generated:", originalImageDataPointer);
        const originalImageData = new Uint8ClampedArray(instance.exports.memory.buffer, originalImageDataPointer, width * height * 4);
        const originalImage = new ImageData(originalImageData, width, height);
        drawImage(originalImage, 'img-canvas');

        // Measure performance time for sorting
        const startTime = performance.now();

        // Sort image data
        instance.exports.sortImageData(originalImageDataPointer, width, height);
        console.log("Image data sorted");

        const endTime = performance.now();
        const elapsedTime = endTime - startTime;

        // Display performance time
        const performanceLabel = document.getElementById('time_taken');
        performanceLabel.textContent = `${elapsedTime.toFixed(2)} ms`;

        const sortedImageData = new Uint8ClampedArray(instance.exports.memory.buffer, originalImageDataPointer, width * height * 4);
        const sortedImage = new ImageData(sortedImageData, width, height);
        drawImage(sortedImage, 'sort-canvas');
    }

    // Function to draw image data onto canvas
    function drawImage(imageData, canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
    }
}





  //Pure js function
  function sortWithJs() {
    // Function to generate a random pixel value (for demonstration)
    function randomPixel() {
      return Math.floor(Math.random() * 256); // Generate a random value between 0 and 255 (inclusive)
    }
  
    // Function to generate random image data
    function generateImageData(width, height) {
      const pixelCount = width * height;
      const imageData = new Uint8ClampedArray(pixelCount * 4); // 4 bytes per pixel (RGBA)
  
      for (let i = 0; i < pixelCount; i++) {
        const offset = i * 4; // Each pixel occupies 4 consecutive bytes (RGBA)
        imageData[offset] = randomPixel(); // Red
        imageData[offset + 1] = randomPixel(); // Green
        imageData[offset + 2] = randomPixel(); // Blue
        imageData[offset + 3] = 255; // Alpha (opaque)
      }
  
      return new ImageData(imageData, width, height);
    }
  
    // Function to draw image data onto canvas
    function drawImage(imageData, canvasId) {
      const canvas = document.getElementById(canvasId);
      const ctx = canvas.getContext('2d');
      ctx.putImageData(imageData, 0, 0);
    }
  
    // Function to calculate grayscale value of a pixel
    function calculateGrayscale(pixel) {
      return 0.3 * pixel[0] + 0.59 * pixel[1] + 0.11 * pixel[2];
    }
  
    // Function to sort pixels based on grayscale values using Quick Sort
    function sortPixelsByGrayscale(imageData) {
      const startTime = performance.now();
  
      const pixels = imageData.data;
  
      // Helper function to get pixel value at given coordinates
      function getPixel(x, y) {
        const offset = (y * imageData.width + x) * 4;
        return [pixels[offset], pixels[offset + 1], pixels[offset + 2], pixels[offset + 3]];
      }
  
      // Helper function to set pixel value at given coordinates
      function setPixel(x, y, pixel) {
        const offset = (y * imageData.width + x) * 4;
        pixels[offset] = pixel[0];
        pixels[offset + 1] = pixel[1];
        pixels[offset + 2] = pixel[2];
        pixels[offset + 3] = pixel[3];
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
      const width = imageData.width;
      const height = imageData.height;
      const pixelArray = Array.from({ length: width * height }, (_, i) => getPixel(i % width, Math.floor(i / width)));
      quickSort(pixelArray, 0, pixelArray.length - 1);
  
      // Update image data with sorted pixels
      for (let i = 0; i < pixelArray.length; i++) {
        setPixel(i % width, Math.floor(i / width), pixelArray[i]);
      }
  
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
  
      return { imageData, elapsedTime };
    }
  
    // Generate random image data
    const width = 400;
    const height = 400;
    const imageData = generateImageData(width, height);
  
    // Draw the original image
    drawImage(imageData, 'img-canvas');
  
    // Sort pixels based on grayscale values
    const { imageData: sortedImageData, elapsedTime } = sortPixelsByGrayscale(imageData);
  
    // Draw the sorted image
    drawImage(sortedImageData, 'sort-canvas');
  
    // Display performance time
    const performanceLabel = document.getElementById('time_taken');
    performanceLabel.textContent = `${elapsedTime.toFixed(2)} ms`;
  }
  