// constant_time.c
#include <emscripten.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>

int *arr = NULL;

EMSCRIPTEN_KEEPALIVE
int *allocateArray(int length)
{
    if (arr != NULL)
    {
        free(arr);
    }
    arr = (int *)malloc(length * sizeof(int));
    return arr;
}

EMSCRIPTEN_KEEPALIVE
void freeArray()
{
    if (arr != NULL)
    {
        free(arr);
        arr = NULL;
    }
}

EMSCRIPTEN_KEEPALIVE
double calculatePower(int base, int exponent)
{
    return pow(base, exponent);
}
