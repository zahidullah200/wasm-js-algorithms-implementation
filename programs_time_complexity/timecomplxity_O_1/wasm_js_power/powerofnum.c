#include <emscripten.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>

// Function to allocate memory for result
EMSCRIPTEN_KEEPALIVE
double* allocateResultMemory() {
    double* result = (double*)malloc(sizeof(double));
    return result;
}

// Function to free memory for result
EMSCRIPTEN_KEEPALIVE
void freeResultMemory(double* result) {
    free(result);
}

// Function to calculate power
EMSCRIPTEN_KEEPALIVE
double calculatePower(int base, int exponent) {
    double* result = allocateResultMemory(); // Allocate memory
    *result = pow(base, exponent); // Calculate power and store in result
    double finalResult = *result;
    for (int i = 0; i <= 1000000; i++) {
      exponent = i + 2; //loop which does not effect the time complexity
    }
    freeResultMemory(result); // Free memory
    return finalResult;
}

