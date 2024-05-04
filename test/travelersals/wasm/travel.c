#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <emscripten/emscripten.h>
#include <emscripten.h>


#define MAX_CITIES 6

typedef struct {
    int x;
    int y;
} Point;

typedef struct {
    double distance;
    int *path;
    double time;
} TSPResult;

int next_permutation(int *first, int *last);
double calculateDistance(Point *points, int *path, int numCities);
TSPResult solveTSP(Point *points, int numCities);
int runTest(Point *points, int numCities);

int next_permutation(int *first, int *last) {
    if (first == last)
        return 0;
    int *i = first;
    ++i;
    if (i == last)
        return 0;
    i = last;
    --i;

    while (1) {
        int *ii = i;
        --i;
        if (*i < *ii) {
            int *j = last;
            while (!(*i < *--j))
                ;
            int temp = *i;
            *i = *j;
            *j = temp;
            for (++i, j = last; i < j; ++i, --j) {
                temp = *i;
                *i = *j;
                *j = temp;
            }
            return 1;
        }
        if (i == first) {
            for (++first, --last; first < last; ++first, --last) {
                int temp = *first;
                *first = *last;
                *last = temp;
            }
            return 0;
        }
    }
}

double calculateDistance(Point *points, int *path, int numCities) {
    double distance = 0;
    for (int i = 0; i < numCities - 1; i++) {
        int city1 = path[i];
        int city2 = path[i + 1];
        distance += sqrt(pow(points[city2].x - points[city1].x, 2) + pow(points[city2].y - points[city1].y, 2));
    }
    return distance;
}

TSPResult solveTSP(Point *points, int numCities) {
    int path[MAX_CITIES];
    for (int i = 0; i < numCities; i++)
        path[i] = i;

    double minDistance = INFINITY;
    int minPath[MAX_CITIES];

    double startTime = EM_ASM_DOUBLE({
        return performance.now();
    });

    do {
        double distance = calculateDistance(points, path, numCities);
        if (distance < minDistance) {
            minDistance = distance;
            for (int i = 0; i < numCities; i++)
                minPath[i] = path[i];
        }
    } while (next_permutation(path, path + numCities));

    double endTime = EM_ASM_DOUBLE({
        return performance.now();
    });
    double timeTaken = endTime - startTime;

    TSPResult result;
    result.distance = minDistance;
    result.path = (int *)malloc(numCities * sizeof(int));
    for (int i = 0; i < numCities; i++)
        result.path[i] = minPath[i];
    result.time = timeTaken;
    return result;
}

EMSCRIPTEN_KEEPALIVE
int runTest(Point *points, int numCities) {
    TSPResult result = solveTSP(points, numCities);

    printf("Shortest Path: ");
    for (int i = 0; i < numCities - 1; i++)
        printf("%d -> ", result.path[i]);
    printf("%d, Distance: %.2f\n", result.path[numCities - 1], result.distance);
    printf("Time taken: %.2f ms\n", result.time);

    free(result.path); // Free the allocated memory

    return 0;
}

int main() {
    Point points[MAX_CITIES] = {
        {0, 0},   // City 0
        {20, 20}, // City 1
        {30, 0},  // City 2
        {40, 10}, // City 3
        {50, 20}, // City 4
        {60, 0}   // City 5
    };

    runTest(points, MAX_CITIES); // Run the test with the maximum number of cities
    return 0;
}
