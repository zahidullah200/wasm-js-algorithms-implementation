#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Function to perform the time-complexity operation
long long int calculateTimeComplexity()
{
    unsigned long long int result = 0;
    int n = 20; // size of the array

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

      // Random loop for added execution time
    for (int i = 0; i < 10000000; i++)
    {
        result += i; // Just to use some CPU cycles
    }

    result=0;
 
    // Perform the time-complexity operation
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < n; j++)
        {
            for (int k = 0; k < n; k++)
            {
                for (int l = 0; l < n; l++)
                {
                    result += (long long int)arr[i] * arr[j] * arr[k] * arr[l]; // O(n^4) time operation
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
long long int testTimeComplexity()
{
    return calculateTimeComplexity();
}
