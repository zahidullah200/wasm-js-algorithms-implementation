#include <emscripten.h>
#include <stdlib.h>
#include <stdint.h>

// Helper function to swap two integers
void swap(int* arr, int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// Partition function for quicksort
int partition(int* arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return (i + 1);
}

// Quick sort function
void quickSort(int* arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}


// Define exported functions
EMSCRIPTEN_KEEPALIVE
int* sortArray(int32_t* arr, size_t length) {
    quickSort(arr, 0, length - 1);
    return arr;
}

EMSCRIPTEN_KEEPALIVE
int32_t* mallocArray(size_t length) {
    return (int32_t*)malloc(length * sizeof(int32_t));
}
EMSCRIPTEN_KEEPALIVE
void freeArray(int32_t* arr) {
    free(arr);
}




