#include <emscripten.h>
#include <stdlib.h>
#include <stdint.h>

int32_t* memory = NULL;

EMSCRIPTEN_KEEPALIVE
int32_t* array_malloc(int32_t size) {
    memory = (int32_t*)malloc(size * sizeof(int32_t));
    return memory;
}

EMSCRIPTEN_KEEPALIVE
void array_free(int32_t* arr) {
    free(arr);
}

EMSCRIPTEN_KEEPALIVE
void bubbleSort(int32_t* arr, int32_t size) {
    for (int32_t i = 0; i < size - 1; ++i) {
        for (int32_t j = 0; j < size - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                int32_t temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}
