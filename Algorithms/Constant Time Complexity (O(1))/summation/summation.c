#include <stdio.h>
#include <emscripten.h>

// Function to calculate the sum of two numbers with a delay
EMSCRIPTEN_KEEPALIVE
unsigned long int calculateSum(long int a, long int b)
{
    // Use a local variable for the result
    unsigned long int result = 0;

    // Calculate the sum
    for (int i = 0; i < 1000000; i++)
    {
        result += (a + b);
    }

    return result;
}
