#include <stdlib.h>
#include <time.h>
#include <emscripten.h>

// Function to generate an array of numbers from 1 to 100000 and calculate their sum
EMSCRIPTEN_KEEPALIVE
int  calculate_sum() {
    int size = 10000; // Size of the array
    int *array = (int  *)malloc(size * sizeof(int)); // Allocate memory for the array

    // Fill the array with numbers from 1 to 100000
    for (int  i = 0; i < size; i++) {
        array[i] = i + 1;
    }

    // Calculate the sum
    int  sum = 0;
    for (int  i = 0; i < size; i++) {
        sum += array[i];
    }

    // Free the allocated memory
    free(array);

    return sum;
}