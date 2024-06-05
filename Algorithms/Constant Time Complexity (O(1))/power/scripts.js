document.addEventListener("DOMContentLoaded", () => {
  const runTestButton = document.getElementById("runTestButton");
  runTestButton.addEventListener("click", runTest);
});

async function runTest() {
  const testTypeSelect = document.getElementById("testType");
  const selectedTestType = testTypeSelect.value;

  if (selectedTestType === "javascript") {
      testConstantTimeJS();
  } else if (selectedTestType === "webassembly") {
      await testConstantTimeWASM();
  }
}

async function testConstantTimeWASM() {
  try {
      const response = await fetch("powerofnum.wasm");
      if (!response.ok) {
          throw new Error(
              "Failed to fetch WebAssembly module: " + response.statusText
          );
      }

      const wasmModule = await WebAssembly.instantiateStreaming(response, {
          env: {
              memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
              emscripten_resize_heap: () => {},
          },
      });

      const base = 30;
      const exponent = 100;
      const startTime = performance.now();
      const result = wasmModule.instance.exports.calculatePower(base, exponent);
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;

      displayResult(result, elapsedTime.toFixed(2), "Power (O(1))");
  } catch (error) {
      console.error("Error loading WebAssembly module:", error);
  }
}

function testConstantTimeJS() {
  const { time, result } = measurePerformance(() => {
      const startTime = performance.now();
      let exponent = 100;
      const result = Math.pow(30, exponent);
      for (let i = 0; i <= 1000000; i++) {
          exponent = i + 2;
      }
      return result;
  });

  displayResult(result, time, "Constant Time (O(1))");
}

function measurePerformance(callback) {
  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;
  return { time: elapsedTime.toFixed(2), result };
}

function displayResult(result, time, complexity) {
  const resultLabel = document
      .getElementById("resultLabel")
      .querySelector("span");
  const timeLabel = document.getElementById("timeLabel").querySelector("span");
  const complexityLabel = document
      .getElementById("complexityLabel")
      .querySelector("span");

  resultLabel.textContent = result;
  timeLabel.textContent = time + " ms";
  complexityLabel.textContent = complexity;
}