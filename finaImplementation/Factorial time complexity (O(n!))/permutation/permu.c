#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Function declarations
void swap(int *a, int *b);
void reverse(int *first, int *last);
int next_permutation(int *first, int *last);
int factorial(int n);

// Function to swap two elements in an array
void swap(int *a, int *b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}

// Function to reverse elements in an array
void reverse(int *first, int *last)
{
    while ((first != last) && (first != --last))
    {
        swap(first++, last);
    }
}

// Function to generate next permutation
int next_permutation(int *first, int *last)
{
    if (first == last)
        return 0;
    int *i = first;
    ++i;
    if (i == last)
        return 0;
    i = last;
    --i;

    while (1)
    {
        int *ii = i;
        --i;
        if (*i < *ii)
        {
            int *j = last;
            while (!(*i < *--j))
                ;
            swap(i, j);
            reverse(ii, last);
            return 1;
        }
        if (i == first)
        {
            reverse(first, last);
            return 0;
        }
    }
}

// Function to calculate factorial
int factorial(int n)
{
    if (n <= 1)
        return 1;
    else
        return n * factorial(n - 1);
}

// Function to generate permutations
EMSCRIPTEN_KEEPALIVE
int calculatePermutations(int n)
{
    // Allocate memory for the array to store permutations
    int *array = (int *)malloc(n * sizeof(int));
    if (array == NULL)
    {
        return -1; // Memory allocation failed
    }

    // Initialize the array with values 0 to n-1
    for (int i = 0; i < n; i++)
    {
        array[i] = i;
    }

    int count = 0;
    // Generate permutations
    do
    {
        // Introduce computation-intensive operation
        for (int j = 0; j < 10000000; j++)
        {
            count += 1; // Adjust this value
        }
    } while (next_permutation(array, array + n));

    // Free allocated memory
    free(array);

    return count;
}
