#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
unsigned long long summation() {
    unsigned long long sum = 0; // Use unsigned long long to handle very large sums

    // Loop from 1 to 100000000 and add each number to the sum
    for (unsigned long long i = 1; i <= 10000; i++) { // Increased the loop range
        sum += i;
    }

    return sum;
}
