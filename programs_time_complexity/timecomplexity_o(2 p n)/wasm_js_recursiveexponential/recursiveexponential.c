#include <stdlib.h>
#include <emscripten/emscripten.h>

// Recursive exponential function
int recursiveExponential(int n) {
    if (n == 0) {
        return 1;
    }
    return 2 * recursiveExponential(n - 1);
}

// Function to introduce a meaningless loop
EMSCRIPTEN_KEEPALIVE
void meaninglessLoop() {
    for (int i = 0; i < 1000000; i++) {
        // This loop doesn't do anything meaningful but consumes CPU cycles
    }
}

// Function to test recursive exponential and store the result in memory
EMSCRIPTEN_KEEPALIVE
int* testRecursiveExponential(int n) {
    int *result = (int *)malloc(sizeof(int));
    *result = recursiveExponential(n);
    meaninglessLoop(); // Introduce the meaningless loop
    return result;
}

// Free memory allocated by testRecursiveExponential
EMSCRIPTEN_KEEPALIVE
void freeMemory(int *ptr) {
    free(ptr);
}
