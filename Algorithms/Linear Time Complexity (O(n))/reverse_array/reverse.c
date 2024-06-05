#include <stdio.h>
#include <emscripten.h>
#include <stddef.h>

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
void reverseArray(int arr[], size_t length) {
    size_t start = 0;
    size_t end = length - 1;
    while (start < end) {
        // Swap elements at start and end indices
        int temp = arr[start];
        arr[start] = arr[end];
        arr[end] = temp;

        // Move indices towards the center
        start++;
        end--;
    }
      // Adding a loop to take some performance time
    for (int i = 0; i < 200000; i++) {
        // Just iterating through the array without changing anything
        int dummy = arr[i]; 
        dummy+=dummy*2;
    }
}
