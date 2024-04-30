#include <emscripten.h>
#include <stdlib.h>

// Function to merge two sorted arrays
void merge(int *arr, int *result, int leftIndex, int leftLength, int rightIndex, int rightLength)
{
    int resultIndex = 0;
    while (leftIndex < leftLength && rightIndex < rightLength)
    {
        if (arr[leftIndex] < arr[rightIndex])
        {
            result[resultIndex++] = arr[leftIndex++];
        }
        else
        {
            result[resultIndex++] = arr[rightIndex++];
        }
    }
    while (leftIndex < leftLength)
    {
        result[resultIndex++] = arr[leftIndex++];
    }
    while (rightIndex < rightLength)
    {
        result[resultIndex++] = arr[rightIndex++];
    }
}

// Recursive merge sort function
void mergeSort(int *arr, int *temp, int left, int right)
{
    if (left >= right)
    {
        return;
    }
    int mid = left + (right - left) / 2;
    mergeSort(arr, temp, left, mid);
    mergeSort(arr, temp, mid + 1, right);
    merge(arr, temp + left, left, mid + 1, mid + 1, right + 1);
    for (int i = left; i <= right; i++)
    {
        arr[i] = temp[i];
    }
}

// Expose mergeSort function to JavaScript
EMSCRIPTEN_KEEPALIVE
void generateAndSort(int *arr, int length)
{
    int *temp = (int *)malloc(length * sizeof(int));
    mergeSort(arr, temp, 0, length - 1);
    free(temp);
}
