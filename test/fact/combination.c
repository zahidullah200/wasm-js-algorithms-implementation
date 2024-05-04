#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Function to calculate factorial
int calculateFactorial(int n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

// Function to calculate combinations
int calculateCombinations(int n) {
    int count = 0;
    int* factorials = (int*)malloc((n + 1) * sizeof(int)); // Allocate memory for factorials
    if (factorials == NULL) {
        return -1; // Memory allocation failed
    }
    factorials[0] = 1;
    for (int i = 1; i <= n; i++) {
        factorials[i] = i * factorials[i - 1];
    }

    for (int i = 0; i < factorials[n]; i++) {
        for (int j = 0; j < 10000000; j++) {
            count += 1; // Adjust this value
        }
    }

    free(factorials); // Free allocated memory
    return count;
}

// Function to be called from JavaScript
EMSCRIPTEN_KEEPALIVE
int runCalculation(int n) {
    return calculateCombinations(n);
}
