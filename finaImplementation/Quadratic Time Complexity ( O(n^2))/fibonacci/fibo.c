#include <emscripten.h>

// Global variable to store memory allocation status
int memoryAllocated = 0;

// Recursive function to calculate Fibonacci number
EMSCRIPTEN_KEEPALIVE
double fibonacci(double n) {
    // Allocate memory if not already allocated
    if (!memoryAllocated) {
        // Allocate 10MB of memory
        void *mem = malloc(1024*1024);
        if (mem == NULL) {
            // Memory allocation failed
            return -1; // Return an error value
        }
        memoryAllocated = 1; // Mark memory as allocated
    }

    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}
