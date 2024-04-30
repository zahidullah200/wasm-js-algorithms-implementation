#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int testQuadraticTime() {
    int result = 0;
    for (int i = 0; i < 1000; i++) {
        for (int j = 0; j < 1000; j++) {
            result += i + j; // Quadratic time operation
        }
    }
    return result;
}
