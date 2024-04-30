#include <stdlib.h>
#include <emscripten/emscripten.h>

// Recursive Fibonacci function
int recursiveFibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return recursiveFibonacci(n - 1) + recursiveFibonacci(n - 2);
}

// Function to test recursive Fibonacci and store the result in memory
EMSCRIPTEN_KEEPALIVE
int* testRecursiveFibonacci(int n) {
    int *result = (int *)malloc(sizeof(int));
    *result = recursiveFibonacci(n);
    return result;
}

// Free memory allocated by testRecursiveFibonacci
EMSCRIPTEN_KEEPALIVE
void freeMemory(int *ptr) {
    free(ptr);
}
