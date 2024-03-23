const canvas = document.getElementById("img-canvas");
const sort_canvas = document.getElementById("sort-canvas");

const ctx = canvas.getContext("2d");
const sort_ctx = sort_canvas.getContext("2d");

let wasm_module;
(async () => {
  wasm_module = await loadWasm("./build/release.wasm");
})();

async function mainWasm(width, height) {
  const { memory, generateRandom, memory_ptr, sortNew } =
    wasm_module.instance.exports;
  const wasmByteMemory = new Uint8Array(memory.buffer);

  generateRandom(width, height);
  const rand_img = new ImageData(width, height);
  rand_img.data.set(
    wasmByteMemory.slice(memory_ptr.valueOf(), memory_ptr + width * height * 4)
  );
  ctx.putImageData(rand_img, 0, 0);
  sortNew(width, height);
  const wasm_img_data_arr = wasmByteMemory.slice(
    memory_ptr.valueOf(),
    (memory_ptr + width * height * 4).valueOf()
  );
  const sort_img_data = sort_ctx.createImageData(width, height);
  sort_img_data.data.set(wasm_img_data_arr);
  sort_ctx.putImageData(sort_img_data, 0, 0);
  // const temp_data=new Uint8Array(memory.buffer);
  // console.log(temp_data[0]);
}

document.getElementById("sort_btn").addEventListener("click", (e) => {
  const run_on = document.getElementById("wasm-js").value;

  const w = 500,
    h = 500;

  //we should put as common becuase these are for both js and wasm
  let x1 = performance.now();
  canvas.width = w;
  canvas.height = h;
  sort_canvas.width = w;
  sort_canvas.height = h;
  if (run_on == "") {
    alert("Please choose one compiler to generate and sort the image");
  } else if (run_on == "wasm") {
    //run wasm code here.
    mainWasm(w, h);

    let x2 = performance.now();
    document.getElementById("time_taken").innerHTML = `${(x2 - x1).toFixed(
      2
    )} ms`;
    const memoryInfo = performance.memory;
    let memory_used = memoryInfo.usedJSHeapSize;
    let memory_limit = memoryInfo.jsHeapSizeLimit;
    let total_heap = memoryInfo.totalJSHeapSize;

    document.getElementById("memory_taken").innerHTML = `Memory taken: ${(
      memory_used / 1024
    ).toFixed(3)} kb`;
  } else if (run_on == "js") {
    //run js code here
    const rand_img = generateRandom(w, h);
    ctx.putImageData(rand_img, 0, 0);
    // console.log(rand_img.data);
    sorting(rand_img.data, w, h);
    sort_ctx.putImageData(rand_img, 0, 0);

    let x2 = performance.now();
    document.getElementById("time_taken").innerHTML = `${(x2 - x1).toFixed(
      2
    )} ms`;
    const memoryInfo = performance.memory;
    let memory_used = memoryInfo.usedJSHeapSize;
    let memory_limit = memoryInfo.jsHeapSizeLimit;
    let total_heap = memoryInfo.totalJSHeapSize;

    document.getElementById("memory_taken").innerHTML = `Memory taken: ${(
      memory_used / 1024
    ).toFixed(3)} kb`;
  } else {
  }
});

//function to import wasm file
async function loadWasm(wasmModuleUrl, importObject) {
  if (!importObject) {
    importObject = {
      env: {
        abort(_msg, _file, _line, column) {
          console.error("abort called at main.ts:" + line + ":" + column);
        },
        seed() {
          return (() => {
            return Date.now() * Math.random();
          })();
        },
      },
      index: {
        log: (d) => console.log(d),
      },
    };
  }

  const wasm_module = await WebAssembly.instantiateStreaming(
    fetch(wasmModuleUrl),
    importObject
  );
  return wasm_module;
}

//creating random image
function generateRandom(w, h) {
  const rand_img = new ImageData(w, h);
  const rand_img_data = rand_img.data; //1d array
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let pixel_ind = (y * w + x) * 4;
      rand_img_data[pixel_ind] = Math.floor(Math.random() * 256); //red
      rand_img_data[pixel_ind + 1] = Math.floor(Math.random() * 256); //green
      rand_img_data[pixel_ind + 2] = Math.floor(Math.random() * 256); //blue
      rand_img_data[pixel_ind + 3] = 255; //Alpha
    }
  }
  return rand_img;
}

//sorting the array function
function sorting(array, w, h) {
  //bubble sorting algorithm
  let did_changes = false;
  do {
    did_changes = false;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const pixel_intensity_a = brightness(array, x, y, w);
        const pixel_intensity_b =
          x + 1 < w ? brightness(array, x + 1, y, w) : null;
        if (
          pixel_intensity_a &&
          pixel_intensity_b &&
          pixel_intensity_a < pixel_intensity_b
        ) {
          swapPixels(array, x, y, w);
          did_changes = true;
        }
      }
    }
  } while (did_changes);
}

// function to compare the pixels
function brightness(array, x, y, width) {
  const pixel_ind = (y * width + x) * 4;
  if (pixel_ind >= array.length) return 0;
  return (
    0.0126 * array[pixel_ind] +
    0.0152 * array[pixel_ind + 1] +
    0.30722 * array[pixel_ind + 2]
  );
}

//to swap pixels
function swapPixels(array, x, y, w) {
  const pixel_ind_1 = (y * w + x) * 4;
  const pixel_ind_2 = (y * w + (x + 1)) * 4;
  for (let i = 0; i < 3; i++) {
    let temp = array[pixel_ind_1 + i];
    array[pixel_ind_1 + i] = array[pixel_ind_2 + i];
    array[pixel_ind_2 + i] = temp;
  }
  array[pixel_ind_1 + 3] = 255;
  array[pixel_ind_2 + 3] = 255;
}
