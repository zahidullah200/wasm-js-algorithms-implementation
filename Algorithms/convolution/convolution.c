#include <emscripten.h>

// Convolution function
EMSCRIPTEN_KEEPALIVE
void applyConvolution(int* image, int* result, int width, int height) {
    // Optimized convolution logic
    for (int i = 1; i < height - 1; ++i) {
        for (int j = 1; j < width - 1; ++j) {
            // Apply the convolution operation
            int sum = 0;
            for (int m = -1; m <= 1; ++m) {
                for (int n = -1; n <= 1; ++n) {
                    int imgVal = image[(i + m) * width + (j + n)];
                    int kernelVal = 1; // Simplified kernel
                    sum += imgVal * kernelVal;
                }
            }
            result[i * width + j] = sum;
        }
    }
}

// Helper function to free memory in JavaScript
EMSCRIPTEN_KEEPALIVE
void freeMemory(int* ptr) {
    free(ptr);
}
