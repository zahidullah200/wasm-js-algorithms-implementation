#include <emscripten/emscripten.h>
#include <stdlib.h>

int *arr;

// Function to generate a rotated sorted array
void generateRotatedSortedArray(int size)
{
    int pivot = size / 2;
    arr = (int *)malloc(size * sizeof(int));
    if (arr == NULL)
    {
        // Handle memory allocation failure
        return;
    }
    for (int i = 0; i < size; i++)
    {
        arr[i] = (i + pivot) % size + 1;
    }
}

// Function to perform binary search on a rotated sorted array
int rotatedSortedArrayBinarySearch(int target, int size)
{
    int left = 0;
    int right = size - 1;

    while (left <= right)
    {
        int mid = (left + right) / 2;

        if (arr[mid] == target)
            return mid;

        if (arr[left] <= arr[mid])
        {
            if (arr[left] <= target && target < arr[mid])
                right = mid - 1;
            else
                left = mid + 1;
        }
        else
        {
            if (arr[mid] < target && target <= arr[right])
                left = mid + 1;
            else
                right = mid - 1;
        }
    }

    return -1;
}

// Function to free allocated memory
void freeMemory()
{
    free(arr);
}

// Exported function for binary search
EMSCRIPTEN_KEEPALIVE
int binarySearch(int target, int size)
{
    generateRotatedSortedArray(size);
    int result = rotatedSortedArrayBinarySearch(target, size);
    freeMemory();
    return result;
}
