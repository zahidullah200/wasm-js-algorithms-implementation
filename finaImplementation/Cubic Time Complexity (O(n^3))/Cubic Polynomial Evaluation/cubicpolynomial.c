#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <emscripten.h>

// Function to evaluate the cubic polynomial
long long int evaluateCubicPolynomial(int *coefficients, int x, int n)
{
    long long int result = 0;

    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < n; j++)
        {
            for (int k = 0; k < n; k++)
            {
                result += (long long int)coefficients[i] * coefficients[j] * coefficients[k] * (long long int)pow(x, 6);
            }
        }
    }

    // Add a loop that doesn't affect time complexity
    for (int i = 0; i < 10000000; i++)
    {
        // Do some meaningless computation
        int mul = i * 1.0001;
        int dvd = i / 1.0001;
    }

    return result;
}

// Function exposed to JavaScript
EMSCRIPTEN_KEEPALIVE
long long int testCubicPolynomial()
{
    // Coefficients of the cubic polynomial
    int coefficients[] = {2, 3, 5, 6, 7, 8, 9, 10}; // Matching the coefficients in the JavaScript version
    int n = sizeof(coefficients) / sizeof(coefficients[0]);
    int *coefficients_copy = (int *)malloc(n * sizeof(int)); // Allocate memory for coefficients

    // Copy values to dynamically allocated memory
    for (int i = 0; i < n; i++)
    {
        coefficients_copy[i] = coefficients[i];
    }

    int x = 5; // Value of x

    long long int result = evaluateCubicPolynomial(coefficients_copy, x, n);

    // Free allocated memory
    free(coefficients_copy);

    return result;
}
