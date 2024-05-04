#include <emscripten.h>
#include <stdlib.h>

// Function to generate and return an array of 10 numbers
EMSCRIPTEN_KEEPALIVE
int *generateNumbers() {
    int *numbers = (int *)malloc(10000 * sizeof(int)); // Allocate memory for 10000 integers
    if (numbers == NULL) {
        // Handle memory allocation failure
        return NULL; // Return NULL to indicate failure
    }

    for (int i = 0; i < 10000; i++) {
        numbers[i] = i + 1;
    }
    return numbers; // Return the dynamically allocated array
}

// Function to free dynamically allocated memory
EMSCRIPTEN_KEEPALIVE
void freeNumbers(int *numbers) {
    free(numbers); // Free the memory allocated for the array
}
