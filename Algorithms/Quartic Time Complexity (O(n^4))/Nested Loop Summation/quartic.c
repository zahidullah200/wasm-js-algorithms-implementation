#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Function to perform the quadratic time operation
int calculateQuadraticTime()
{
    int result = 0;

    for (int i = 0; i < 70; i++)
    {
        for (int j = 0; j < 70; j++)
        {
            for (int k = 0; k < 30; k++)
            {
                for (int l = 0; l < 30; l++)
                {
                    result += i + j + k + l; // Quadratic time operation
                }
            }
        }
    }

    return result;
}

// Function to allocate memory
int *allocateMemory()
{
    int *arr = (int *)malloc(30 * sizeof(int)); // Allocating memory for array of size 30

    return arr;
}

// Function to free memory
void freeMemory(int *arr)
{
    free(arr);
}

// Function exposed to JavaScript
EMSCRIPTEN_KEEPALIVE
int testQuadraticTime()
{
    int *arr = allocateMemory(); // Allocate memory

    if (arr == NULL)
    {
        return -1; // Return error if memory allocation failed
    }

    int result = calculateQuadraticTime(); // Perform quadratic time operation

    freeMemory(arr); // Free allocated memory

    return result;
}
