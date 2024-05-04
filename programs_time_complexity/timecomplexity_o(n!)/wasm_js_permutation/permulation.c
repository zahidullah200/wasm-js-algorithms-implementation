#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Function to calculate permutations
EMSCRIPTEN_KEEPALIVE
int calculatePermutations(int n)
{
    // Allocate memory for the array to store permutations
    double *permutations = (double *)malloc((n + 1) * sizeof(long double));
    if (permutations == NULL)
    {
        return -1; // Memory allocation failed
    }

    // Initialize the first value
    permutations[0] = 1;

    // Calculate permutations
    for (int i = 1; i <= n; i++)
    {
        permutations[i] = permutations[i - 1] * i;
    }

    // Introduce computation-intensive operation
    for (int j = 0; j < 10000000; j++)
    {
        permutations[n] *= 1; // Adjust this value
    }

    // Get the final result
    double result = permutations[n];

    // Free allocated memory
    free(permutations);

    return result;
}
