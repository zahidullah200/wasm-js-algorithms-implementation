#include <stdint.h>
#include <stddef.h>
#include <stdlib.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
uint8_t* allocateMemory(size_t size) {
    return (uint8_t*)malloc(size);
}

EMSCRIPTEN_KEEPALIVE
void freeMemory(uint8_t* ptr) {
    free(ptr);
}

EMSCRIPTEN_KEEPALIVE
void applyThreshold(int width, int height, uint8_t* imageData, uint8_t threshold) {
    for (int i = 0; i < width * height * 4; i += 4) {
        uint8_t average = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
        imageData[i] = imageData[i + 1] = imageData[i + 2] = average > threshold ? 255 : 0;
    }
}
