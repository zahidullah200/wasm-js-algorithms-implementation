#include <stdlib.h>
#include <stdio.h>
#include <time.h> // Include time.h for time()
#include <emscripten.h>

// Declare global pointers for matrices
int *matrixA, *matrixB, *result;

// Function to allocate memory for matrices and generate random values
void initializeMatrices(int size)
{
    // Allocate memory for matrices
    matrixA = (int *)malloc(size * size * sizeof(int));
    matrixB = (int *)malloc(size * size * sizeof(int));
    result = (int *)malloc(size * size * sizeof(int));

    // Seed the random number generator with current time
    srand(time(0));

    // Generate random values for matrices A and B
    for (int i = 0; i < size; i++)
    {
        for (int j = 0; j < size; j++)
        {
            matrixA[i * size + j] = rand() % 10;
            matrixB[i * size + j] = rand() % 10;
        }
    }
}

// Function to free memory for matrices
void freeMatrices()
{
    free(matrixA);
    free(matrixB);
    free(result);
}

// Function to multiply two matrices
void matrixMultiply(int size)
{
    // Perform matrix multiplication
    for (int i = 0; i < size; i++)
    {
        for (int j = 0; j < size; j++)
        {
            result[i * size + j] = 0;
            for (int k = 0; k < size; k++)
            {
                result[i * size + j] += matrixA[i * size + k] * matrixB[k * size + j];
            }
        }
    }
}

// Expose function to JavaScript to initialize matrices and perform multiplication
EMSCRIPTEN_KEEPALIVE
int *generateAndMultiply(int size)
{
    // Initialize matrices
    initializeMatrices(size);

    // Multiply matrices
    matrixMultiply(size);

    // Return pointer to result
    return result;
}

// Expose function to JavaScript to free memory
EMSCRIPTEN_KEEPALIVE
void freeMemory()
{
    freeMatrices();
}
