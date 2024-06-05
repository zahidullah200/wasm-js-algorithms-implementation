#include <stdio.h>
#include <math.h>
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

    // Random loop for added execution time
    for (int i = 0; i < 10000000; i++)
    {
        int res = 0;
        res += i; // Just to use some CPU cycles
    }

    return result;
}

// Function exposed to JavaScript
EMSCRIPTEN_KEEPALIVE
long long int testCubicPolynomial()
{
    // Coefficients of the cubic polynomial
    int coefficients[] = {2, 3, 5, 6, 7, 8}; // Matching the coefficients in the JavaScript version
    int n = sizeof(coefficients) / sizeof(coefficients[0]);

    int x = 5; // Value of x

    long long int result = evaluateCubicPolynomial(coefficients, x, n);

    return result;
}
