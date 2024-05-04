#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Function to perform the time-complexity operation
int calculateTimeComplexity()
{
    int result = 0;
    int n = 5; // size of the array

    // Allocate memory for the array
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL)
    {
        return -1; // Memory allocation failed
    }

    // Initialize the array
    for (int i = 0; i < n; i++)
    {
        arr[i] = i + 1;
    }

    // Perform the time-complexity operation
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < n; j++)
        {
            for (int k = 0; k < n; k++)
            {
                for (int l = 0; l < n; l++)
                {
                    result += arr[i] * arr[j] * arr[k] * arr[l]; // O(n^4) time operation
                }
            }
        }
    }

    // Free allocated memory
    free(arr);

    return result;
}

// Function exposed to JavaScript
EMSCRIPTEN_KEEPALIVE
int testTimeComplexity()
{
    return calculateTimeComplexity();
}
