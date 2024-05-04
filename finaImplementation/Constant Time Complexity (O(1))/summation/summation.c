#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Function to calculate the sum of two numbers with a delay
EMSCRIPTEN_KEEPALIVE
unsigned long int calculateSum(long int a, long int b)
{
    // Allocate memory for the result
    unsigned long int *result = (unsigned long int *)malloc(sizeof(unsigned long int));

    // Calculate the sum
    *result = 0;
    for (int i = 0; i < 1000000; i++)
    {
        *result += (a + b);
    }

    // Retrieve the final result
    unsigned long int finalResult = *result;

    // Free allocated memory for the result
    free(result);

    return finalResult;
}
