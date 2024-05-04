#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Helper function to calculate factorial
double calculateFactorial(int n, double *mem)
{
    // Base case
    if (n == 0 || n == 1)
    {
        return 1;
    }

    // Check if memory is already allocated for this value
    if (mem[n] != 0)
    {
        return mem[n];
    }

    // Add a loop that doesn't affect time complexity
    for (int i = 0; i < 10000; i++) {
        // Do nothing, just take some execution time
        int x = i * i;
    }

    // Recursive call to calculate factorial
    double result = n * calculateFactorial(n - 1, mem);

    // Save the result in memory for future reference
    mem[n] = result;

    return result;
}

// Function exposed to JavaScript
EMSCRIPTEN_KEEPALIVE
double testFactorial(int n)
{
    if (n < 0)
    {
        return -1; // Error handling for invalid input
    }

    // Allocate memory for factorial results
    double *mem = (double *)malloc((n + 1) * sizeof(double));
    if (mem == NULL)
    {
        return -1; // Memory allocation failed
    }

    // Initialize memory
    for (int i = 0; i <= n; i++)
    {
        mem[i] = 0;
    }

    // Calculate factorial
    double result = calculateFactorial(n, mem);

    // Free allocated memory
    free(mem);

    return result;
}