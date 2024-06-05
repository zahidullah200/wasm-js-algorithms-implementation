#include <emscripten.h>
#include <stdio.h>
#include <math.h>

// Function to calculate power
EMSCRIPTEN_KEEPALIVE
double calculatePower(int base, int exponent)
{
    // Use a local variable for the result
    double result = pow(base, exponent); // Calculate power and store in result
    double finalResult = result;
    
    // This loop seems unnecessary and doesn't affect the final result
    for (int i = 0; i <= 1000000; i++)
    {
        exponent = i + 2;
    }
    
    return finalResult;
}
