#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

// Struct to represent a pixel (RGBA)
typedef struct {
    unsigned char r, g, b, a;
} Pixel;

// Function to calculate grayscale value of a pixel
unsigned char calculateGrayscale(Pixel pixel) {
    return (unsigned char)(0.3 * pixel.r + 0.59 * pixel.g + 0.11 * pixel.b);
}

// Function declarations
int partition(Pixel* arr, int left, int right);
void quickSort(Pixel* arr, int left, int right);
Pixel* generateImageDataa(int width, int height);

// Function to sort image data based on grayscale values
EMSCRIPTEN_KEEPALIVE
void sortImageData(Pixel* imageData, int width, int height) {
    // Sort the image data based on grayscale values using Quick Sort
    quickSort(imageData, 0, width * height - 1);
}

// Quick Sort algorithm
void quickSort(Pixel* arr, int left, int right) {
    if (left >= right) return;

    int pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
}

int partition(Pixel* arr, int left, int right) {
    Pixel pivot = arr[right];
    int i = left - 1;

    for (int j = left; j <= right - 1; j++) {
        if (calculateGrayscale(arr[j]) <= calculateGrayscale(pivot)) {
            i++;
            Pixel temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    Pixel temp = arr[i + 1];
    arr[i + 1] = arr[right];
    arr[right] = temp;

    return i + 1;
}

// Function to generate random pixel value
Pixel randomPixel() {
    Pixel pixel;
    pixel.r = rand() % 256;
    pixel.g = rand() % 256;
    pixel.b = rand() % 256;
    pixel.a = 255;
    return pixel;
}

// Function to generate random image data
EMSCRIPTEN_KEEPALIVE
Pixel* generateImageDataa(int width, int height) {
    int size = width * height;
    Pixel* imageData = (Pixel*)malloc(size * sizeof(Pixel));
    if (imageData == NULL) {
        printf("Memory allocation failed\n");
        exit(1);
    }
    for (int i = 0; i < size; i++) {
        imageData[i] = randomPixel();
    }
    return imageData;
}

// Function to free memory allocated for image data
EMSCRIPTEN_KEEPALIVE
void freeImageData(Pixel* imageData) {
    free(imageData);
}
