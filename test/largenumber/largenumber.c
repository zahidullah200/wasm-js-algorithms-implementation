#include <stdio.h>
#include <emscripten.h>

// Function to find the larger of two numbers with a delay
EMSCRIPTEN_KEEPALIVE
int findLarger(int a, int b) {
    return (a > b) ? a : b;
}

int main() {
    return 0;
}
