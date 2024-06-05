#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Function to calculate factorial
int calculateFactorial(int n) {
    if (n <= 1)
        return 1;
    return n * calculateFactorial(n - 1);
}

// Function to calculate combinations
int calculateCombinations(int n) {
    int count = 0;

    // Iterate n! times
    for (int i = 0; i < calculateFactorial(n); i++) {
        for (int j = 0; j < 10000000; j++) {
            count += 1; // Adjust this value
        }
    }

    return count;
}

// Function to be called from JavaScript
EMSCRIPTEN_KEEPALIVE
int runCalculation(int n) {
    return calculateCombinations(n);
}
