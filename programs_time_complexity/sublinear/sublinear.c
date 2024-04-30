#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int testSublinearTime() {
    int sum = 0;
    for (int i = 1; i <= 900000009; i *= 2) {
        sum += i; // Sublinear time operation
    }
    return sum;
}
