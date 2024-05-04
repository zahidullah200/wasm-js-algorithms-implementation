#include <stdio.h>
#include <emscripten.h>

// Function to calculate the sum of two numbers with a delay
EMSCRIPTEN_KEEPALIVE
int calculateSumWithDelay(int a, int b) {
    // Adding a delay of 10ms
    emscripten_sleep(10);
    return a + b;
}

int main() {
    return 0;
}
