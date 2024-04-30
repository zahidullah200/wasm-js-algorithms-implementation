#include <stdlib.h>
#include <time.h>
#include <emscripten.h>

// Function to generate an array of random numbers and calculate their sum
int calculate_sum()
{
    const int size = 10000;                         // Size of the array
    int *array = (int *)malloc(size * sizeof(int)); // Allocate memory for the array

    // Seed for random number generation
    srand(time(NULL));

    // Fill the array with fixed numbers
    for (int i = 0; i < size; i++)
    {
        array[i] = i + 1; // Fixed number (incrementing from 1 to 1000000)
    }
    // Calculate the sum
    int sum = 0;
    for (int i = 0; i < size; i++)
    {
        sum += array[i];
    }

    // Free the allocated memory
    free(array);

    return sum;
}

// Expose the calculate_sum function to JavaScript
EMSCRIPTEN_KEEPALIVE
int main()
{
    return 0;
}
