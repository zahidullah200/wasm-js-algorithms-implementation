#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <emscripten.h>
int* path;

EMSCRIPTEN_KEEPALIVE
int* allocateResult(int n) {
    path = malloc((n + 1) * sizeof(int)); // Allocate memory for path
    if (path == NULL) {
        return NULL; // Memory allocation failed
    }
    return path; // Return pointer to allocated memory
}

EMSCRIPTEN_KEEPALIVE
void freeResult() {
    free(path); // Free allocated memory
}

int getDistance(int* distances, int i, int j, int n) {
    return distances[i * n + j];
}

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void permute(int *a, int l, int r, int *minDistance, int *minPath, int n, int* distances) {
    if (l == r) {
        int distance = 0;
        for (int i = 0; i < n; i++) {
            distance += getDistance(distances, a[i], a[i + 1], n);
        }
        if (distance < *minDistance) {
            *minDistance = distance;
            for (int i = 0; i <= n; i++) {
                minPath[i] = a[i];
            }
        }
    } else {
        for (int i = l; i <= r; i++) {
            swap((a + l), (a + i));
            permute(a, l + 1, r, minDistance, minPath, n, distances);
            swap((a + l), (a + i));
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void solveTSP(int n, int* distances) {
    int maxPermutations = 1;
    for (int i = 2; i <= n; i++) {
        maxPermutations *= i; // Calculate the maximum number of permutations
    }

    int minDistance = INT_MAX; // Set initial minimum distance to the maximum possible integer value
    int* minPath = malloc((n + 1) * sizeof(int)); // Allocate memory for the minimum path
    if (minPath == NULL) {
        return; // Memory allocation failed
    }

    // Initialize the path
    for (int i = 0; i <= n; i++) {
        minPath[i] = i;
    }

    permute(minPath, 0, n, &minDistance, minPath, n, distances);

    // Update the path with the minimum path
    for (int i = 0; i <= n; i++) {
        path[i] = minPath[i];
    }

    free(minPath); // Free memory for the minimum path
}
