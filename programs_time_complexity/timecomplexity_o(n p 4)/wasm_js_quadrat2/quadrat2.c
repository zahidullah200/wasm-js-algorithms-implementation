#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Function to perform the time-complexity operation
int calculateTimeComplexity()
{
    int result = 0;
    int arr[] = {1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 9, 8, 6, 7, 8, 9, 7, 8, 4, 5, 6};
    int n = sizeof(arr) / sizeof(arr[0]);

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
    return result;
}

// Function exposed to JavaScript
EMSCRIPTEN_KEEPALIVE
int testTimeComplexity()
{
    return calculateTimeComplexity();
}
