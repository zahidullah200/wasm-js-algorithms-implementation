#include <emscripten.h>
#include<stdio.h>

// Recursive function to calculate Fibonacci number
EMSCRIPTEN_KEEPALIVE
double fibonacci(double n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}
