#include <emscripten.h>
#include <stdlib.h>

// Binary search function
EMSCRIPTEN_KEEPALIVE
int binarySearch(int *arr, int length, int target)
{
    int left = 0;
    int right = length - 1;
    while (left <= right)
    {
        int mid = (left + right) / 2;
        if (arr[mid] == target)
        {
            return mid;
        }
        else if (arr[mid] < target)
        {
            left = mid + 1;
        }
        else
        {
            right = mid - 1;
        }
    }
    return -1; // Not found
}

// Function to allocate memory for array
EMSCRIPTEN_KEEPALIVE
int *allocateArray(int length)
{
    return (int *)malloc(length * sizeof(int));
}

// Function to free allocated memory
EMSCRIPTEN_KEEPALIVE
void freeArray(int *arr)
{
    free(arr);
}

// Function to initialize the array with values 1 to length
EMSCRIPTEN_KEEPALIVE
void initializeArray(int *arr, int length)
{
    for (int i = 0; i < length; i++)
    {
        arr[i] = i + 1;
    }
}
